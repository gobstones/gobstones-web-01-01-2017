"use strict";

Polymer.LoaderBehavior = {
  setUpLoaders: function setUpLoaders(loaders) {
    var _this = this;

    this.loaders = loaders;

    _.keys(this.loaders).forEach(function (item) {
      _this["save" + item] = function () {
        if (window.GBS_IS_RUNNING) return;
        _this.loaders[item].save(_this._context());
      };

      _this["load" + item] = function () {
        if (window.GBS_IS_RUNNING) return;
        $("#" + item).click();
      };

      _this["onLoaded" + item] = function (event) {
        var isProject = _.endsWith(item, "Project");

        if (isProject) {
          _this._ide().startLoading();
          _this._cleanQueryString();
        }

        _this.loaders[item].read(_this._context(), event, function () {
          if (isProject) _this._ide().stopLoading();else _this._closePanel();
        });
      };
    });
  },

  newProject: function newProject() {
    if (window.GBS_IS_RUNNING || window.GBS_IS_DOWNLOADING_GUIDE) return;
    if (!confirm(this.localize("new-project-confirm"))) return;

    this._cleanAll();
  },

  _cleanAll: function _cleanAll() {
    this._cleanQueryString();
    this._context().reset();
  },


  _closePanel: function _closePanel() {
    $("paper-drawer-panel")[0].closeDrawer();
  },

  _context: function _context() {
    var query = function query(id) {
      return document.querySelector(id);
    };
    var toolbar = query("#toolbar");

    var loader = this;

    return {
      ide: this._ide(),
      toolbar: toolbar,
      menu: query("#menu"),
      editor: query("#editor"),
      boards: query("#boards"),
      getProjectName: function getProjectName() {
        return toolbar.projectName;
      },
      setProjectName: function setProjectName(name) {
        return toolbar.projectName = name;
      },

      reset: function reset() {
        this.ide.setDescription("");
        this.ide.setCurrentCode("");
        this.setProjectName(loader.localize("new-project"));
        this.editor.reset();
        this.boards.reset();
        this.ide.hideProjectSelectorModal();
      }
    };
  },

  _ide: function _ide() {
    return document.querySelector("#gobstones-ide");
  },

  _goTo: function _goTo(route) {
    return document.querySelector("app-router").go(route);
  },

  _cleanQueryString: function _cleanQueryString() {
    var url = void 0;
    url = window.location.href;
    url = url.replace(url.substring(url.indexOf("?")), "");
    url = url.substring(url.indexOf("//") + 2);
    url = url.substring(url.indexOf("/"));

    history.replaceState({}, '', url);
  }
};