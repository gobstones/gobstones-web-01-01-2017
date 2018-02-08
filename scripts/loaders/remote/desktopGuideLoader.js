"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var promisify = function promisify(value) {
  var deferred = new $.Deferred();
  deferred.resolve(value);
  return deferred.promise();
};

var guidesPath = window.GBS_DIRNAME + "/guides";
var jsonPath = window.GBS_DIRNAME + "/guides/guides.json";
var tmpPath = window.GBS_DIRNAME + "/guides_tmp";

var DesktopGuideLoader = function () {
  function DesktopGuideLoader(_ref) {
    var path = _ref.path;

    _classCallCheck(this, DesktopGuideLoader);

    this.path = guidesPath + "/" + path;
  }

  _createClass(DesktopGuideLoader, [{
    key: "getExercises",
    value: function getExercises() {
      var _this = this;

      try {
        var fs = window.GBS_REQUIRE("fs");

        return promisify(fs.readdirSync(this.path).filter(function (it) {
          return fs.lstatSync(_this.path + "/" + it).isDirectory();
        }).map(function (it) {
          return {
            name: it,
            imageUrl: _this._makeImageUrl(it)
          };
        }));
      } catch (e) {
        console.warn(e);
        return promisify([]);
      }
    }
  }, {
    key: "_makeImageUrl",
    value: function _makeImageUrl(exercise) {
      try {
        var bitmap = window.GBS_REQUIRE("fs").readFileSync(this.path + "/" + exercise + "/image.png");
        var base64 = new Buffer(bitmap).toString("base64");
        return "data:image/png;base64," + base64;
      } catch (e) {
        console.warn(e);
        return null;
      }
    }
  }], [{
    key: "download",
    value: function download(onProgress) {
      var url = "https://github.com/gobstones/proyectos-jr-formato-viejo/archive/master.zip";

      var fs = window.GBS_REQUIRE("fs");
      var extract = window.GBS_REQUIRE("extract-zip");
      var ncp = window.GBS_REQUIRE("ncp");
      window.GBS_REQUIRE("setimmediate");

      var deferred = new $.Deferred();
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (this.status === 200) deferred.resolve(xhr.response);else deferred.reject({ status: this.status });
      };
      xhr.onprogress = function (e) {
        //if (e.lengthComputable) onProgress(e.loaded, e.total);
        onProgress(e.loaded);
      };
      xhr.send();

      return deferred.promise().then(function (file) {
        var zipPath = window.GBS_DIRNAME + "/guides.zip";
        fs.writeFileSync(zipPath, new Buffer(file));
        try {
          fs.rmdirSync(tmpPath);
        } catch (e) {}
        try {
          fs.rmdirSync(guidesPath);
        } catch (e) {}
        try {
          fs.mkdirSync(guidesPath);
        } catch (e) {}
        var deferred = new $.Deferred();
        extract(zipPath, { dir: tmpPath }, function (err) {
          if (err) deferred.reject(err);else deferred.resolve();
        });
        return deferred.promise();
      }).then(function () {
        var deferred = $.Deferred();
        ncp(tmpPath + "/proyectos-jr-master", guidesPath, function (err) {
          if (err) deferred.reject(err);else deferred.resolve();
        });
        return deferred.promise();
      });
    }
  }, {
    key: "all",
    value: function all() {
      try {
        var json = window.GBS_REQUIRE("fs").readFileSync(jsonPath);
        var guides = JSON.parse(json);

        return promisify(guides);
      } catch (e) {
        console.warn(e);
        return promisify([]);
      }
    }
  }, {
    key: "makeUrlFor",
    value: function makeUrlFor(guide, exercise) {
      var path = guidesPath + "/" + guide.path + "/" + exercise.name;
      return "/" + window.GBS_PROJECT_TYPE + "?fs=" + path;
    }
  }]);

  return DesktopGuideLoader;
}();

;