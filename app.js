const co = require('co');
const _  = require('lodash');

const config = require('./config/slack.json');
const tasks  = require('./config/task.json');

const cron     = require('./lib/cron')();
const slackApi = require('./lib/slackApi.js');
const rss      = require('./lib/rss');
const api      = new slackApi(config.token);
const model    = require('./lib/model.js');
const libs     = require('./lib/libs.js');
const logger   = require('./lib/log.js');

const base = {
  channel: config.channel.id,
  as_user: true
};

function run() {
  logger.app.info('APP: START');
  setTasks();
  cron.startAll();
}

function setTasks() {
  _.each(tasks, (task, title) => {
    cron.set(title, task.time, (done) => {
      co(function *() {
        logger.app.info(`TASK:[START]: ${title}`);
        const datas = yield rss.getData(task.rss);
        postNews(datas);
        saveDb(datas);
        logger.app.info(`TASK:[END]: ${title}`);
        done();
      }).catch((e) => {
        logger.error.error(e);
      });
    });
  });
}

function postNews(datas) {
  const fields = [];
  datas.items.forEach((v) => {
    if (model.isExist('Page', 'hash', libs.hash(v.link))) return;

    fields.push({
      title: v.title,
      value: v.link,
      short: false
    });
  });
  
  const params = Object.assign({}, base, {
    attachments: [{
      fallback: datas.title,
      color: '#439FE0',
      title: datas.title,
      title_link: datas.url,
      text: datas.desc,
      fields,
      author_name: 'NEWS'
    }]
  });

  if (fields.length > 0) {
    api.postMessage(params, function(err, res) {
      console.log(err);
      console.log(res);
    });
  }
}

function saveDb (datas) {
  const pages = addPages(datas.items);
  const site = model.getSites((sites) => {
    const siteHash = libs.hash(datas.url);
    return sites.filtered(`hash == "${siteHash}"`);
  });

  if (site.length < 1) {
    addSite(datas, pages);
  } else {
    updateSite(site[0], pages);
  }
}

function addSite(item, pages) {
  model.addSite(item.title, item.url, pages);
}

function updateSite(site, pages) {
  model.updateSite(site, pages);
}

function addPages(items) {
  const pages = [];
  items.forEach((item) => {
    let page = model.addPage(item.title, item.link);
    if (!_.isNull(page)) pages.push(page);
  });

  return pages;
}

function addPage(title, url) {
  const page = model.addPage(title, url);
  return page;
}

// 実行
run();
