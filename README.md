# JS-Slack-Bot

Runs short commands in a secure environment and translate babel code.


### Usage

* Add your [Bot Token](http://<org>.slack.com/services/new/bot) to `.token`
* Deploy this somewhere, or run locally
* `@` mention the bot to run a command.

### Commands

Send it any string with or without backticks to eval directly.

Send it `babel:` or `babel-node6:` (colon is optional) to transpile code.

The Babel transpiler uses most common plugins. You can add your own easily.


#### Example

```
@jsbot Array(16).join("wat" - 1) + " Batman!"
NaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaN Batman!
```


```
@jsbot babel `<TimeHacker timeTohack="tooMuchTime" />`
React.createElement(TimeHacker, { timeTohack: "tooMuchTime" });
```

```
@jsbot babel class Foo {}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Foo = function Foo() {
  _classCallCheck(this, Foo);
};
```
```
@jsbot babel-node6 class Foo {}
let Foo = class Foo {};
```
