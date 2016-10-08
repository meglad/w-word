# w-word

[![npm](https://img.shields.io/npm/v/w-word.svg)](https://www.npmjs.com/package/w-word)
[![license](https://img.shields.io/npm/l/w-word.svg)](https://www.npmjs.com/package/w-word)

## 热更新敏感词过滤模块

## 安装

> $ npm install w-word

## #接口 api

```js
var word = require('w-word');

// 启动监听敏感词文件 改变 自动更新
var path = __dirname + '/test/word.txt'; // 敏感词文件路径
var time = 10 * 60 * 1000;	// 监听间隔时间 默认 10 * 60 * 10000 ms (10分钟)
word.watch(path, time);

// 判断是否含有敏感词
var msg = "这个需要判断敏感词的字符串";
var is = word.check(msg);

// 替换敏感词为指定文字
var str = '**'; // 需要替换成的文字 默认 **
var msg = word.filter(msg, str);

```

## #主要功能

* 定时自动检测敏感词文件是否更新 (热更新敏感词)
* 词库文件可用 逗号、空格、换行 分隔词组
* 判断是否含有敏感词
* 替换敏感词为指定文字

## #License

The MIT License (http://opensource.org/licenses/MIT)