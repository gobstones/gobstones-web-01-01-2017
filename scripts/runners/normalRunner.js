"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NormalRunner = function () {
  function NormalRunner(parser) {
    _classCallCheck(this, NormalRunner);

    this.parser = parser;
    this.handles = [];

    this.HACK_FIRST_WAIT_MS = 250;
  }

  _createClass(NormalRunner, [{
    key: "run",
    value: function run(_ref) {
      var ast = _ref.ast,
          request = _ref.request,
          throttle = _ref.throttle,
          callbacks = _ref.callbacks;

      var states = this._interpret(ast, request);
      this._runWithThrottle(states, throttle, callbacks);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.handles.forEach(clearInterval);
      this.handles = [];
    }
  }, {
    key: "_runWithThrottle",
    value: function _runWithThrottle(states, throttle, _ref2) {
      var _this = this;

      var onResult = _ref2.onResult,
          onStop = _ref2.onStop;

      if (throttle === 0) {
        onResult(_.last(states));
        return onStop("end");
      }

      onResult(_.first(states));
      if (states.length === 1) return onStop("end");

      setTimeout(function () {
        _this.handles = states.slice(1).map(function (state, i) {
          var ii = i + 1;

          return setTimeout(function () {
            onResult(state);
            if (ii === states.length - 1) onStop("end");
          }, ii * throttle);
        });
      }, this.HACK_FIRST_WAIT_MS); // TODO: Pensar solución mejor
    }
  }, {
    key: "_interpret",
    value: function _interpret(ast, _ref3) {
      var initialState = _ref3.initialState,
          code = _ref3.code;

      try {
        var result = this.parser.interpret(ast.program, initialState);
        return this._getStates(result, ast.teacher);
      } catch (e) {
        e.location = this.parser.getErrorLineAndMode(e, code);
        return this._getStates(e, ast.teacher, { error: e });
      }
    }
  }, {
    key: "_getStates",
    value: function _getStates(result, teacherAst) {
      var lastState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var teacherTools = teacherAst.declarations.filter(function (it) {
        return _.includes(["procedureDeclaration", "functionDeclaration"], it.alias);
      }).map(function (it) {
        return it.name;
      });

      var snapshots = result.snapshots;

      return snapshots.filter(function (snapshot, i) {
        var toName = function toName(it) {
          return it.split("-")[0];
        };

        var prevNames = _.take(snapshot.contextNames, snapshot.contextNames.length - 1);
        var lastName = _.last(snapshot.contextNames);

        var topIgnoredName = _.find(prevNames, function (it) {
          return _.includes(teacherTools, toName(it));
        }) || lastName;

        var hasToIgnoreIt = _.includes(teacherTools, toName(topIgnoredName));

        var isTheLastOcurrence = _.every(snapshots.slice(i + 1), function (futureSnapshot) {
          return !_.includes(futureSnapshot.contextNames, topIgnoredName);
        });

        var isShowable = !hasToIgnoreIt || isTheLastOcurrence;

        return isShowable;
      }).map(function (snapshot) {
        return snapshot.board;
      }).concat(lastState);
    }
  }]);

  return NormalRunner;
}();

;