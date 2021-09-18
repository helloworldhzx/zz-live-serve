'use strict';

const Controller = require('egg').Controller;

class GiftController extends Controller {
  async wxpay(ctx) {
    console.log(ctx.authUser);
    const user_id = ctx.authUser.id;
    // 参数验证
    ctx.validate({
      price: {
        type: 'int',
        required: true,
        desc: '充值费用',
      },
    });
    const { price } = ctx.request.body;
    if (price < 1) {
      return ctx.apiFail('至少充值1元');
    }
    // 创建订单
    const no = ctx.randomString(20);
    const order = await ctx.model.Order.create({
      no,
      user_id,
      price,
    });
    if (!order) {
      return ctx.apiFail('创建订单失败');
    }
    // 支付
    const result = await this.app.tenpay.getAppParams({
      out_trade_no: no,
      body: '支付测试',
      total_fee: price * 100,
      trade_type: 'APP',
    });

    // ctx.logger.error('开始支付');
    // ctx.logger.error(result);
    ctx.apiSuccess(result);
  }
}

module.exports = GiftController;
