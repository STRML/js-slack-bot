'use strict';

const Botkit = require('botkit');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const token = fs.readFileSync(path.join(__dirname, '.token')).toString('utf8').trim();

var controller = Botkit.slackbot({
  debug: true,
});

controller.spawn({
  token: token
}).startRTM(function(err) {
  if (err) throw new Error(err);
});

controller.hears(['[\s\S]*'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
  console.log("heard it, ", message);
  const sandbox = {};
  Object.freeze(sandbox);
  vm.createContext(sandbox);
  try {
    const result = vm.runInContext(message.text, sandbox);
    bot.reply(message, result.toString());
  } catch (e) {
    bot.reply(message, e.toString());
  }
});
