'use strict';

const Realm = require('realm');
const libs  = require('./libs.js');
const _     = require('lodash');

const schemas = require(`${__dirname}/../config/schemas.json`);
const dbpath = `${__dirname}/../realmdb/app`;

function Model() {
  this.realm = new Realm({
    path: dbpath,
    schema: libs.toArray(schemas)
  });
}

Model.prototype.addSite = function(title, url, pages) {
  let site = null;
  this.realm.write(() => {
    site = this.realm.create('Site', {
      uuid: libs.uuid(),
      title: title,
      hash: libs.hash(url),
      url: url,
      pages: pages,
      created_at: libs.time()
    });
  });
  return site;
}

Model.prototype.updateSite = function(site, pages) {
  this.realm.write(() => {
    pages.forEach((page) => {
      site.pages.push(page);
    });
  });
}

Model.prototype.addPage = function(title, url) {
  if (this.isExist('Page', 'hash', libs.hash(url))) return null;

  let page = null;
  this.realm.write(() => {
    page = this.realm.create('Page', {
      uuid: libs.uuid(),
      title: title,
      url: url,
      hash: libs.hash(url),
      created_at: libs.time()
    });
  });
  return page;
}

Model.prototype.getSites = function(cb) {
  const sites = this.realm.objects('Site');
  if (_.isUndefined(cb)) return sites;
  return cb(sites);
};

Model.prototype.getPages = function(cb) {
  const pages = this.realm.objects('Page');
  if (_.isUndefined(cb)) return pages;
  return cb(pages);
};

Model.prototype.isExist = function(tbl, key, val) {
  const data = this.realm.objects(tbl).filtered(`${key} == '${val}'`);
  return (_.values(data).length === 0)? false : true;
};

module.exports = new Model;
