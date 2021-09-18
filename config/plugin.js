'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  valparams: {
    enable: true,
    package: 'egg-valparams',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  // 模板渲染
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  tenpay: {
    enable: true,
    package: 'egg-tenpay',
  },
  // socket
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
};
