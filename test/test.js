var assert = require('assert');
var fs = require('fs');
var word = require('../index');
var switchWord = require('../lib/switchWord');
// 还原词库用
var wordText = fs.readFileSync(__dirname + '/word.txt', 'utf8');

describe('lib/switchWord', function() {
  it('简体转换简体 simple', function() {
    assert.equal('简体转换简体', switchWord.simple('简体转换简体'));
  });
  it('繁体转换简体 simple', function() {
    assert.equal('繁体转换简体', switchWord.simple('繁體轉換簡體'));
  });
  it('简繁转换简体 simple', function() {
    assert.equal('简繁转换简体', switchWord.simple('简繁轉換簡體'));
  });
  it('简体转换繁体 tradition', function() {
    assert.equal('簡體轉換繁體', switchWord.tradition('简体转换繁体'));
  });
  it('繁体转换繁体 tradition', function() {
    assert.equal('繁體轉換繁體', switchWord.tradition('繁體轉換繁體'));
  });
  it('简繁转换繁体 tradition', function() {
    assert.equal('簡繁轉換繁體', switchWord.tradition('简繁转换繁體'));
  });
  it('处理特殊符号 special', function() {
    assert.equal('简体转换繁体', switchWord.special('简...体转.&^换繁体'));
  });
});

word.watch(__dirname + '/word.txt', 500);

describe('w-word', function() {
  describe('#check(msg)', function() {
    it('是否有敏感词 无', function() {
      assert.equal(false, word.check('美女真好看'));
    });
    it('是否有敏感词 有', function() {
      assert.equal(true, word.check('法轮功真坑'));
    });
    it('是否有敏感词 繁体', function() {
      assert.equal(true, word.check('法輪功真坑'));
    });
    it('是否有敏感词 特殊符号', function() {
      assert.equal(true, word.check('法.轮.功真坑'));
    });
    it('是否有敏感词 繁体+特殊符号', function() {
      assert.equal(true, word.check('法.輪.功真坑'));
    });
  });

  describe('#filter(msg)', function() {
    it('替换敏感词 无', function() {
      assert.equal('美女真好看', word.filter('美女真好看'));
    });
    it('替换敏感词 有', function() {
      assert.equal('**真坑', word.filter('法轮功真坑'));
    });
    it('替换敏感词 繁体', function() {
      assert.equal('**真坑', word.filter('法輪功真坑'));
    });
    it('替换敏感词 特殊符号', function() {
      assert.equal('**真坑', word.filter('法.轮.功真坑'));
    });
    it('替换敏感词 繁体+特殊符号', function() {
      assert.equal('**真坑', word.filter('法.輪\功真坑'));
    });
    it('替换敏感词 特殊符号', function() {
      assert.equal('美女真好看', word.filter('美.女/真好看'));
    });
  });

  describe('#filter(msg, str)', function() {
    it('替换敏感词 指定替换词', function() {
      assert.equal('^O^真坑', word.filter('法輪功真坑', '^O^'));
    });
  });

  describe('#watch(path)', function() {
    it('监听文件变化', function(done) {
      fs.writeFileSync(__dirname + '/word.txt', '美女,共产党');

      setTimeout(function() {
        assert.equal(false, word.check('法轮功真坑'));
        assert.equal(true, word.check('美女真好看'));

        fs.writeFileSync(__dirname + '/word.txt', wordText);
        done();
      }, 1000);
    });
  });
});
