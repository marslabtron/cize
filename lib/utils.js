const utils = require('real-utils');
const domain = require('domain');
const md5 = require('md5');
const request = require('request');

/**
 * 保护执行一个函数
 * @param {Function} _try 执行的函数
 * @param {Function} _catch 错误回调函数
 **/
utils.try = function (_try, _catch) {
  if (!_try) return;
  if (process.env.NODE_ENV == 'development') {
    return _try();
  }
  var dm = domain.create();
  dm.on('error', function (err) {
    dm.exit();
    if (_catch) _catch(err);
  });
  dm.run(_try);
};

/**
 * 生成一个唯一 ID
 * @param {String} str 计算字符串
 **/
utils.id = function (str) {
  return md5(str || utils.newGuid()).substr(5, 16);
};

/**
 * 空函数
 **/
utils.NOOP = function () { };

/**
 * 检查名称是否合法
 **/
utils.checkName = function (name) {
  return /^[a-z0-9\_\-\$]+$/i.test(name);
};

/**
 * 挂载 request 模块
 **/
utils.request = request;

/**
 * 获取函数的参数名列表
 **/
utils.getArgumentNames = function (fn) {
  if (!fn) return [];
  var src = fn.toString();
  var parts = src.split(')')[0].split('=>')[0].split('(');
  return (parts[1] || parts[0]).split(',').map(function (name) {
    return name.trim();
  }).filter(function (name) {
    return name != 'function';
  });
};

module.exports = utils;