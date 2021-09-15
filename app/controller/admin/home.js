'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index(ctx) {
    await ctx.render('index.html');
  }
  async login(ctx) {
    let toast = ctx.cookies.get('toast', { encrypt: true });
    toast = toast ? JSON.parse(toast) : null;
    await ctx.render('login.html', {
      toast,
    });
  }
  async loginevent(ctx) {
    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        required: true,
        desc: '用户名',
      },
      password: {
        type: 'string',
        required: true,
        desc: '密码',
      },
    });

    const { username, password } = ctx.request.body;

    const manager = await ctx.model.Manager.findOne({
      where: {
        username,
      },
    });
    if (!manager) {
      ctx.throw(400, '用户不存在或已被禁用');
    }

    // 密码验证
    await ctx.checkPassword(password, manager.password);

    // 存储session中
    ctx.session.auth = manager;

    return ctx.apiSuccess('ok');
  }
  async logout() {
    const { ctx } = this;
    // 清除session
    ctx.session.auth = null;
    ctx.toast('退出登录成功', 'success');
    ctx.redirect('/admin/login');
  }
}

module.exports = HomeController;
