'use strict';

const Botkit = require('botkit');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');

const BABEL_PRESETS = ['es2015', 'node6', 'stage-0', 'stage-1', 'stage-2', 'stage-3'];

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
const babelRegex = /^babel: ?(.*)/i;
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
      let code = match[1];
      code = code.replace(codeRegex, '');
      return bot.reply(message, '```' + babel.transform(code, {presets: BABEL_PRESETS}).code + '```');
    }

    // Regular eval
    const result = vm.runInContext(text, createSandbox());
    bot.reply(message, `\`${result.toString()}\``);
  } catch (e) {
    bot.reply(message, `\`${e.toString()}\``);
  }
});

function createSandbox() {
  const sandbox = {};
  Object.freeze(sandbox);
  vm.createContext(sandbox);
  return sandbox;
}
