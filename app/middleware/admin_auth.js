'use strict';
module.exports = () => {
  return async (ctx, next) => {
    console.log(ctx.session.auth, '=================');
    if (!ctx.session.auth) {
      ctx.toast('请先登录', 'danger');
      return ctx.redirect('/admin/login');
    }
    await next();

    if (ctx.status === 404) {
      await ctx.pageFail('页面不存在');
    }
  };
}
;
