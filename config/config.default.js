/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1631350101053_128';

  // add your middleware config here
  // adminAuth后台接口权限， auth  api接口权限
  config.middleware = [ 'error', 'adminAuth', 'auth' ];
  config.auth = {
    match: [
      '/api/logout',
      '/api/live/create',
      '/api/live/changestatus',
      '/api/wxpay',
      '/api/user/info',
      '/api/user/update',
      '/api/user/history',
      '/api/user/follow',
      '/api/user/followList',
    ],
  };
  config.adminAuth = {
    ignore: [
      '/api',
      '/admin/login',
      '/admin/loginevent',
    ],
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.webUrl = 'http://127.0.0.1:7001';
  config.security = {
    // csrf
    csrf: {
      headerName: 'x-csrf-token',
      ignore: ctx => {
        return ctx.request.url.startsWith('/api');
      },
    },
    // 跨域白名单
    // domainWhiteList: [ 'http://localhost:8080' ],
  };
  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT, POST, DELETE, PATCH',
  };

  config.io = {
    init: {
      wsEngine: 'ws',
    },
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
  };

  // 模板渲染配置
  config.view = {
    mapping: {
      '.html': 'nunjucks',
    },
  };

  // 参数验证配置
  config.valparams = {
    locale: 'zh-cn',
    throwError: true,
  };

  // token秘钥配置
  config.jwt = {
    secret: 'zzqhdgw@45ncashdaksh2!#@3nxjdas*_672',
  };

  // redis存储
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 2,
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    port: 3306,
    database: 'egg-live',
    // 中国时区
    timezone: '+08:00',
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_at updated_at
      timestamps: true,
      // 字段生成软删除时间戳 deleted_at
      // paranoid: true,
      createdAt: 'created_time',
      updatedAt: 'updated_time',
      // deletedAt: 'deleted_time',
      // 所有驼峰命名格式化
      underscored: true,
    },
  };
  // 加密秘钥
  config.crypto = {
    secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672',
  };
  config.multipart = {
    fileSize: '50mb',
    mode: 'stream',
    fileExtensions: [ '.xls', '.txt', '.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF', '.jpeg', '.JPEG' ], // 扩展几种上传的文件格式
  };

  config.webUrl = 'http://127.0.0.1:7001';
  // 微信支付配置（最好改成你自己的）
  config.tenpay = {
    client: {
      appid: 'wxc559eade7d0a3bde',
      mchid: '1554108981',
      partnerKey: '8b07811ec793049f1c97793464c7049f',
      notify_url: config.webUrl + '/api/gift/notify',
      // sandbox: true
    },
  };

  // 推流拉流设置
  config.mediaServer = {
    rtmp: {
      port: 23480,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 23481,
      allow_origin: '*',
    },
    auth: {
      play: true,
      publish: true,
      secret: 'nodemedia2017privatekey',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
