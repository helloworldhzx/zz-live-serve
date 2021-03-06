'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router, io } = app;
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

  router.get('/admin/live/list', controller.admin.live.list);
  router.get('/admin/live/look/:id', controller.admin.live.look);
  router.get('/admin/live/gift/:id', controller.admin.live.gift);
  router.get('/admin/live/comment/:id', controller.admin.live.comment);
  router.get('/admin/live/close/:id', controller.admin.live.close);
  router.get('/admin/live/delete/:id', controller.admin.live.delete);

  router.get('/admin/order/list', controller.admin.order.index);
  router.get('/admin/order/delete/:id', controller.admin.order.delete);

  // ????????????
  router.post('/api/reg', controller.api.user.reg);
  // ????????????
  router.post('/api/login', controller.api.user.login);
  // ????????????
  router.post('/api/logout', controller.api.user.logout);
  // ????????????????????????
  router.get('/api/user/info', controller.api.user.info);
  // ??????????????????
  router.post('/api/user/update', controller.api.user.update);
  // ??????????????????
  router.get('/api/user/history/:page', controller.api.user.history);
  // ????????????
  router.get('/api/user/followList/:page', controller.api.user.followList);
  // ??????
  router.post('/api/user/follow', controller.api.user.follow);

  // ?????????????????????
  router.get('/api/live/list/:page', controller.api.live.list);
  // ???????????????
  router.post('/api/live/create', controller.api.live.create);
  // ?????????????????????
  router.post('/api/live/changeStatus', controller.api.live.changeStatus);
  router.post('/api/wxpay', controller.api.gift.wxpay);
  router.post('/api/upload', controller.admin.common.upload);
  // ????????????
  router.get('/api/gift/list', controller.api.gift.list);
  // ???????????????
  router.get('/api/live/read/:id', controller.api.live.read);

  // io.of('/').route('test', io.controller.nsp.test);
  io.of('/').route('joinLive', io.controller.nsp.joinLive);
  io.of('/').route('leaveLive', io.controller.nsp.leaveLive);
  io.of('/').route('comment', io.controller.nsp.comment);
  io.of('/').route('gift', io.controller.nsp.gift);
};
