'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async list(ctx) {
    const data = await ctx.page('User');
    await ctx.renderTemplate({
      title: '管理员列表',
      tempType: 'table',
      table: {
        tableUrl: '/admin/user/list',
        // 按钮
        buttons: {
          // 新增操作
          add: '/admin/user/create',
        },
        // 表头
        columns: [{
          title: '用户名',
          fixed: 'left',
          key: 'username',
        }, {
          title: '创建时间',
          fixed: 'center',
          width: 180,
          key: 'created_time',
        }, {
          title: '操作',
          width: 200,
          fixed: 'center',
          action: {
            edit(id) {
              return `/admin/user/edit/${id}`;
            },
            delete(id) {
              return `/admin/user/delete/${id}`;
            },
          },
        }],
      }, data });
  }
  // 创建表单模板页面
  async create(ctx) {
    await ctx.renderTemplate({
      // 页面标题
      title: '创建用户',
      // 模板类型 form表单，table表格分页
      tempType: 'form',
      // 表单配置
      form: {
        // 提交地址
        action: '/admin/user/save',
        // 字段配置
        fields: [{
          label: '用户名',
          type: 'text',
          name: 'username',
          placeholder: '用户名',
        }, {
          label: '密码',
          type: 'text',
          name: 'password',
          placeholder: '密码',
        }, {
          label: '头像',
          type: 'file',
          name: 'avatar',
          placeholder: '头像',
        }, {
          label: '金币',
          type: 'number',
          name: 'coin',
          placeholder: '金币',
        }],
      },
      // 新增成功跳转路径
      successUrl: '/admin/user/list',
    });
  }
  async save() {
    const ctx = this.ctx;
    // ctx.throw(500, 'zzz');
    // 参数验证
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });
    const { name, age } = ctx.request.body;
    const user = await ctx.model.User.create({ name, age });
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
