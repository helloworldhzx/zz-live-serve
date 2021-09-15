'use strict';
const crypto = require('crypto');
module.exports = {
  // 成功提示
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.body = { msg, data };
    this.status = code;
  },
  // 失败提示
  apiFail(data = '', msg = 'fail', code = 400) {
    this.body = { msg, data };
    this.status = code;
  },
  async pageFail(data = '', code = 404) {
    return await this.render('404.html', {
      data, code,
    });
  },
  async page(modelName, where = {}, options = {}) {
    const { pageNum, pageSize, ...query } = this.query;
    const page = pageNum ? parseInt(pageNum) : 1;
    const limit = pageSize ? parseInt(pageSize) : 10;
    const offset = (page - 1) * limit;

    if (!options.order) {
      options.order = [
        [ 'id', 'DESC' ],
      ];
    }

    const { count, rows } = await this.model[modelName].findAndCountAll({
      where,
      offset,
      limit,
      ...options,
    });
    // 总页数
    const totalPage = Math.ceil(count / limit);
    const params = this.urlEncode(query);

    let pageEl = '';
    for (let index = 1; index <= totalPage; index++) {
      let active = '';
      if (page === index) {
        active = 'active';
      }
      pageEl += `
            <li class="page-item ${active}">
            <a class="page-link" href="?pageNum=${index}&pageSize=${limit}${params}">${index}</a></li>
            `;
    }

    const preDisabled = page <= 1 ? 'disabled' : '';
    const nextDisabled = page >= totalPage ? 'disabled' : '';

    const pageRender = `
    <ul class="pagination">
        <li class="page-item ${preDisabled}">
            <a class="page-link" href="?pageNum=${page - 1}&pageSize=${limit}${params}" aria-label="Previous">
                <span aria-hidden="true">«</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>

        ${pageEl}

        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="?pageNum=${page + 1}&pageSize=${limit}${params}" aria-label="Next">
                <span aria-hidden="true">»</span>
            <span class="sr-only">Next</span>
            </a>
        </li>
    </ul>
    `;

    this.locals.pageRender = pageRender;

    return rows;
  },
  async renderTemplate(params = {}) {
    // 获取cookie中的消息提示（闪存）
    const toast = this.cookies.get('toast', {
      // 中文需要解密
      encrypt: true,
    });
    console.log(toast);
    params.toast = toast ? JSON.parse(toast) : null;
    await this.render('template.html', params);
  },
  // 对象转&拼接字符串
  urlEncode(param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    const t = typeof (param);
    if (t === 'string' || t === 'number' || t === 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
      for (const i in param) {
        const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += this.urlEncode(param[i], k, encode);
      }
    }
    return paramStr;
  },
  toast(msg, type = 'danger') {
    this.cookies.set('toast', JSON.stringify({
      msg, type,
    }), {
      maxAge: 1500,
      encrypt: true,
    });
  },
  // 验证密码
  async checkPassword(password, hash_password) {
    // 先对需要验证的密码进行加密
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret);
    hmac.update(password);
    password = hmac.digest('hex');
    console.log(password);
    const res = password === hash_password;
    if (!res) {
      this.throw(400, '密码错误');
    }
    return true;
  },
};
