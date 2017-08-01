const staticCache = require('koa-static-cache');
const compose = require('koa-compose');
const LRU = require("lru-cache");
const mkdirp = require('mkdirp');

module.exports = (options, app) => {
  const middlewares = [];
  options.queue.forEach(opt => {
    assign(options, opt, ['queue', 'dir']);
    const dirs = Array.isArray(opt.dir) ? opt.dir : [opt.dir];
    dirs.forEach(dir => {
      mkdirp.sync(dir);
      middlewares.push(staticCache(dir, opt));
    });
  });

  return compose(middlewares);
};

function assign(src, tar, exclude = []) {
  Object.keys(src).forEach(k => {
    if (exclude.indexOf(k) < 0) {
      tar[k] = src[k];
    }
  });
}
