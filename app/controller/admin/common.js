'use strict';

const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
// 故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const uploadBasePath = 'app/public/upload'; // 默认文件保存路径

const Controller = require('egg').Controller;

class CommonController extends Controller {
  async upload(ctx) {
    const stream = await ctx.getFileStream();
    console.log(stream);
    // 生成唯一文件名
    const filename = `${Date.now()}${path.extname(stream.filename)}`;
    // 生成文件夹
    const dirname = dayjs(Date.now()).format('YYYY/MM/DD');
    function mkdirsSync(dirname) {
      if (fs.existsSync(dirname)) {
        return true;
      }
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
    mkdirsSync(path.join(uploadBasePath, dirname));
    // 生成写入路径
    const target = path.join(uploadBasePath, dirname, filename);

    // 写入流
    const writeStream = fs.createWriteStream(target);

    try {
      // 异步把文件流写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (error) {
      // 出现错误，关闭管道
      await sendToWormhole(stream);
      this.ctx.throw(500, error);
    }

    const url = path.join('/public/upload', dirname, filename).replace(/\\|\//g, '/');

    this.ctx.apiSuccess({ url });
  }
}

module.exports = CommonController;
