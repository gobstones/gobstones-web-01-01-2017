"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);

    var GobstonesInterpreterAPI = window["gobstones-interpreter"].GobstonesInterpreterAPI;

    this.interpreter = new GobstonesInterpreterAPI();
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(sourceCode) {
      var onError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var onSuccess = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (it) {
        return it;
      };

      var result = this.interpreter.parse(sourceCode);

      if (this.hasFailed(result)) onError(result); // known errors
      else onSuccess(result);

      return result;
    }
  }, {
    key: "interpret",
    value: function interpret(program, initialState) {
      var board = this._createBoard(initialState);
      var result = program.interpret(board);
      if (this.hasFailed(result)) throw result; // known errors
      return result;
    }
  }, {
    key: "readGbb",
    value: function readGbb(gbb) {
      return this.interpreter.gbb.read(gbb);
    }
  }, {
    key: "buildGbb",
    value: function buildGbb(initialState, size) {
      var board = this._createBoard(_.assign(initialState, { size: size }));
      return this.interpreter.gbb.write(board);
    }
  }, {
    key: "hasFailed",
    value: function hasFailed(result) {
      return result.reason;
    }
  }, {
    key: "getErrorLineAndMode",
    value: function getErrorLineAndMode(e, code, forceIsInMainCode) {
      var libraryLines = code.library.split("\n").length - 1;

      try {
        var isInMainCode = forceIsInMainCode || e.on.range.start.row > libraryLines;

        return {
          line: e.on.range.start.row - (isInMainCode ? libraryLines + 1 : 0),
          mode: isInMainCode ? "main" : "library"
        };
      } catch (unknownError) {
        throw e;
      }
    }
  }, {
    key: "_createBoard",
    value: function _createBoard(initialState) {
      return {
        width: initialState.size.x,
        height: initialState.size.y,
        head: {
          x: initialState.header.x,
          y: initialState.header.y
        },
        table: initialState.table
      };
    }
  }]);

  return Parser;
}();

;