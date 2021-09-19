'use strict';

const Service = require('egg').Service;

class LiveService extends Service {
  async checkStatus(id) {
    const { ctx } = this;
    const live = await ctx.model.Live.findByPk(id);
    if (!live) {
      return '该直播间不存在';
    }
    if (live.status === 0) {
      return '该直播未开播';
    }

    if (live.status === 3) {
      return '直播间已结束';
    }

    return false;
  }
  async exist(id) {
    return this.ctx.model.Live.findByPk(id);
  }
}
module.exports = LiveService;
