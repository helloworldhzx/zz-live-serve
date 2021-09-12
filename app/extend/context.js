'use strict';
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
            <a class="page-link" href="?page=${page + 1}&pageSize=${limit}${params}" aria-label="Next">
                <span aria-hidden="true">»</span>
            <span class="sr-only">Next</span>
            </a>
        </li>
    </ul>
    `;

    this.locals.pageRender = pageRender;

    return rows;
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
};
