'use strict';

const Controller = require('egg').Controller;

class LiveController extends Controller {
  async list(ctx) {
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

    const res = await ctx.model.Live.findAll({
      limit, offset,
    });
    ctx.apiSuccess(res);
  }
}

module.exports = LiveController;
