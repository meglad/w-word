var crypto = require('crypto');
var fs = require('fs');
var switchWord = require('./lib/switchWord');

var regexp = new RegExp();
var fileMD5;
var inited;

function handle(path, isSync) {
  if (isSync) {
    try {
      var text = fs.readFileSync(path, 'utf8');
      reg(text);
    } catch (err) {
      console.error('w-word watch error: %j', err && err.message ? err.message : err);
    }
  } else {
    new Promise(function(resolve, reject) {
      fs.readFile(String(path), 'utf8', function(err, data) {
        return err === null ? resolve(data) : reject(err);
      });
    }).then(function(text) {　　
      reg(text);
    }).catch(function(err) {
      console.error('w-word watch error: %j', err && err.message ? err.message : err);
    });
  }
}

function reg(text) {
  var md5 = crypto.createHash('md5').update(text).digest('hex');
  if (fileMD5 !== md5) {
    fileMD5 = md5;
    text = text.replace(/[,]|[，]|[ ]|[\r\n]|[\n]/gi, "|");
    text = text.replace(/([\+]|[\?]|[\/])/gi, '\\$1');
    text = switchWord.simple(text); // 转简体
    regexp = new RegExp(text, 'gi');
  }
}

function inject(text) {
  text = text.toLowerCase();
  text = switchWord.special(text);
  text = switchWord.simple(text);
  return text;
}

/**
 * 监听屏蔽词变化
 * @param  {string} path    监听文件路径
 * @param  {number} timeout 监听时间间隔
 */
function watch(path, timeout) {
  if (inited) {
    return;
  }
  inited = true;
  handle(path, true);

  setTimeout(function() {
    handle(path);
  }, timeout || 10 * 60 * 1000);
}


/**
 * 检查是否有敏感词
 * @param  {string} text 内容文字
 * @return {boolean}    是否有敏感词
 */
function check(text) {
  text = inject(text);
  var isCheck = regexp.test(text);
  regexp.lastIndex = 0; // 防止在正则全局检索时连续执行函数 导致 lastTndex 不归零 返回结果不正确的问题
  return isCheck;
}

/**
 * 过滤替换敏感词
 * @param  {string} text 内容文字
 * @param  {string} str 替换文字
 * @return {string}     过滤之后的内容文字
 */
function filter(text, str) {
  text = inject(text);
  return text.replace(regexp, str || '**');
}

exports.watch = watch;

exports.check = check;

exports.filter = filter;
