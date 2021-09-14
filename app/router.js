'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router } = app;
  // router.post('/admin/user/save', controller.user.save);
  router.get('/admin/user/create', controller.user.create);
  router.get('/admin/user/list', controller.user.list);
  // router.get('/admin/user/delete/:id', controller.user.delete);
  // router.get('/admin/user/edit/:id', controller.user.edit);
  // router.post('/admin/user/update/:id', controller.user.update);

  router.post('/admin/manager/save', controller.manager.save);
  router.get('/admin/manager/create', controller.manager.create);
  router.get('/admin/manager/list', controller.manager.list);
  router.get('/admin/manager/delete/:id', controller.manager.delete);
  router.get('/admin/manager/edit/:id', controller.manager.edit);
  router.post('/admin/manager/update/:id', controller.manager.update);
};
