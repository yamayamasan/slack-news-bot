'use strict'

const cronJob = require('cron').CronJob;

function Cron () {
  if (!(this instanceof Cron)) return new Cron();
  this.jobs = {};
}

Cron.prototype.set = function (key, cronTime, onTick, onComplete) {
  if (!onComplete) onComplete = function () {
    console.log('process end jobs', key);
  }

  this.jobs[key] = new cronJob({
    cronTime,
    onTick,
    onComplete,
    start: false,
    timeZone: 'Asia/Tokyo'
  });
};

Cron.prototype.startAll = function () {
  const jobs = this.list();
  jobs.forEach((v) => {
    this.start(v);
  });
}

Cron.prototype.start = function (key) {
  this.jobs[key].start();
};

Cron.prototype.list = function () {
  return Object.keys(this.jobs);
};

Cron.prototype.del = function (key) {
  delete this.jobs[key];
  this.jobs = this.jobs;
};

function exist (key) {
  if (this.jobs[key]) return true;
  return false;
}

module.exports = Cron;
