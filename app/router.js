'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router } = app;
  router.get('/admin', controller.admin.home.index);
  router.get('/admin/logout', controller.admin.home.logout);
  router.get('/admin/login', controller.admin.home.login);
  router.post('/admin/loginevent', controller.admin.home.loginevent);
  router.post('/admin/upload', controller.admin.common.upload);


  router.post('/admin/user/save', controller.admin.user.save);
  router.get('/admin/user/create', controller.admin.user.create);
  router.get('/admin/user/list', controller.admin.user.list);
  router.get('/admin/user/delete/:id', controller.admin.user.delete);
  router.get('/admin/user/edit/:id', controller.admin.user.edit);
  router.post('/admin/user/update/:id', controller.admin.user.update);

  router.post('/admin/manager/save', controller.admin.manager.save);
  router.get('/admin/manager/create', controller.admin.manager.create);
  router.get('/admin/manager/list', controller.admin.manager.list);
  router.get('/admin/manager/delete/:id', controller.admin.manager.delete);
  router.get('/admin/manager/edit/:id', controller.admin.manager.edit);
  router.post('/admin/manager/update/:id', controller.admin.manager.update);

  router.get('/admin/gift/list', controller.admin.gift.list);
  router.get('/admin/gift/create', controller.admin.gift.create);
  router.post('/admin/gift/save', controller.admin.gift.save);
  router.get('/admin/gift/edit/:id', controller.admin.gift.edit);
  router.post('/admin/gift/update/:id', controller.admin.gift.update);
  router.get('/admin/gift/delete/:id', controller.admin.gift.delete);
};
