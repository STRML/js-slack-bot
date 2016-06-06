'use strict';

const Botkit = require('botkit');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');

const BABEL_PRESETS = ['es2015-loose', 'stage-0', 'stage-1', 'stage-2', 'stage-3', 'react'];
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

const codeRegex = /(^`+|`+$)/g;
const babelRegex = /^babel(-node6)?:?\s*([\s\S]*)/i;
controller.hears(['[\s\S]*'],['direct_message','direct_mention','mention'], function(bot, message) {
  console.log("heard it, ", message);
  let {text} = message;
  text = text.replace(codeRegex, '');

  // Ping
  if (text === 'ping') return bot.reply('pong');

  try {
    // Babel transpile
    const match = text.match(babelRegex);
    if (match && match.length) {
      // Get raw code
      let code = match[match.length - 1];
      code = code.replace(codeRegex, '');

      // Get presets
      const isNode6 = match[1] === '-node6';
      const presets = isNode6 ? BABEL_PRESETS_NODE6 : BABEL_PRESETS;

      // Transform
      let transformed = babel.transform(code, {presets, plugins: BABEL_PLUGINS, highlightCode: false}).code;
      transformed = transformed.replace('"use strict";\n\n', '');
      return bot.reply(message, '```' + transformed + '```');
    }

    // Regular eval
    const result = vm.runInContext(text, createSandbox());
    bot.reply(message, `\`${result.toString()}\``);
  } catch (e) {
    bot.reply(message, `\`${e.stack}\``);
  }
});

function createSandbox() {
  const sandbox = {};
  Object.freeze(sandbox);
  vm.createContext(sandbox);
  return sandbox;
}
