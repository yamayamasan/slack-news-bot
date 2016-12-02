'use strict';

const co       = require('co');
const request  = require('co-request');
const parseXml = require('xml2js').parseString;
const _        = require('lodash');

module.exports.getData = (rss) => {
  return new Promise((resolve) => {
    co(function *(){
      const res = yield request(rss);
      const body = res.body;

      const datas = {
        title: null,
        url: null,
        desc: null,
        items: []
      };
      parseXml(body, {trim: true}, (err, r) => {
        const json = r.rss.channel[0];
        datas.title = json.title[0];
        datas.url = json.link[0];
        datas.desc = json.description[0];
        _.each(json.item, (v) => {
          let link = null;
          if (v.link && v.link[0] && typeof v.link[0] === 'string') {
            link = v.link[0];
          } else if (v.guid && v.guid[0]) {
            link = v.guid[0];
          }
          if (!link) return false;
          datas.items.push({
            title: v.title[0],
            link: link
          });
        });
        resolve(datas);
      });
    }).catch((e) => {
      console.log(e);
    });
  });
};

