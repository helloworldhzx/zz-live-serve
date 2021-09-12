'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async list(ctx) {
    console.log(ctx);
    const data = await ctx.page('Manager');
    console.log(JSON.stringify(data), '==============data');
    await ctx.render('manager/list.html', { data });
  }
  // 创建表单模板页面
  async create(ctx) {
    await ctx.render('manager/create.html');
  }
  async save() {
    const ctx = this.ctx;
    // ctx.throw(500, 'zzz');
    // 参数验证
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });
    const { username, password } = ctx.request.body;
    const user = await ctx.model.Manager.create({ username, password });
    ctx.apiSuccess(user);
  }
}

module.exports = UserController;

/* // RESTful 风格的 URL 定义
exports.index = async ctx => {
  ctx.body = '1234';
};

exports.new = async () => { };

exports.create = async ctx => {
  console.log(this.ctx);
  // const ctx = this.ctx;
  const { name, age } = ctx.request.body;
  const user = await ctx.model.User.create({ name, age });
  ctx.status = 201;
  ctx.body = user;
};

exports.show = async () => { };

exports.edit = async () => { };

exports.update = async () => { };

exports.destroy = async () => { }; */
