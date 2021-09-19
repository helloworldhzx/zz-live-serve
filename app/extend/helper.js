'use strict';

module.exports = {
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = {
      timestamp: Date.now(),
      ...metadata,
    };
    console.log(metadata);
    return {
      meta,
      data: {
        action,
        payload,
      },
    };
  },
};
