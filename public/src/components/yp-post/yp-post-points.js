import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/iron-list/iron-list.js';
import './yp-app-icons.js';
import './yp-iron-list-behavior.js';
import './yp-point.js';
import { ypTruncateBehavior } from './yp-truncate-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { ypLocalizationBridgeBehavior } from './yp-localization-bridge-behavior.js';

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">

      :host {
        display: block;
      }

      .item {
        @apply --layout-horizontal;
      }

      .main-container {
        @apply --layout-horizontal;
        background-color: var(--app-main-backround-color, #e0e0e0);
      }

      .point {
        padding-top: 32px;
        padding-bottom: 32px;
        padding-left: 24px;
        padding-right: 24px;
        @apply --layout-vertical;
        width: 398px;
      }

      .pointInputMaterial {
        padding-top: 24px;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 16px;
        background-color: #FFF;
      }

      paper-toast {
        z-index: 9999;
      }

      paper-material {
        background-color: #fff;
      }

      yp-point {
        padding-top: 8px;
      }

      .pointMaterial {
        padding-top: 8px;
        background-color: #FFF;
        padding-left: 0;
        padding-right: 0;
        width: 430px;
        margin-bottom: 12px;
      }

      .thumbIcon {
        height: 64px;
        width: 64px;
        padding-bottom: 16px;
        color: var(--primary-color);
      }

      .editIcon {
        height: 28px;
        width: 28px;
        padding-bottom: 16px;
        color: var(--primary-color);
      }

      .addPointFab {
        width: 100%;
        color: #FFF;
        margin-bottom: 18px;
      }

      paper-textarea {
        --paper-input-container-label: {
          font-size: 22px;
          height: 30px;
          overflow: visible;
          color: #AAAAAA;
        }
      }

      .howToWriteInfoText {
        padding-top: 4px;
        color: var(--primary-color);
      }

      .point .main-container .topContainer {
        background-color: var(--app-main-backround-color, #e0e0e0);
      }

      .penContainer {
        margin-top: 42px;
      }

      .upOrDown {
        margin-top: 72px;
      }

      paper-radio-button {
        --paper-radio-button-checked-color: var(--accent-color) !important;
        font-size: 16px;
      }

      #pointUpOrDownMaterial {
        margin-top: 16px;
        width: 100%;
      }

      .mobileFab {
        margin-top: 8px;
      }

      paper-button {
        color: #FFF;
        background-color: var(--accent-color);
      }

      @media (max-width: 985px) {
        .pointInputMaterial {
          width: 100%;
          max-width: 568px;
          font-size: 14px;
          padding-top: 4px;
          margin-top: 0;
        }

        .pointMaterial {
          width: 100%;
          max-width: 600px;
          padding-left: 0;
          padding-right: 0;
        }

        #pointUpOrDownMaterial {
          margin-top: 0;
        }

        .main-container {
          width: 100%;
        }

        iron-list {
          width: 100vw;
        }

        .pointMaterial {
        }
      }

      @media (max-width: 420px) {
        .pointInputMaterial {
          width: 90%;
          max-width: 90%;
        }
      }

      .mobilePaperTextArea {
        --paper-input-container-label: {
          font-size: 19px;
        };
      }

      .pointMainHeader {
        font-size: 26px;
        margin-bottom: 16px;
        color: #555;
      }

      #pointUpMaterialNotUsed {
        border-top: solid 2px;
        border-top-color:  var(--master-point-up-color);
      }

      #pointDownMaterialNotUsed {
        border-top: solid 2px;
        border-top-color: var(--master-point-down-color);
      }

      .pointElement {
        margin-bottom: 18px;
      }

      [hidden] {
        display: none !important;
      }

      iron-list {
        height: 80vh;
      }

      iron-list {
        --iron-list-items-container: {
        };
      }

      :focus {
        outline: none;
      }

      #ironListMobile[debate-disabled] {
        margin-top: 16px;
      }

      .mainSpinner {
        margin: 32px;
      }

      paper-button[disabled] {
        background-color: #333;
        color: #FFF;
      }

      .uploadNotLoggedIn {
        min-width: 100px;
        background-color: #FFF;
        color: #000;
        margin-bottom: 24px;
      }

      .uploadNotLoggedIn > .icon {
        padding-right: 8px;
      }

      .pointButtons {
        margin-bottom: 4px;
      }

      .bottomDiv {
        margin-bottom: 64px;
      }

      .uploadSection {
        justify-content: space-evenly;
        width: 50%;
        margin-left: 8px;
        margin-right: 8px;
        vertical-align: top;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-update-points-for-post="_loadNewPointsIfNeeded"></lite-signal>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>

    <iron-media-query query="(min-width: 985px)" query-matches="{{largeMode}}"></iron-media-query>

    <div class="layout horizontal center-center" hidden\$="[[ajaxActive]]">
      <yp-ajax id="ajax" large-spinner="" active\$="{{ajaxActive}}" on-response="_response"></yp-ajax>
    </div>

    <template is="dom-if" if="[[largeMode]]" restamp="">
      <div class="layout vertical topContainer">
        <div class="main-container">
          <div class="point">
            <template is="dom-if" if="[[!post.Group.configuration.alternativePointForHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[t('pointsFor')]]
              </div>
            </template>

            <template is="dom-if" if="[[post.Group.configuration.alternativePointForHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[post.Group.configuration.alternativePointForHeader]]
              </div>
            </template>
            <div id="allUpPoints">
              <iron-list id="ironListUp" items="[[upPoints]]" as="point" scroll-target="document" scroll-offset="550">
                <template>
                  <div class="item" tabindex\$="[[tabIndex]]">
                    <paper-material id="point[[point.id]]" elevation="1" animated="" class="pointMaterial">
                      <yp-point point="[[point]]"></yp-point>
                    </paper-material>
                  </div>
                </template>
              </iron-list>
            </div>
          </div>

          <div class="point">
            <template is="dom-if" if="[[!post.Group.configuration.alternativePointAgainstHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[t('pointsAgainst')]]
              </div>
            </template>

            <template is="dom-if" if="[[post.Group.configuration.alternativePointAgainstHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[post.Group.configuration.alternativePointAgainstHeader]]
              </div>
            </template>

            <div id="allDownPoints">
              <iron-list id="ironListDown" items="[[downPoints]]" as="point" scroll-target="document" scroll-offset="550">
                <template>
                  <div class="item" tabindex\$="[[tabIndex]]">
                    <paper-material id="point[[point.id]]" elevation="1" animated="" class="pointMaterial">
                      <yp-point point="[[point]]"></yp-point>
                    </paper-material>
                  </div>
                </template>
              </iron-list>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template is="dom-if" if="[[!largeMode]]" restamp="">
      <div class="layout vertical center-center">

      <div class="layout vertical center-center">
        <iron-list id="ironListMobile" debate-disabled\$="[[post.Group.configuration.disableDebate]]" items="[[points]]" as="point" scroll-target="document" scroll-offset="[[mobileScrollOffset]]">
          <template>
            <div class="item layout vertical center-center" tabindex\$="[[tabIndex]]">
              <paper-material id="point[[point.id]]" elevation="1" animated="" class="pointMaterial">
                <yp-point point="[[point]]"></yp-point>
              </paper-material>
            </div>
          </template>
        </iron-list>
      </div>
    </template>

    <div class="layout vertical center-center">
      <yp-ajax id="newPointsAjax" on-response="_newPointsResponse"></yp-ajax>
      <yp-ajax id="newPointAjax" on-error="_newPointError" method="POST" url="/api/points" on-response="_newPointResponse"></yp-ajax>
    </div>

    <paper-toast id="newPointToast" text="[[newPointTextCombined]]"></paper-toast>
`,

  is: 'yp-post-points',

  behaviors: [
    ypTruncateBehavior,
    ypLocalizationBridgeBehavior
  ],

  properties: {

    host: String,

    downPoints: {
      type: Array,
      value: []
    },

    upPoints: {
      type: Array,
      value: []
    },

    textValueUp: {
      type: String,
      notify: true,
      value: ""
    },

    textValueDown: {
      type: String,
      notify: true,
      value: ""
    },

    newPointTextCombined: {
      type: String
    },

    post: {
      type: Object,
      observer: "_postChanged"
    },

    points: {
      type: Array,
      value: null,
      observer: '_pointsChanged'
    },

    largeMode: {
      type: Boolean,
      value: false,
      observer: '_updateEmojiBindings'
    },

    textValueMobileUpOrDown: String,

    labelMobileUpOrDown: String,

    labelUp: String,

    labelDown: String,

    pointUpOrDownSelected: {
      type: String,
      observer: '_pointUpOrDownSelectedChanged',
      value: 'pointFor'
    },

    latestPointCreatedAt: {
      type: Date,
      value: null
    },

    scrollToId: {
      type: String,
      value: null
    },

    ironListResizeScrollThreshold: {
      type: Number,
      computed: '_ironListResizeScrollThreshold(largeMode)'
    },

    ironListPaddingTop: {
      type: Number,
      computed: '_ironListPaddingTop(wide)'
    },

    ifLengthUpIsRight: {
      type: Boolean,
      value: false,
      computed: 'ifLengthIsRight("up",textValueUp, uploadedVideoUpId, uploadedAudioUpId)'
    },

    ifLengthDownIsRight: {
      type: Boolean,
      value: false,
      computed: 'ifLengthIsRight("down", textValueDown, uploadedVideoDownId, uploadedAudioDownId)'
    },

    ifLengthMobileRight: {
      type: Boolean,
      value: false,
      computed: 'ifLengthIsRight("mobile", textValueMobileUpOrDown, uploadedVideoMobileId, uploadedAudioMobileId)'
    },

    addPointDisabled: {
      type: Boolean,
      value: false
    },

    mobileScrollOffset: {
      type: Number,
      computed: '_mobileScrollOffset(largeMode,post)'
    },

    ajaxActive: {
      type: Boolean,
      value: false
    },

    uploadedVideoUpId: {
      type: String,
      value: null
    },

    uploadedVideoDownId: {
      type: String,
      value: null
    },

    uploadedVideoMobileId: {
      type: String,
      value: null
    },

    currentVideoId:{
      type: String,
      value: null
    },

    hideUpVideo: {
      type: Boolean,
      value: false
    },

    hideDownVideo: {
      type: Boolean,
      value: false
    },

    hideMobileVideo: {
      type: Boolean,
      value: false
    },

    uploadedAudioUpId: {
      type: String,
      value: null
    },

    uploadedAudioDownId: {
      type: String,
      value: null
    },

    uploadedAudioMobileId: {
      type: String,
      value: null
    },

    currentAudioId:{
      type: String,
      value: null
    },

    hideUpAudio: {
      type: Boolean,
      value: false
    },

    hideDownAudio: {
      type: Boolean,
      value: false
    },

    hideMobileAudio: {
      type: Boolean,
      value: false
    },

    hideUpText: {
      type: Boolean,
      value: false
    },

    hideDownText: {
      type: Boolean,
      value: false
    },

    hideMobileText: {
      type: Boolean,
      value: false
    },


    selectedPointForMobile: {
      type: Boolean,
      value: true
    },

    isAndroid: {
      type: Boolean,
      value: false
    },

    hasCurrentUpVideo: {
      type: String,
      observer: '_hasCurrentUpVideo'
    },

    hasCurrentDownVideo: {
      type: String,
      observer: '_hasCurrentDownVideo'
    },

    hasCurrentMobileVideo: {
      type: String,
      observer: '_hasCurrentMobileVideo'
    },

    hasCurrentUpAudio: {
      type: String,
      observer: '_hasCurrentUpAudio'
    },

    hasCurrentDownAudio: {
      type: String,
      observer: '_hasCurrentDownAudio'
    },

    hasCurrentMobileAudio: {
      type: String,
      observer: '_hasCurrentMobileAudio'
    },

    storedPoints: {
      type: Array,
      value: null
    }
  },

  _openLogin: function () {
    this.fire('yp-open-login');
  },

  _videoUpUploaded: function (event, detail) {
    this.set('uploadedVideoUpId', detail.videoId);
  },

  _videoDownUploaded: function (event, detail) {
    this.set('uploadedVideoDownId', detail.videoId);
  },

  _videoMobileUploaded: function (event, detail) {
    this.set('uploadedVideoMobileId', detail.videoId);
  },

  _audioUpUploaded: function (event, detail) {
    this.set('uploadedAudioUpId', detail.audioId);
  },

  _audioDownUploaded: function (event, detail) {
    this.set('uploadedAudioDownId', detail.audioId);
  },

  _audioMobileUploaded: function (event, detail) {
    this.set('uploadedAudioMobileId', detail.audioId);
  },

  _mobileScrollOffset: function (large, post) {
    if (!large && post) {
      var element = this.$$("#ironListMobile");
      if (element) {
        var top = element.getBoundingClientRect().top;
        if (top<=0) {
          top = 800;
        }
        return top;
      } else {
        console.warn("Can't find mobile list element, returning 800");
        return 800;
      }
    }
  },

  _newPointError: function () {
    this.set('addPointDisabled', false);
  },

  _ironListResizeScrollThreshold: function (largeMode) {
    if (largeMode) {
      return 300;
    } else {
      return 300;
    }
  },

  _ironListPaddingTop: function (largeMode) {
    if (largeMode) {
      return 600;
    } else {
      return 500;
    }
  },

  ready: function () {
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    if (isAndroid) {
      this.set('isAndroid', true);
    }
    window.addEventListener("resize", this._processStoredPoints.bind(this));
  },

  detached: function() {
    window.removeEventListener("resize", this._processStoredPoints);
  },

  listeners: {
    'yp-point-deleted': '_pointDeleted',
    'yp-update-point-in-list': '_updatePointInLists'
  },

  observers: [
    '_setupPointTextStartState(pointUpOrDownSelected, post)'
  ],

  _setupPointTextStartState: function(pointUpOrDownSelected, post) {
    if (post) {
      this._pointUpOrDownSelectedChanged(pointUpOrDownSelected)
    }
  },

  _loadNewPointsIfNeeded: function (event, detail) {
    if (this.post && this.post.id == detail.postId) {
      if (this.latestPointCreatedAt) {
        this.$.newPointsAjax.url = '/api/posts/' + this.post.id + '/newPoints';
        this.$.newPointsAjax.params = { latestPointCreatedAt: this.latestPointCreatedAt };
        this.$.newPointsAjax.generateRequest();
      } else {
        console.error("Trying to send point without latestPointCreatedAt");
      }
    }
  },

  _newPointsResponse: function (event, detail) {
    var points = this._preProcessPoints(detail.response);
    points.forEach(function (point) {
      this._insertNewPoint(point);
    }.bind(this));

    this._updateCounterInfo();
  },

  _pointDeleted: function () {
    this.$.ajax.generateRequest();
  },

  _pointsChanged: function (points) {
    if (points) {
      this._updateEmojiBindings();
    }
  },

  _updateEmojiBindings: function () {
    this.async(function () {
      if (this.largeMode) {
        var upPoint = this.$$("#up_point");
        var downPoint = this.$$("#down_point");
        var upEmoji = this.$$("#pointUpEmojiSelector");
        var downEmoji = this.$$("#pointDownEmojiSelector");
        if (upPoint && downPoint && upEmoji && downEmoji) {
          upEmoji.inputTarget = upPoint;
          downEmoji.inputTarget = downPoint;
        } else {
          //console.warn("Wide: Can't bind emojis :(");
        }
      } else {
        var upDownPoint = this.$$("#mobileUpOrDownPoint");
        var upDownEmoji = this.$$("#pointUpDownEmojiSelector");
        if (upDownPoint && upDownEmoji) {
          upDownEmoji.inputTarget = upDownPoint;
        } else {
          //console.warn("Small: Can't bind emojis :(");
        }
      }
    }.bind(this), 500);
  },

  _pointUpOrDownSelectedChanged: function (newValue) {
    if (newValue=='pointFor') {
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointForLabel) {
        this.set('labelMobileUpOrDown', this.post.Group.configuration.alternativePointForLabel);
      } else {
        this.set('labelMobileUpOrDown', this.t('point.for'));
      }
      this.set('selectedPointForMobile', true);
    } else if (newValue=='pointAgainst') {
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointAgainstLabel) {
        this.set('labelMobileUpOrDown', this.post.Group.configuration.alternativePointAgainstLabel);
      } else {
        this.set('labelMobileUpOrDown', this.t('point.against'));
      }
      this.set('selectedPointForMobile', false);
    }
  },

  _clearVideo: function () {
    this.set('uploadedVideoUpId', null);
    this.set('uploadedVideoDownId', null);
    this.set('uploadedVideoMobileId', null);
    this.set('currentVideoId', null);
    this.set('hideUpVideo', false);
    this.set('hideDownVideo', false);
    this.set('hideMobileVideo', false);
    if (this.$$("#videoFileUploadUp"))
      this.$$("#videoFileUploadUp").clear();
    if (this.$$("#videoFileUploadDown"))
      this.$$("#videoFileUploadDown").clear();
    if (this.$$("#videoFileUploadMobile"))
      this.$$("#videoFileUploadMobile").clear();
  },

  _clearAudio: function () {
    this.set('uploadedAudioUpId', null);
    this.set('uploadedAudioDownId', null);
    this.set('uploadedAudioMobileId', null);
    this.set('currentAudioId', null);
    this.set('hideUpAudio', false);
    this.set('hideDownAudio', false);
    this.set('hideMobileAudio', false);
    if (this.$$("#audioFileUploadUp"))
      this.$$("#audioFileUploadUp").clear();
    if (this.$$("#audioFileUploadDown"))
      this.$$("#audioFileUploadDown").clear();
    if (this.$$("#audioFileUploadMobile"))
      this.$$("#audioFileUploadMobile").clear();
  },

  _postChanged: function (newPost) {
    // Remove any manually inserted points when the list is updated
    this.set('points', null);
    this.set('upPoints', null);
    this.set('downPoints', null);
    this.set('latestPointCreatedAt', null);
    this.set('storedPoints', null);
    this._clearVideo();
    this._clearAudio();

    if (newPost) {
      if (this.host) {
        this.$.ajax.url = this.host+'/api/posts/' + newPost.id + '/points';
      } else {
        this.$.ajax.url = '/api/posts/' + newPost.id + '/points';
      }
      this.$.ajax.generateRequest();
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointForLabel) {
        this.set('labelUp', this.post.Group.configuration.alternativePointForLabel);
      } else {
        this.set('labelUp', this.t('point.for'));
      }
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointAgainstLabel) {
        this.set('labelDown', this.post.Group.configuration.alternativePointAgainstLabel);
      } else {
        this.set('labelDown', this.t('point.against'));
      }
    }
  },

  removeElementsByClass: function (rootElement, className) {
    var elements = rootElement.getElementsByClassName(className);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  },

  _processStoredPoints: function () {
    console.info("_processStoredPoints");
    if (this.upPoints===null) {
      if (this.storedPoints && this.storedPoints.length > 0) {
        var upPoints = [];
        var downPoints = [];

        for (var i = 0; i < this.storedPoints.length; i++) {
          if (this.storedPoints[i].value>0) {
            upPoints.push(this.storedPoints[i]);
          } else if (this.storedPoints[i].value<0) {
            downPoints.push(this.storedPoints[i]);
          }
        }
        this.set('upPoints', upPoints);
        this.set('downPoints', downPoints);
      } else {
        this.set('upPoints', []);
        this.set('downPoints', []);
        this.set('points', []);
      }
    } else {
      console.log("Landscape points already setup");
    }

    if (!this.largeMode && !this.points) {
      this.set('points', this.interleaveArrays(this.upPoints, this.downPoints));
    }
  },

  _response: function (event, detail) {
    this.set('storedPoints', this._preProcessPoints(detail.response.points));
    this._processStoredPoints();
    this.removeElementsByClass(this, 'inserted-outside-list');
    this._updateCounterInfo();
    this._scrollPointIntoView();
    this._checkForMultipleLanguages();
  },

  _updatePointInLists: function (event, changedPoint) {
    this.upPoints.forEach(function (point, index) {
      if (point.id===changedPoint.id) {
        this.upPoints[index] = changedPoint;
      }
    }.bind(this));

    this.downPoints.forEach(function (point, index) {
      if (point.id===changedPoint.id) {
        this.downPoints[index] = changedPoint;
      }
    }.bind(this));

    if (this.points && this.points.length>0) {
      this.points.forEach(function (point, index) {
        if (point.id===changedPoint.id) {
          this.points[index] = changedPoint;
        }
      }.bind(this));
    }
  },

  _checkForMultipleLanguages: function () {
    if (!localStorage.getItem("dontPromptForAutoTranslation") &&
        !sessionStorage.getItem("dontPromptForAutoTranslation")) {
      var firstLanguage;
      var multipleLanguages = false;
      this.upPoints.forEach(function (point) {
        if (point.language && !multipleLanguages) {
          if (!firstLanguage && point.language!=='??') {
            firstLanguage = point.language;
          } else if (firstLanguage && firstLanguage!==point.language && point.language!=='??') {
            multipleLanguages = true;
            console.info("Multiple point languages: "+firstLanguage+" and "+point.language);
          }
        }
      });

      if (!multipleLanguages) {
        this.downPoints.forEach(function (point) {
          if (point.language && !multipleLanguages) {
            if (!firstLanguage && point.language!=='??') {
              firstLanguage = point.language;
            } else if (firstLanguage && firstLanguage!=point.language && point.language!=='??') {
              multipleLanguages = true;
              console.info("Multiple point languages: "+firstLanguage+" and "+point.language);
            }
          }
        });
      }

      if (false && multipleLanguages) {
        dom(document).querySelector('yp-app').getDialogAsync("autoTranslateDialog", function (dialog) {
          dialog.openLaterIfAutoTranslationEnabled();
        }.bind(this));
      }
    }
  },

  interleaveArrays: function (arrayA, arrayB) {
    var arrs = [arrayA, arrayB];
    var maxLength = Math.max.apply(Math, arrs.map(function (arr) {
      return arr.length
    }));

    var result = [];

    for (var i = 0; i < maxLength; ++i) {
      arrs.forEach(function (arr) {
        if (arr.length > i) {
          result.push(arr[i])
        }
      })
    }

    return result
  },

  _scrollPointIntoView: function () {
    if (this.scrollToId) {
      this.async(function () {
        var hasFoundIt=false;
        if (!this.largeMode) {
          this.points.forEach(function (point) {
            if (!hasFoundIt && point.id == this.scrollToId) {
              this.$$("#ironListMobile").scrollToItem(point);
              hasFoundIt = true;
            }
          }.bind(this));
        } else {
          this.upPoints.forEach(function (point) {
            if (!hasFoundIt && point.id == this.scrollToId) {
              this.$$("#ironListUp").scrollToItem(point);
              hasFoundIt = true;
            }
          }.bind(this));
          if (!hasFoundIt) {
            this.downPoints.forEach(function (point) {
              if (!hasFoundIt && point.id == this.scrollToId) {
                this.$$("#ironListDown").scrollToItem(point);
                hasFoundIt = true;
              }
            }.bind(this));
          }
        }

        if (hasFoundIt) {
          this.async(function () {
            // Change elevation
            var point = this.$$("#point"+this.scrollToId);
            if (point) {
              point.elevation = 5;
              point.elevation = 1;
              point.elevation = 5;
              this.async(function () {
                point.elevation = 1;
              }.bind(this), 7000);
            } else {
              console.warn("Can't find point to elevate");
            }
            this.set('scrollToId', null);
          }, 50);
        }
      }, 20);
    }
  },

  _floatIfValueOrIE: function (value) {
    var ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  },

  _preProcessPoints: function (points) {
    for (var i = 0; i < points.length; i++) {
      if (!this.latestPointCreatedAt || (!this.latestPointCreatedAt || points[i].created_at > this.latestPointCreatedAt)) {
        this.set('latestPointCreatedAt', points[i].created_at);
      }
      if (points[i].PointRevisions[points[i].PointRevisions.length-1] && points[i].PointRevisions[points[i].PointRevisions.length-1].content) {
        points[i].latestContent = points[i].PointRevisions[points[i].PointRevisions.length-1].content;
      } else {
        console.warn("No content for point in _preProcessPoints");
      }
    }
    return points;
  },

  _updateCounterInfo: function () {
    if (this.largeMode) {
      this.fire('yp-debate-info', {
        count: this.upPoints.length + this.downPoints.length,
        firstPoint: this.upPoints[0]
      });
    } else {
      this.fire('yp-debate-info', {
        count: this.points.length,
        firstPoint: this.points[0]
      });
    }
  },

  _insertNewPoint: function (point) {
    if (this.largeMode) {
      if (point.value > 0) {
        this.unshift('upPoints', point);
        this.async(function () {
          this.$$("#ironListUp").fire("iron-resize");
        }, 700);
      } else if (point.value < 0) {
        this.unshift('downPoints', point);
        this.async(function () {
          this.$$("#ironListDown").fire("iron-resize");
        }, 700);
      }
    } else {
      this.unshift('points', point);
      this.async(function () {
        this.$$("#ironListMobile").fire("iron-resize");
      }, 700);
    }
  },

  _newPointResponse: function (inEvent, inDetail) {
    if (this.currentVideoId) {
      var point = this._preProcessPoints([inDetail.response])[0];
      var ajax = document.createElement('iron-ajax');
      ajax.handleAs = 'json';
      ajax.contentType = 'application/json';
      ajax.url = '/api/videos/'+point.id+'/completeAndAddToPoint';
      ajax.method = 'PUT';
      ajax.body = {
        videoId: this.currentVideoId,
        appLanguage: this.language
      };
      ajax.addEventListener('response', function (event, detail) {
        this._completeNewPointResponse(event, event.detail);
      }.bind(this));
      ajax.generateRequest();
    } else if (this.currentAudioId) {
      var point = this._preProcessPoints([inDetail.response])[0];
      var ajax = document.createElement('iron-ajax');
      ajax.handleAs = 'json';
      ajax.contentType = 'application/json';
      ajax.url = '/api/audios/'+point.id+'/completeAndAddToPoint';
      ajax.method = 'PUT';
      ajax.body = {
        audioId: this.currentAudioId,
        appLanguage: this.language
      };
      ajax.addEventListener('response', function (event, detail) {
        this._completeNewPointResponse(event, event.detail);
      }.bind(this));
      ajax.generateRequest();
    } else {
      this._completeNewPointResponse(inEvent, inDetail);
    }
  },

  _completeNewPointResponse: function (event, detail) {
    this.set('addPointDisabled', false);
    var point = this._preProcessPoints([detail.response])[0];
    if (this.currentVideoId) {
      point.checkTranscriptFor = "video";
    } else if (this.currentAudioId) {
      point.checkTranscriptFor = "audio";
    }
    if (point.value > 0) {
      this.newPointTextCombined = this.t("point.forAdded") + " " + this.truncate(point.content, 21);
      this.set("textValueUp", "");
    } else {
      this.newPointTextCombined = this.t("point.againstAdded") + " " + this.truncate(point.content, 21);
      this.set("textValueDown", "");
    }
    this.set("textValueMobileUpOrDown", "");
    this._insertNewPoint(point);
    this.set('post.counter_points', this.post.counter_points + 1);
    this.$.newPointToast.show();
    this._updateCounterInfo();
    this._clearVideo();
    this._clearAudio();
  },

  addPointUp: function () {
    this.addPoint(this.textValueUp, 1, this.uploadedVideoUpId, this.uploadedAudioUpId);
    window.appGlobals.activity('add', 'pointUp');
  },

  addPointDown: function () {
    this.addPoint(this.textValueDown, -1, this.uploadedVideoDownId, this.uploadedAudioDownId);
    window.appGlobals.activity('add', 'pointDown');
  },

  addMobilePointUpOrDown: function () {
    if (this.pointUpOrDownSelected=='pointFor') {
      this.addPoint(this.textValueMobileUpOrDown, 1, this.uploadedVideoMobileId, this.uploadedAudioMobileId);
      window.appGlobals.activity('add', 'pointUp');
    } else if (this.pointUpOrDownSelected=='pointAgainst') {
      this.addPoint(this.textValueMobileUpOrDown, -1, this.uploadedVideoMobileId, this.uploadedAudioMobileId);
      window.appGlobals.activity('add', 'pointDown');
    }
  },

  addPoint: function (content, value, videoId, audioId) {
    if (window.appUser.loggedIn() === true) {
      this.$.newPointAjax.url = "/api/points/" + this.post.group_id;
      this.$.newPointAjax.body = {
        postId: this.post.id,
        content: content,
        value: value
      };
      this.$.newPointAjax.generateRequest();
      this.set('addPointDisabled', true);
      if (videoId)
        this.set('currentVideoId', videoId);
      else if (audioId)
        this.set('currentAudioId', audioId);
    } else {
      window.appUser.loginForNewPoint(this, {content: content, value: value});
    }
  },

  focusUpPoint: function () {
  },

  focusDownPoint: function () {
  },

  focusTextArea: function (event) {
    event.currentTarget.parentElement.elevation = 3;
  },

  blurTextArea: function (event) {
    event.currentTarget.parentElement.elevation = 1;
  },

  _hasCurrentUpVideo: function (value) {
    if (value) {
      this.set('hideUpAudio', true);
      this.set('hideUpText', true);
    } else {
      this.set('hideUpAudio', false);
      this.set('hideUpText', false);
    }
  },

  _hasCurrentDownVideo: function (value) {
    if (value) {
      this.set('hideDownAudio', true);
      this.set('hideDownText', true);
    } else {
      this.set('hideDownAudio', false);
      this.set('hideDownText', false);
    }
  },

  _hasCurrentUpAudio: function (value) {
    if (value) {
      this.set('hideUpVideo', true);
      this.set('hideUpText', true);
    } else {
      this.set('hideUpVideo', false);
      this.set('hideUpText', false);
    }
  },

  _hasCurrentDownAudio: function (value) {
    if (value) {
      this.set('hideDownVideo', true);
      this.set('hideDownText', true);
    } else {
      this.set('hideDownVideo', false);
      this.set('hideDownText', false);
    }
  },

  _hasCurrentMobileVideo: function (value) {
    if (value) {
      this.set('hideMobileAudio', true);
      this.set('hideMobileText', true);
    } else {
      this.set('hideMobileAudio', false);
      this.set('hideMobileText', false);
    }
  },

  _hasCurrentMobileAudio: function (value) {
    if (value) {
      this.set('hideMobileVideo', true);
      this.set('hideMobileText', true);
    } else {
      this.set('hideMobileVideo', false);
      this.set('hideMobileText', false);
    }
  },

  ifLengthIsRight: function (type, textValue, hasVideoId, hasAudioId) {
    if (hasVideoId != null) {
      if (type==="up") {
        this.set("hideUpVideo", false);
        this.set('hideUpAudio', true);
        this.set('hideUpText', true);
      }
      if (type==="down") {
        this.set("hideDownVideo", false);
        this.set("hideDownAudio", true);
        this.set("hideDownText", true);
      }
      if (type==="mobile") {
        this.set("hideMobileVideo", false);
        this.set("hideMobileAudio", true);
        this.set("hideMobileText", true);
      }
      return true;
    } else  if (hasAudioId != null) {
      if (type==="up") {
        this.set("hideUpAudio", false);
        this.set('hideUpVideo', true);
        this.set('hideUpText', true);
      }
      if (type==="down") {
        this.set("hideDownAudio", false);
        this.set("hideDownVideo", true);
        this.set("hideDownText", true);
      }
      if (type==="mobile") {
        this.set("hideMobileAudio", false);
        this.set("hideMobileVideo", true);
        this.set("hideMobileText", true);
      }
      return true;
    } else if (textValue!=null && textValue.length === 0) {
      if (type==="up") {
        this.set("hideUpVideo", false);
        this.set('hideUpAudio', false);
        this.set('hideUpText', false);
      }
      if (type==="down") {
        this.set("hideDownVideo", false);
        this.set("hideDownAudio", false);
        this.set("hideDownText", false);
      }
      if (type==="mobile") {
        this.set("hideMobileVideo", false);
        this.set("hideMobileAudio", false);
        this.set("hideMobileText", false);
      }
      return false;
    } else if (textValue!=null && textValue.length > 0) {
      if (type==="up") {
        this.set("hideUpVideo", true);
        this.set('hideUpAudio', true);
        this.set('hideUpText', false);
      }
      if (type==="down") {
        this.set("hideDownVideo", true);
        this.set("hideDownAudio", true);
        this.set("hideDownText", false);
      }
      if (type==="mobile") {
        this.set("hideMobileVideo", true);
        this.set("hideMobileAudio", true);
        this.set("hideMobileText", false);
      }
      return true;
    } else if (textValue!=null && textValue.length > 1) {
      return true;
    } else {
      return false;
    }
  }
});
