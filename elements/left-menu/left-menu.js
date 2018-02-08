"use strict";

Polymer({
  is: 'left-menu',
  behaviors: [Polymer.BusListenerBehavior, Polymer.LocalizationBehavior, Polymer.LoaderBehavior],
  properties: {
    projectType: String,
    languages: {
      type: Array,
      value: ["es", "en"]
    },
    showTutorial: {
      type: Boolean,
      value: true
    },
    selectedLanguage: Number,
    isDownloadingExercises: {
      type: Boolean,
      value: false
    },
    downloadProgress: {
      type: String,
      value: "0"
    },
    permissions: {
      type: Object,
      value: { can_use_library: true }
      // downloadTotal: {
      //   type: Number,
      //   value: 0
      // }
    } },
  observers: ["_onSelectedLanguageChanged(selectedLanguage)"],

  attached: function attached() {
    var _this = this;

    this.subscribeTo("reset", function () {
      _this.set("permissions.can_use_library", true);
    });

    var language = window.STORAGE.getItem("language") || "es";
    var index = this.languages.indexOf(language);
    this.selectedLanguage = index >= 0 ? index : 0;

    var shouldNotShowTutorial = window.STORAGE.getItem("show-tutorial") === "false";
    this.showTutorial = !shouldNotShowTutorial;

    setTimeout(function () {
      _this.$.languageSelector.label = _this.localize(_this.languages[_this.selectedLanguage]);
    }, 0);

    this.setUpLoaders(this._isCodeProject(this.projectType) ? {
      Code: new CodeLoader(),
      Library: new LibraryLoader(),
      InitialBoard: new InitialBoardLoader(),
      Attire: new IndividualAttireLoader(),
      FinalBoard: new FinalBoardLoader()
    } : {
      Code: new CodeBlocksLoader(),
      Library: new LibraryBlocksLoader(),
      InitialBoard: new InitialBoardLoader(),
      Attire: new IndividualAttireLoader(),
      FinalBoard: new FinalBoardLoader(),
      GeneratedCode: new CodeLoader(),
      AppendBlocks: new AppendBlocksLoader()
    });
  },

  updateExercises: function updateExercises() {
    var _this2 = this;

    var bytes = window.GBS_REQUIRE("bytes");

    this.isDownloadingExercises = true;
    this.downloadProgress = "...";
    //this.downloadTotal = 0;

    window.GBS_IS_DOWNLOADING_GUIDE = true;
    DesktopGuideLoader.download(function (loaded, total) {
      _this2.downloadProgress = bytes(loaded);
      //this.downloadTotal = total;
    }).catch(function (e) {
      console.warn(e);
    }).always(function () {
      _this2.isDownloadingExercises = false;
      _this2._tryReload();
      window.GBS_IS_DOWNLOADING_GUIDE = false;
    });
  },

  seeGeneratedCode: function seeGeneratedCode() {
    this._ide().setCurrentCode(this._context().editor.code.main);
    this._ide().showCodeViewModal();
  },

  _onSelectedLanguageChanged: function _onSelectedLanguageChanged(selectedLanguage) {
    window.STORAGE.setItem("language", this.languages[selectedLanguage]);

    if (!this.localize) return;
    this._tryReload();
  },

  _onShowTutorialChanged: function _onShowTutorialChanged() {
    window.STORAGE.setItem("show-tutorial", this.showTutorial);
  },

  _isCodeProject: function _isCodeProject(projectType) {
    return projectType === "code";
  },

  // _getDownloadProgress: function(downloadProgress, downloadTotal) {
  //   if (downloadTotal <= 0) return 0;
  //   return (100 * downloadProgress / downloadTotal).toFixed(2);
  // },

  _tryReload: function _tryReload() {
    if (!confirm(this.localize("you-must-reload"))) return;
    location.reload();
  },

  _isDesktop: function _isDesktop() {
    return window.GBS_DESKTOP;
  }
});