'use strict';

module.exports = (option, app) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // 记录一条错误日志
      app.emit('error', err, ctx);
      const status = err.status || 500;
      ctx.body = {
        msg: 'error',
        data: err.message,
      };

      if (status === 422) {
        ctx.body = {
          msg: 'error',
          data: err.errors,
        };
      }

      ctx.status = status;
    }
  };
};
