import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import './yp-app-icons.js';

import { ypRemoveClassBehavior } from './yp-remove-class-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ypLocalizationBridgeBehavior } from './yp-localization-bridge-behavior.js';

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        @apply --layout-horizontal;
        min-width: 125px;
      }

      .action-text {
        font-size: 12px;
        padding-top: 12px;
      }

      .action-up {
        @apply --layout-horizontal;
      }

      .action-down {
        @apply --layout-horizontal;
      }

      .up-selected {
        color: #444;
      }

      .down-selected {
        color: #444;
      }

      .middle {
        @apply --layout-horizontal;
        @apply --layout-flex;
        @apply --layout-center-justified;
      }

      .all-actions {
        @apply --layout-horizontal;
        @apply --layout-flex;
        @apply --layout-start-justified;
        color: #aaa;
      }

      yp-ajax {
        min-width: 32px;
      }

      .myButton {
      --paper-icon-button {
        width: 10px;
        height: 10px;
      }
      }

      .shareIcon {
        --paper-share-button-icon-color: #ddd;
        text-align: right;
      }

      .shareIcon[up-voted] {
        --paper-share-button-icon-color: var(--accent-color-400);
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="all-actions" hidden\$="[[hideNotHelpful]]">
      <div id="actionUp" class="actionUp layout horizontal">
        <paper-icon-button title\$="[[t('point.helpful')]]" disabled="[[allDisabled]]" icon="arrow-upward" class="point-up-vote-icon myButton" on-tap="pointHelpful"></paper-icon-button>
        <div class="action-text action-up">{{point.counter_quality_up}}</div>
      </div>
      <div id="actionDown" class="actionDown layout horizontal">
        <paper-icon-button title\$="[[t('point.not_helpful')]]" disabled="[[allDisabled]]" icon="arrow-downward" class="point-down-vote-icon myButton" on-tap="pointNotHelpful"></paper-icon-button>
        <div class="action-text">{{point.counter_quality_down}}</div>
      </div>
    </div>
    <paper-share-button hidden on-share-tap="_shareTap" class="shareIcon" up-voted\$="[[isUpVoted]]" horizontal-align="right" id="shareButton" title\$="[[t('sharePoint')]]" facebook="" google="" twitter="" url="[[pointUrl]]"></paper-share-button>

    <yp-ajax id="pointQualityAjax" method="POST" on-response="_pointQualityResponse"></yp-ajax>
    <lite-signal on-lite-signal-got-endorsements-and-qualities="_updateQualitiesFromSignal"></lite-signal>
`,

  is: 'yp-point-actions',

  behaviors: [
    ypRemoveClassBehavior,
    ypLocalizationBridgeBehavior
  ],

  properties: {
    point: {
      type: Object,
      observer: "_onPointChanged"
    },

    hideNotHelpful: {
      type: Boolean,
      value: false
    },

    pointQualityValue: {
      type: Number,
      value: 0
    },

    isUpVoted: {
      type: Boolean,
      value: false
    },

    allDisabled: {
      type: Boolean,
      value: false
    },

    pointUrl: {
      type: String
    },

    hideSharing: {
      type: Boolean,
      value: false
    }
  },

  observers: [
    '_qualityChanged(point.counter_quality_up, point.counter_quality_down)'
  ],

  _onPointChanged: function (newValue, oldValue) {
    if (newValue) {
      this._updateQualities();
    } else {
      this.set('isUpVoted', false);
    }
  },

  _updateQualitiesFromSignal: function () {
    this._updateQualities();
  },

  _updateQualities: function () {
    if (window.appUser && window.appUser.loggedIn() && window.appUser.user && window.appUser.user.PointQualities) {
      var thisPointQuality = window.appUser.pointQualitiesIndex[this.point.id];
      if (thisPointQuality) {
        this._setPointQuality(thisPointQuality.value);
        if (thisPointQuality.value>0) {
          this.set('isUpVoted', true);
        }
      } else {
        this.set('isUpVoted', false);
        this._setPointQuality(null);
      }
    } else {
      this.set('isUpVoted', false);
      this._setPointQuality(null);
    }
  },

  _qualityChanged: function (a, b) {
    // TODO: Fix where you can't vote up a newstory just after posting
    //this._resetClasses();
    //this.set('isUpVoted', false);
  },

  _resetClasses: function () {
    if (this.pointQualityValue && this.pointQualityValue > 0) {
      this.$.actionUp.className += " " + "up-selected";
      this.removeClass(this.$.actionDown, "down-selected");
    } else if (this.pointQualityValue && this.pointQualityValue < 0) {
      this.$.actionDown.className += " " + "down-selected";
      this.removeClass(this.$.actionUp,"up-selected");
    } else {
      this.removeClass(this.$.actionUp,"up-selected");
      this.removeClass(this.$.actionDown, "down-selected");
    }
  },

  _setPointQuality: function (value) {
    this.set('pointQualityValue', value);
    this._resetClasses();
  },

  _pointQualityResponse: function (event, detail) {
    this.set('allDisabled', false);
    var pointQuality = detail.response.pointQuality;
    var oldPointQualityValue = detail.response.oldPointQualityValue;
    this._setPointQuality(pointQuality.value);
    window.appUser.updatePointQualityForPost(this.point.id, pointQuality);
    if (oldPointQualityValue) {
      if (oldPointQualityValue>0)
        this.set('point.counter_quality_up', this.point.counter_quality_up-1);
      else if (oldPointQualityValue<0)
        this.set('point.counter_quality_down', this.point.counter_quality_down-1);
    }
    if (pointQuality.value>0)
      this.set('point.counter_quality_up', this.point.counter_quality_up+1);
    else if (pointQuality.value<0)
      this.set('point.counter_quality_down', this.point.counter_quality_down+1)
  },

  generatePointQualityFromLogin: function (value) {
    if (!window.appUser.pointQualitiesIndex[this.point.id]) {
      this.generatePointQuality(value);
    }
  },

  generatePointQuality: function (value) {
    if (window.appUser.loggedIn()===true) {
      this.$.pointQualityAjax.url = "/api/points/" + this.point.id + "/pointQuality";
      this.$.pointQualityAjax.body = { point_id: this.point.id, value: value };
      if (this.pointQualityValue === value) {
        this.$.pointQualityAjax.method = "DELETE";
      } else {
        this.$.pointQualityAjax.method = "POST";
      }
      this.$.pointQualityAjax.generateRequest();
    } else {
      this.set('allDisabled', false);
      window.appUser.loginForPointQuality(this, { value: value } );
    }
  },

  pointHelpful: function () {
    this.set('allDisabled', true);
    this.generatePointQuality(1);
    this.set('isUpVoted', true);
    this.updateStyles();
    window.appGlobals.activity('clicked', 'pointHelpful', this.point.id);
  },

  pointNotHelpful: function () {
    this.set('allDisabled', true);
    window.appGlobals.activity('clicked', 'pointNotHelpful', this.point.id);
    this.generatePointQuality(-1);
  }
});
