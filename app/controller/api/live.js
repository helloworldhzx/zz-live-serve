'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5');
class LiveController extends Controller {
  async create(ctx) {
    // 参数验证
    ctx.validate({
      title: {
        required: true,
        type: 'string',
        desc: '直播间标题',
      },
      cover: {
        required: false,
        type: 'string',
        desc: '直播间封面',
      },
    });
    const user_id = ctx.authUser.id;
    // 判断是否有在开播的直播间中。。。
    const live = await ctx.model.Live.findOne({
      where: {
        user_id,
        status: 1,
      },
    });
    if (live) {
      return ctx.apiFail('你已有在直播中的直播间');
    }
    const { title, cover } = ctx.request.body;
    const key = ctx.randomString(20);
    const res = await ctx.model.Live.create({
      title, cover, key, user_id,
    });
    // 生成签名
    const sign = this.sign(key);
    console.log(sign);
    ctx.apiSuccess({
      data: res,
      sign,
    });
  }
  // 生成签名
  sign(key) {
    const { app } = this;
    const secret = app.config.mediaServer.auth.secret;
    const expire = parseInt((Date.now() + 100000000) / 1000);
    const hashValue = md5(`/live/${key}-${expire}-${secret}`);
    return `${expire}-${hashValue}`;
  }
  async list(ctx) {
    ctx.validate({
      page: {
        required: true,
        desc: '页码',
        type: 'int',
      },
      user_id: {
        required: false,
        desc: '用户ID',
        type: 'int',
      },
    });
    console.log(ctx.query, ctx.request.body, '=========where');

    const page = ctx.params.page;
    const limit = 10;
    const offset = (page - 1) * limit;
    const where = {};
    if (ctx.query.user_id) {
      where.user_id = ctx.query.user_id;
    }
    const res = await ctx.model.Live.findAll({
      where, limit, offset,
    });
    ctx.apiSuccess(res);
  }
  // 修改直播间状态
  async changeStatus() {
    const { ctx, app } = this;
    const user_id = ctx.authUser.id;
    console.log('logout===============');
    // 参数验证
    ctx.validate({
      id: {
        type: 'int',
        required: true,
        desc: '直播间ID',
      },
      type: {
        type: 'string',
        required: true,
        range: {
          in: [ 'play', 'pause', 'stop' ],
        },
      },
    });

    const { id, type } = ctx.request.body;

    const live = await app.model.Live.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!live) {
      return ctx.apiFail('该直播间不存在');
    }

    if (live.status === 3) {
      return ctx.apiFail('该直播间已结束');
    }

    const status = {
      play: 1,
      pause: 2,
      stop: 3,
    };

    live.status = status[type];
    await live.save();

    if (type === 'stop' || type === 'pause') {
      const nsp = app.io.of('/');
      const room = 'live_' + live.id;
      let message = '直播已关闭';
      if (type === 'pause') message = '直播暂停中....';
      nsp.to(room).emit('changeLiveStatus', {
        status: live.status,
        message,
      });
    }

    ctx.apiSuccess('ok');
  }
  async read(ctx) {
    const { id } = ctx.params;
    ctx.validate({
      id: {
        required: true,
        desc: '直播间ID',
        type: 'int',
      },
    });
    const live = await ctx.model.Live.findOne({
      where: {
        id,
      },
      include: [{
        model: ctx.model.User,
        attributes: [ 'id', 'username', 'avatar' ],
      }],
    });
    if (!live) {
      return ctx.apiFail('该直播间不存在');
    }

    // 生成签名
    let sign = null;

    // 直播未结束
    if (live.status !== 3) {
      sign = this.sign(live.key);
    }

    ctx.apiSuccess({
      data: live,
      sign,
    });
  }
}

module.exports = LiveController;
