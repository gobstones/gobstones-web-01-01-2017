"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GitHubGuideLoader = function () {
  function GitHubGuideLoader(_ref) {
    var repo = _ref.repo,
        _ref$path = _ref.path,
        path = _ref$path === undefined ? "" : _ref$path;

    _classCallCheck(this, GitHubGuideLoader);

    this.loader = new GitHubLoader(window.GBS_PROJECT_TYPE, repo, path);

    this.repo = repo;
    this.path = path;
  }

  _createClass(GitHubGuideLoader, [{
    key: "getExercises",
    value: function getExercises() {
      var _this = this;

      return this.loader.scanDir().then(function (entries) {
        return entries.filter(function (it) {
          return it.type === "dir";
        }).map(function (it) {
          return {
            name: it.name,
            imageUrl: _this._makeImageUrl(it.name)
          };
        });
      });
    }
  }, {
    key: "_makeImageUrl",
    value: function _makeImageUrl(exercise) {
      var path = this.path !== "" ? this.path + "/" : this.path;

      return "https://raw.githubusercontent.com/" + this.repo + "/master/" + path + exercise + "/image.png";
    }
  }], [{
    key: "all",
    value: function all() {
      return $.getJSON("https://raw.githubusercontent.com/gobstones/proyectos-jr-formato-viejo/master/guides.json");
    }
  }, {
    key: "makeUrlFor",
    value: function makeUrlFor(guide, exercise) {
      return "/" + window.GBS_PROJECT_TYPE + "?github=" + guide.repo + "&path=" + guide.path + "/" + exercise.name;
    }
  }]);

  return GitHubGuideLoader;
}();

;