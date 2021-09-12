'use strict';

module.exports = app => {
  const { controller, router } = app;
  router.post('/api/manager/save', controller.manager.save);
  router.post('/api/manager/create', controller.manager.create);
  router.get('/api/manager/list', controller.manager.list);
};
