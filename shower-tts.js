/**
 * @fileOverview
 * TTS plugin for shower.
 */

shower.modules.define('shower-tts', [
    'util.extend'
], function (provide, extend) {

    /**
     * @class
     * Tts plugin for shower.
     * @name plugin.tts
     * @param {Shower} shower
     * @param {Object} [options] Plugin options.
     * @param {String} [options.selector = '.tts']
     * @constructor
     */
    function Tts(shower, options) {
        options = options || {};
        this._shower = shower;
        this._playerListeners = null;

        this._element = null;
        this._elementSelector = options.selector || '.tts';

        var showerContainerElement = this._shower.container.getElement();
        this._element = showerContainerElement.querySelector(this._elementSelector);

        if (this._element) {
            this._setupListeners();

            this._element.setAttribute('role', 'tts');
            this.updateProgress();
        }
    }

    extend(Tts.prototype, /** @lends plugin.Tts.prototype */ {

        destroy: function () {
            this._clearListeners();
            this._shower = null;
            this.currentText = null;
        },

        updateProgress: function () {
            this.currentText = null;
            var slidetext = this._shower.player.getCurrentSlide().layout._element.querySelector('.tts-slidetext');

            this.currentText = (slidetext.innerHTML) || "";

        },
        sayCurrent: function () {
            if (this.currentText === null) return;
            var msg = new SpeechSynthesisUtterance();
            msg.voice = this.options.voice||window.speechSynthesis.voice
            msg.rate = 1;
            msg.pitch = 1;
            msg.text = this.currentText;


            speechSynthesis.speak(msg);

        },
        stop: function () {
            window.speechSynthesis.stop
        },

        _setupListeners: function () {
            var shower = this._shower;

            this._showerListeners = shower.events.group()
                .on('destroy', this.destroy, this);

            this._playerListeners = shower.player.events.group()
                .on('activate', this._onSlideChange, this);
            window.addEventListener('keyup', (e) => {

                if (e.code === "KeyS") {
                    this.sayCurrent();
                }
                if (e.code === "KeyP") {
                    this.stop();
                }
            })
        },

        _clearListeners: function () {
            if (this._showerListeners) {
                this._showerListeners.offAll();
            }
            if (this._playerListeners) {
                this._playerListeners.offAll();
            }
        },

        _onSlideChange: function () {
            this.updateProgress();
        }
    });

    provide(Tts);
});

shower.modules.require(['shower'], function (sh) {
    sh.plugins.add('shower-tts');
});