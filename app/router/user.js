'use strict';

module.exports = app => {
  const { controller, router } = app;
  // app.router.resources('user', '/api/user', app.controller.user);  RESTful 风格 不喜欢用
  router.post('/api/user/save', controller.user.save);
  router.post('/api/user/create', controller.user.create);
  router.get('/api/user/list', controller.user.list);
};
