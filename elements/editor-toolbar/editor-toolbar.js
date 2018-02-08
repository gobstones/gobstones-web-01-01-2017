"use strict";

Polymer({
  is: 'editor-toolbar',
  behaviors: [Polymer.BusListenerBehavior, Polymer.LocalizationBehavior, Polymer.LoaderBehavior],
  properties: {
    projectName: {
      type: String,
      value: "Nuevo proyecto"
    },
    projectType: {
      type: String,
      value: "none"
    },
    showBoards: {
      type: Boolean,
      value: true
    },
    showLibrary: {
      type: Boolean,
      value: false
    },
    showInfo: {
      type: Boolean,
      value: false
    },
    permissions: {
      type: Object,
      value: { can_use_library: true }
    }
  },

  ready: function ready() {
    var _this = this;

    if (this.empty) return;

    this.subscribeTo("mode-change", function (mode) {
      _this.showLibrary = mode === "library";
    }).subscribeTo("reset", function () {
      _this.set("permissions.can_use_library", true);
    }).subscribeTo("interactive-run", function () {
      _this.showBoards = true;
    }).subscribeTo("has-description", function (hasDescription) {
      _this.showInfo = hasDescription;
    }).subscribeTo("load-project-from-file", function () {
      // TODO: El editor-toolbar de select-mode queda activo por alguna razón
      if (_this.projectType === "none") return;

      _this.loadProject();
    });

    this.setUpLoaders({
      Project: this._projectLoader(this.projectType)
    });
  },

  openProjectSelector: function openProjectSelector() {
    if (window.GBS_IS_RUNNING || window.GBS_IS_DOWNLOADING_GUIDE) return;
    this._ide().showProjectSelectorModal();
  },

  togglePanel: function togglePanel() {
    $("paper-drawer-panel")[0].togglePanel();
  },

  toggleShowBoards: function toggleShowBoards() {
    this.showBoards = !this.showBoards;
    this.fire("show-boards-changed", this.showBoards);
  },

  toggleLibrary: function toggleLibrary() {
    if (window.GBS_IS_RUNNING) return;
    this._editor().toggleMode();
  },

  showDescription: function showDescription() {
    this.domHost.showDescriptionModal();
  },

  increaseEditorFontSize: function increaseEditorFontSize() {
    this._editor().increaseFontSize();
  },

  decreaseEditorFontSize: function decreaseEditorFontSize() {
    this._editor().decreaseFontSize();
  },

  _isCodeProject: function _isCodeProject(projectType) {
    return projectType === "code";
  },

  _areToolsVisible: function _areToolsVisible(projectType) {
    return projectType !== "none";
  },

  _editor: function _editor() {
    return document.querySelector("#editor");
  },

  _showBoardsDirection: function _showBoardsDirection(value) {
    return value ? "right" : "left";
  },

  _projectLoader: function _projectLoader(projectType) {
    return this._isCodeProject(projectType) ? new ProjectLoader() : new ProjectBlocksLoader();
  },

  _projectExtension: function _projectExtension(projectType) {
    return this._projectLoader(projectType).EXTENSION;
  },

  _ide: function _ide() {
    return document.querySelector("#gobstones-ide");
  },

  buttonCssClass: function buttonCssClass(element) {
    if (!this.domHost) return;
    return this.domHost.buttonCssClass(element);
  }
});