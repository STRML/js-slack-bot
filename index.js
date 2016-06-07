'use strict';

const Botkit = require('botkit');
const {VM} = require('vm2');
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const entities = new (require('html-entities').AllHtmlEntities)();

const BABEL_PRESETS = ['es2015-loose', 'react', 'stage-0'];
const BABEL_PRESETS_NODE6 = ['node6'].concat(BABEL_PRESETS.slice(1));
const BABEL_PLUGINS = ['transform-decorators-legacy'];

const token = fs.readFileSync(path.join(__dirname, '.token')).toString('utf8').trim();

var controller = Botkit.slackbot({
  debug: false,
});

controller.spawn({
  token: token
}).startRTM(function(err) {
  if (err) throw new Error(err);
});

const VM_OPTIONS = {
  timeout: 1000,
  sandbox: {}
};
const vm = new VM(VM_OPTIONS);

const codeRegex = /(^`+|`+$)/g;
const crappyQuoteRegex = /([‘’])/g;
const babelRegex = /^babel(-node6)?:?\s*([\s\S]*)/i;
controller.hears(['[\s\S]*'],['direct_message','direct_mention','mention'], function(bot, message) {
  let {text} = message;
  text = text.replace(codeRegex, '');
  text = text.replace(crappyQuoteRegex, "'");

  // Ping
  if (text === 'ping') return bot.reply('pong');

  try {
    // Babel transpile
    const match = text.match(babelRegex);
    if (match && match.length) {
      // Get raw code
      let code = match[match.length - 1];
      // Comes in escaped
      code = entities.decode(code.replace(codeRegex, ''));

      // Get presets
      const isNode6 = match[1] === '-node6';
      const presets = isNode6 ? BABEL_PRESETS_NODE6 : BABEL_PRESETS;

      // Transform
      let transformed = babel.transform(code, {presets, plugins: BABEL_PLUGINS, highlightCode: false}).code;
      transformed = transformed.replace('"use strict";\n\n', '');
      return bot.reply(message, '```' + transformed + '```');
    }

    // Regular eval
    const result = vm.run(text);
    bot.reply(message, `\`${result && result.toString()}\``);
  } catch (e) {
    bot.reply(message, '```' + e.message + '```');
  }
});
