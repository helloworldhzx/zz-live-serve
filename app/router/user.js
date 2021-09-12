'use strict';

module.exports = app => {
  app.router.resources('user', '/api/user', app.controller.user);
};
