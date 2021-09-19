'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {
  async checkToken(token, meta) {
    const { ctx } = this;
    const id = ctx.socket.id;
    if (!token) {
      ctx.socket.emit(id, ctx.helper.parseMsg('error', '请先登录', meta));
      return false;
    }

    // 解析token获取用户信息
    let user = {};
    try {
      user = ctx.checkToken(token);
    } catch (error) {
      const fail = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
      ctx.socket.emit(id, ctx.helper.parseMsg('error', fail, meta));
      return false;
    }

    // 判断用户是否登录
    const t = await ctx.service.cache.get('user_' + user.id);
    if (!t || t !== token) {
      ctx.socket.emit(id, ctx.helper.parseMsg('error', 'Token 令牌不合法!', meta));
      return false;
    }
    user = await ctx.model.User.findOne({
      where: {
        id: user.id,
      },
    });
    // 判断用户是否存在
    if (!user) {
      ctx.socket.emit(id, ctx.helper.parseMsg('error', '用户不存在', meta));
      return false;
    }

    return user;
  }
  async joinLive() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const id = ctx.socket.id;
    const { live_id, token } = message;
    // 判断用户是否登录
    const user = await this.checkToken(token);
    if (!user) {
      return;
    }

    // 判断直播间状态
    const msg = await ctx.service.live.checkStatus(live_id);
    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg));
      return;
    }

    // 加入房间
    const room = 'live_' + live_id;
    socket.join(room);

    const rooms = [ room ];
    // 用户列表加入redis存储中
    let list = await ctx.service.cache.get('userList_' + room);
    list = list ? list : [];
    list.unshift({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    });
    ctx.service.cache.set('userList_' + room, list);
    console.log(list, '=============');

    // 直播添加用户访问记录
    await ctx.model.LiveUser.create({
      user_id: user.id,
      live_id,
    });
    // 总观看人数+1
    const live = await ctx.service.live.exist(live_id);
    if (live) {
      live.increment({
        look_count: 1,
      });
    }

    // 通知在房间的其他用户
    nsp.adapter.clients(rooms, (err, clients) => {
      // 更新在线用户列表
      nsp.to(room).emit('online', {
        clients,
        action: 'join',
        user: {
          id: user.id,
          name: user.username,
          avatar: user.avatar,
        },
        look_count: live.look_count,
        data: list,
      });
    });
  }

  async leaveLive() {
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    // 接收参数
    const message = ctx.args[0] || {};

    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;

    const { live_id, token } = message;

    // 验证用户token
    const user = await this.checkToken(token, { notoast: true });
    if (!user) {
      return;
    }
    // 验证当前直播间是否存在或是否处于直播中
    const msg = await service.live.checkStatus(live_id);
    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg, {
        notoast: true,
      }));
      return;
    }

    const room = 'live_' + live_id;
    // 用户离开房间
    socket.leave(room);
    const rooms = [ room ];
    // 更新redis存储
    let list = await service.cache.get('userList_' + room);

    if (list) {
      list = list.filter(item => item.id !== user.id);

      service.cache.set('userList_' + room, list);
    }
    // 更新在线用户列表
    nsp.adapter.clients(rooms, (err, clients) => {
      nsp.to(room).emit('online', {
        clients,
        action: 'leave',
        user: {
          id: user.id,
          name: user.username,
          avatar: user.avatar,
        },
        data: list,
      });
    });
  }

  // 直播间发送消息
  async comment() {
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    // 接收参数
    const message = ctx.args[0] || {};

    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;

    const { live_id, token, data } = message;
    if (!data) {
      socket.emit(id, ctx.helper.parseMsg('error', '评论内容不能为空'));
      return;
    }
    // 验证用户token
    const user = await this.checkToken(token);
    if (!user) {
      return;
    }
    // 验证当前直播间是否存在或是否处于直播中
    const msg = await service.live.checkStatus(live_id);
    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg));
      return;
    }

    const room = 'live_' + live_id;
    // 推送消息到直播间
    nsp.to(room).emit('comment', {
      user: {
        id: user.id,
        name: user.nickname || user.username,
        avatar: user.avatar,
      },
      id: ctx.randomString(10),
      content: data,
    });

    app.model.Comment.create({
      content: data,
      live_id,
      user_id: user.id,
    });

  }
  // 直播间发送消息
  async gift() {
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    // 接收参数
    const message = ctx.args[0] || {};

    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;

    const { live_id, token, gift_id } = message;
    if (!gift_id) {
      socket.emit(id, ctx.helper.parseMsg('error', '礼物不能为空'));
      return;
    }
    // 验证用户token
    const user = await this.checkToken(token);
    if (!user) {
      return;
    }
    // 验证当前直播间是否存在或是否处于直播中
    const msg = await service.live.checkStatus(live_id);
    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg));
      return;
    }

    // 验证礼物是否存在
    const gift = await app.model.Gift.findOne({
      where: {
        id: gift_id,
      },
    });

    if (!gift) {
      socket.emit(id, ctx.helper.parseMsg('error', '该礼物不存在'));
      return;
    }

    // 当前用户金币是否不足
    if (user.coin < gift.coin) {
      socket.emit(id, ctx.helper.parseMsg('error', '金币不足，请先充值'));
      return;
    }

    // 扣除金币
    user.coin -= gift.coin;
    await user.save();

    // 写入到礼物记录表
    app.model.LiveGift.create({
      live_id,
      user_id: user.id,
      gift_id,
    });

    // 直播间总金币数+1
    const live = await app.model.Live.findOne({
      where: {
        id: live_id,
      },
    });
    live.coin += gift.coin;
    live.save();

    const room = 'live_' + live_id;
    // 推送消息到直播间
    console.log('=====================');
    nsp.to(room).emit('gift', {
      avatar: user.avatar,
      username: user.nickname || user.username,
      gift_name: gift.name,
      gift_image: gift.image,
      gift_coin: gift.coin,
      num: 1,
    });

  }
}

module.exports = NspController;
