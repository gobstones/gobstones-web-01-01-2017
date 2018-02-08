"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExpandedLoader = function () {
  function ExpandedLoader() {
    _classCallCheck(this, ExpandedLoader);
  }

  _createClass(ExpandedLoader, [{
    key: "_createZip",
    value: function _createZip(files) {
      var _this = this;

      var entries = files.map(function (it) {
        return _this._createZipEntry(it);
      });
      var zip = _.clone(entries);
      zip.forEach = function (fn) {
        entries.forEach(function (entry) {
          fn(entry.relativePath, entry);
        });
      };
      zip.files = _.keyBy(entries, "relativePath");

      return zip;
    }
  }, {
    key: "_createZipEntry",
    value: function _createZipEntry(file) {
      var _this2 = this;

      return {
        async: function async(encoding) {
          var deferred = new $.Deferred();
          _this2._readBinary(file.content, encoding, deferred.resolve, deferred.reject);
          return deferred.promise();
        },
        relativePath: file.relativePath
      };
    }
  }, {
    key: "_readBinary",
    value: function _readBinary(arrayBuffer, encoding, onSuccess, onFail) {
      var buffers = [arrayBuffer];

      var reader = new FileReader();
      reader.onload = function (event) {
        onSuccess(event.target.result);
      };
      reader.onerror = function (event) {
        onFail(event.target.error);
      };

      if (encoding === "string") reader.readAsText(new Blob(buffers));else reader.readAsBinaryString(new Blob(buffers, { type: 'application/octet-stream' }));
    }
  }]);

  return ExpandedLoader;
}();

;