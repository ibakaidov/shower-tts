/**
 * @fileOverview
 * Progress plugin for shower.
 */
function Server() {

}

Server.prototype.say = function (text, cb) {
    this._httpGetAsync('http://127.0.0.1:23921/say?text="' + encodeURI(text) + '"', cb);
}
Server.prototype.stop = function (cb) {
    this._httpGetAsync('http://127.0.0.1:23921/stop', cb);

}

Server.prototype._httpGetAsync = (theUrl, callback) => {
    var xmlHttp = new XMLHttpRequest();
    callback = callback || function () { };
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

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
        this._server = new Server();

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

    extend(Tts.prototype, /** @lends plugin.Tts.prototype */{

        destroy: function () {
            this._clearListeners();
            this._shower = null;
            this._server = null;
            this.currentText = null;
        },

        updateProgress: function () {
            this.currentText=null;
            var slidetext = this._shower.player.getCurrentSlide().layout._element.querySelector('.tts-slidetext');
            if (slidetext != null) {
                this.currentText = (slidetext.innerHTML);
            }
        },
        sayCurrent: function () {
            if (this.currentText===null) return;
            this._server.stop(() => {
                this._server.say(this.currentText);
            })
        },
        stop: function () {
            this._server.stop();
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