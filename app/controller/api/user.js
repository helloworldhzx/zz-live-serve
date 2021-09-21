'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async reg(ctx) {
    console.log('111111111111111111');
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名', range: { min: 5, max: 20 } },
      password: { type: 'string', required: true, desc: '密码' },
      repassword: { type: 'string', required: true, desc: '确认密码' },
    });
    const { username, password, repassword } = ctx.request.body;
    if (password !== repassword) {
      ctx.throw(422, '密码和确认密码不一致');
    }
    if (await ctx.model.User.findOne({
      where: {
        username,
      },
    })) {
      return ctx.throw(400, '该用户名已存在');
    }
    const user = await ctx.model.User.create({
      username,
      password,
    });

    if (!user) {
      ctx.throw(400, '创建用户失败');
    }

    ctx.apiSuccess(user);
  }
  async update(ctx) {
    console.log('===============');
    const { avatar, username } = ctx.request.body;
    const user = ctx.authUser;
    if (avatar) {
      user.avatar = avatar;
    }
    if (username) {
      user.username = username;
    }
    user.save();
    ctx.apiSuccess(user);
  }
  async login(ctx) {
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });
    const { username, password } = ctx.request.body;
    let user = await ctx.model.User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      return ctx.apiFail('用户不存在');
    }
    user = user.toJSON();
    await ctx.checkPassword(password, user.password);
    const token = ctx.getToken(user);
    user.token = token;
    delete user.password;
    // 加入缓存中
    if (!await this.service.cache.set('user_' + user.id, token)) {
      ctx.throw(400, '登录失败');
    }
    // 返回用户信息和token
    return ctx.apiSuccess(user);

  }
  async logout(ctx) {
    const current_user_id = ctx.authUser.id;

    if (!(await this.service.cache.remove('user_' + current_user_id))) {
      ctx.throw(400, '退出登录失败');
    }

    ctx.apiSuccess('ok');
  }
  async info(ctx) {
    const user = ctx.authUser;
    delete user.password;
    const follow = await ctx.model.Follow.findAll({
      where: {
        user_id: user.id,
      },
    });
    user.follow = follow || [];
    console.log(JSON.parse(JSON.stringify(user)));
    console.log(JSON.parse(JSON.stringify(follow)));
    ctx.apiSuccess({ user, follow });
  }
  async history(ctx) {
    ctx.validate({
      page: {
        required: true,
        desc: '页码',
        type: 'int',
      },
    });
    const page = ctx.params.page;
    const limit = 10;
    const offset = (page - 1) * limit;
    const user = ctx.authUser;
    let history = await ctx.model.History.findAll({
      limit, offset,
      where: {
        user_id: user.id,
      },
      include: [{
        model: this.app.model.User,
        attributes: [ 'id', 'username' ],
      }, {
        model: this.app.model.Live,
        attributes: [ 'id', 'title', 'cover', 'look_count', 'coin', 'status' ],
      }],
    });
    if (history) {
      history = history.map(item => item.live);
    }
    ctx.apiSuccess(history);
  }

  // 关注
  async follow(ctx) {
    ctx.validate({
      follow_id: {
        required: true,
        desc: '关注人id',
        type: 'int',
      },
    });
    const { follow_id } = ctx.request.body;
    const user = ctx.authUser;
    const res = await ctx.model.Follow.findOne({
      where: {
        follow_id,
        user_id: user.id,
      },
    });
    if (res) {
      return ctx.apiFail('你已关注');
    }
    const follow = await ctx.model.Follow.create({
      follow_id,
      user_id: user.id,
    });
    ctx.apiSuccess(follow);
  }
  // 用户关注列表
  async followList(ctx) {
    console.log('follow==============');
    ctx.validate({
      page: {
        required: true,
        desc: '页码',
        type: 'int',
      },
    });

    const page = ctx.params.page;
    const limit = 10;
    const offset = (page - 1) * limit;
    const user = ctx.authUser;
    const follow = await ctx.model.Follow.findAll({
      offset,
      limit,
      where: {
        user_id: user.id,
      },
      include: {
        model: this.app.model.User,
        as: 'follow_user',
        attributes: [ 'id', 'username', 'avatar' ],
      },
    });
    ctx.apiSuccess(follow);
  }
}

module.exports = UserController;
