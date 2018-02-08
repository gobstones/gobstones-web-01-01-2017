"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stylist = function () {
  function Stylist() {
    var _this = this;

    _classCallCheck(this, Stylist);

    this.toolboxVisible = true;
    this.sizeVisible = true;
    this.attireVisible = true;
    this.selectedTab = 0;

    this.SCALE = 0.8;
    this.DEFAULT_PERCENTAGE = 0.6;
    this.TOOLBAR_HEIGHT = 64;
    this.IS_TOOLBOX_VISIBLE = function () {
      return _this.toolboxVisible && (_this.sizeVisible || _this.attireVisible);
    };
    this.TOOLBOX_HEIGHT = function () {
      return !_this.sizeVisible && !_this.attireVisible ? 0 : 86 / (!_this.sizeVisible || !_this.attireVisible ? 2 : 1);
    };
    this.TOOLBAR_AND_TOOLBOX_HEIGHT = function () {
      return _this.TOOLBAR_HEIGHT + (_this.IS_TOOLBOX_VISIBLE() ? _this.TOOLBOX_HEIGHT() : 0);
    };

    this.BOARD_CSS_CLASS = ".theBoard";
    this.BOARD_CONTAINER_CSS_CLASS = ".theBoardContainer";
    this.LEFT_PANEL_CSS_CLASS = ".panel-left";
  }

  _createClass(Stylist, [{
    key: "setSelectedTab",
    value: function setSelectedTab(tab) {
      this.selectedTab = tab;
      this.refresh();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.toolboxVisible = true;
      this.sizeVisible = true;
      this.attireVisible = true;
      this.setSelectedTab(0);
    }
  }, {
    key: "correctEditorHeight",
    value: function correctEditorHeight(editor) {
      var lineHeight = editor.renderer.lineHeight;
      var availableLines = ($(document).height() - this.TOOLBAR_HEIGHT) / editor.renderer.lineHeight;

      editor.setOption("minLines", availableLines);
      editor.setOption("maxLines", availableLines);
    }
  }, {
    key: "setUpZoom",
    value: function setUpZoom() {
      var _this2 = this;

      var delta = 0.1;

      $(document).ready(function () {
        $(".panel-right").bind("mousewheel", function (e) {
          if (e.originalEvent.wheelDelta > 0) _this2.SCALE += delta;else _this2.SCALE -= delta;

          if (_this2.SCALE < 0.5) _this2.SCALE = 0.5;
          if (_this2.SCALE > 0.98) _this2.SCALE = 0.98;

          _this2.refresh();
        });
      });
    }
  }, {
    key: "setPanelAsResizable",
    value: function setPanelAsResizable(boardDimensions) {
      var _this3 = this;

      $(document).ready(function () {
        _this3._makeResizable();
        setTimeout(function () {
          $(_this3.LEFT_PANEL_CSS_CLASS + " .ui-resizable-s").hide();
          $(_this3.LEFT_PANEL_CSS_CLASS + " .ui-resizable-se").hide();

          _this3.refresh();
        }, 0);
      });

      $(window).resize(function () {
        var percentage = _this3._getPercentage();
        var isBorder = Math.abs(1 - percentage) < 0.0001 || Math.abs(percentage) < 0.0001;

        if (!isBorder) window.STORAGE.setItem("code-panel-percentage", _this3._getPercentage());

        _this3.refresh();
      });
    }
  }, {
    key: "setBlocklyResize",
    value: function setBlocklyResize() {
      var _this4 = this;

      var resize = function resize() {
        var panel = $(_this4.LEFT_PANEL_CSS_CLASS);
        $("#blocklyDiv").css("width", panel.width() + "px");
        $("#blocklyDiv").css("height", panel.height() - _this4.TOOLBAR_HEIGHT + "px");

        // fix for white overlay in procedure comments:
        $("#blocklyDiv").unbind("click");
        $("#blocklyDiv").click(function () {
          return $(".blocklyMinimalBody").height("100%");
        });
      };

      setTimeout(resize, 0);
      $(window).resize(resize);
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var percentage = this._keepAspectRatioOnWindowResize(this.LEFT_PANEL_CSS_CLASS);
      this._scaleAndCenterBoard(percentage);
    }
  }, {
    key: "_keepAspectRatioOnWindowResize",
    value: function _keepAspectRatioOnWindowResize() {
      var documentWidth = $(document).width();
      if (!this.lastDocumentWidth) {
        this.lastDocumentWidth = documentWidth;
        return this.DEFAULT_PERCENTAGE;
      }

      var percentage = this._getPercentage();

      var leftPanel = $(this.LEFT_PANEL_CSS_CLASS);
      leftPanel.width(documentWidth * percentage);
      this.lastDocumentWidth = documentWidth;

      return percentage;
    }
  }, {
    key: "_scaleAndCenterBoard",
    value: function _scaleAndCenterBoard(percentage) {
      var board = this._getBoard();

      board.css({ opacity: 0, transform: "scale(1)" });
      var scale = this._getScale(percentage);
      this._centerBoard(percentage, scale);
      board.css({ opacity: 1, transform: "scale(" + scale + ")" });
    }
  }, {
    key: "_centerBoard",
    value: function _centerBoard(percentage, scale) {
      // center vertically
      var middleY = this._getRightPanelHeight() / 2;
      var offsetY = this._getBoardHeight() / 2;
      $(this.BOARD_CSS_CLASS).css("margin-top", middleY - offsetY + "px");

      // center horizontally
      $(".theBoardContainer").width(0); // avoid increasing container width
      var panelWidth = this._getRightPanelWidth(percentage);
      var middleX = panelWidth / 2;
      var offsetX = this._getBoardWidth() / 2;

      this._getBoard().css("margin-left", middleX - offsetX + "px");
    }
  }, {
    key: "_makeResizable",
    value: function _makeResizable() {
      $(this.LEFT_PANEL_CSS_CLASS).resizable({
        resizeHeight: false
      });
    }
  }, {
    key: "_getPercentage",
    value: function _getPercentage() {
      var leftPanel = $(this.LEFT_PANEL_CSS_CLASS);
      return leftPanel.width() / this.lastDocumentWidth;
    }
  }, {
    key: "_getRightPanelWidth",
    value: function _getRightPanelWidth(percentage) {
      return $(document).width() * (1 - percentage);
    }
  }, {
    key: "_getRightPanelHeight",
    value: function _getRightPanelHeight() {
      return $(document).height() - this.TOOLBAR_AND_TOOLBOX_HEIGHT();
    }
  }, {
    key: "_getBoardWidth",
    value: function _getBoardWidth() {
      return this._getBoard().width();
    }
  }, {
    key: "_getBoardHeight",
    value: function _getBoardHeight() {
      return this._getBoard().height();
    }
  }, {
    key: "_getScale",
    value: function _getScale(percentage) {
      var panelWidth = this._getRightPanelWidth(percentage);
      var scaleX = panelWidth / this._getBoardWidth();

      var panelHeight = this._getRightPanelHeight();
      var scaleY = panelHeight / this._getBoardHeight();

      return Math.max(Math.min(scaleX, scaleY) * this.SCALE, 0);
    }
  }, {
    key: "_getBoard",
    value: function _getBoard() {
      var boards = $(".theBoardContainer").find(".gbs_board");
      return this.selectedTab === 0 ? boards.first() : boards.last();
    }
  }]);

  return Stylist;
}();

;