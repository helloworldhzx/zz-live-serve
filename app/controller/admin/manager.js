'use strict';

const Controller = require('egg').Controller;

class ManagerController extends Controller {
  async list(ctx) {
    const data = await ctx.page('Manager');
    await ctx.renderTemplate({
      title: '管理员列表',
      tempType: 'table',
      table: {
        tableUrl: '/admin/manager/list',
        // 按钮
        buttons: {
          // 新增操作
          add: '/admin/manager/create',
        },
        // 表头
        columns: [{
          title: '管理员',
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
              return `/admin/manager/edit/${id}`;
            },
            delete(id) {
              return `/admin/manager/delete/${id}`;
            },
          },
        }],
      }, data });
  }
  // 创建表单模板页面
  async create(ctx) {
    await ctx.renderTemplate({
      // 页面标题
      title: '创建管理员',
      // 模板类型 form表单，table表格分页
      tempType: 'form',
      // 表单配置
      form: {
        // 提交地址
        action: '/admin/manager/save',
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
        }],
      },
      // 新增成功跳转路径
      successUrl: '/admin/manager/list',
    });
  }
  async save() {
    const ctx = this.ctx;
    // 参数验证
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });
    const { username, password } = ctx.request.body;

    if (await ctx.model.Manager.findOne({
      where: {
        username,
      },
    })) {
      return ctx.apiFail('该管理员已存在');
    }

    const manager = await ctx.model.Manager.create({
      username, password,
    });

    ctx.apiSuccess(manager);
  }
  async edit(ctx) {
    const { id } = ctx.params;
    console.log(id);
    const res = await ctx.model.Manager.findByPk(id);
    const data = res.toJSON();
    if (!data) {
      return ctx.apiFail('当前用户不存在');
    }
    delete data.password;
    await ctx.renderTemplate({
      id,
      // 页面标题
      title: '修改管理员',
      // 模板类型 form表单，table表格分页
      tempType: 'form',
      // 表单配置
      form: {
        // 提交地址
        action: '/admin/manager/update/' + id,
        data,
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
        }],
      },
      // 新增成功跳转路径
      successUrl: '/admin/manager/list',
    });
  }
  async update(ctx) {
    ctx.validate({
      id: { type: 'int', required: true },
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: false, desc: '密码' },
    });
    const id = ctx.params.id;
    const { username, password } = ctx.request.body;
    const manager = await ctx.model.Manager.findByPk(id);
    if (!manager) {
      return ctx.apiFail('当前用户不存在');
    }
    const Op = this.app.Sequelize.Op;
    if (await ctx.model.Manager.findOne({
      where: {
        username,
        id: {
          [Op.ne]: id,
        },
      },
    })) {
      return ctx.apiFail('当前用户已存在');
    }
    manager.username = username;
    if (password) {
      manager.password = password;
    }

    ctx.apiSuccess(await manager.save());
  }
  async delete(ctx) {
    const id = ctx.params.id;
    await ctx.model.Manager.destroy({
      where: {
        id,
      },
    });
    ctx.toast('删除成功', 'success');
    ctx.redirect('/admin/manager/list');
  }
}

module.exports = ManagerController;


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
