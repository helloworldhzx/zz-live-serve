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
      return ctx.apifail('用户已存在');
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
    user = user.toJSON();
    if (!user) {
      ctx.apifail('用户不存在');
    }
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
    console.log('===============');
    const user = ctx.authUser;
    delete user.password;
    ctx.apiSuccess(user);
  }
}

module.exports = UserController;
