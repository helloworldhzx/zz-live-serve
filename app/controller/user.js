'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index(ctx) {
    console.log(ctx);
    ctx.body = '123';
  }
  async new(ctx) {
    console.log(ctx);
  }
  async create() {
    const ctx = this.ctx;
    // ctx.throw(500, 'zzz');
    ctx.validate({
      name: { type: 'string', required: true, desc: '名称' },
      age: { type: 'number', required: false, desc: '年龄', defValue: '18' },
    });
    const { name, age } = ctx.request.body;
    const user = await ctx.model.User.create({ name, age });
    ctx.apiSuccess(user);
  }
  async show(ctx) {
    console.log(ctx);
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
