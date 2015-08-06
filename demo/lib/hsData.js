(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HsDataFactoryList = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zilong on 6/15/15.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var AsyncBase = (function () {
    function AsyncBase() {
        _classCallCheck(this, AsyncBase);

        this.dataReadyFns = [];
        this.dataReadyOnceFns = [];

        this.errorFns = [];
        this.errorOnceFns = [];

        this.status = '';
        this.response = {};
    }

    _createClass(AsyncBase, [{
        key: 'onDataReady',
        value: function onDataReady(fn, isOnce) {
            if (typeof fn === 'function') {
                if (isOnce) {
                    this.dataReadyOnceFns.push(fn);
                } else {
                    this.dataReadyFns.push(fn);
                }
            } else {
                this.status = _Const2['default'].status.complete;
                this.response = fn;
            }

            if (this.status == _Const2['default'].status.complete) {
                for (var i in this.dataReadyFns) {
                    this.dataReadyFns[i].call(this, this.response);
                }
                for (var i in this.dataReadyOnceFns) {
                    this.dataReadyOnceFns.call(this, this.response);
                }
                this.dataReadyOnceFns = [];
            }
            return this;
        }
    }, {
        key: 'onError',
        value: function onError(fn, isOnce) {
            if (typeof fn == 'function') {
                if (isOnce) {
                    this.errorOnceFns.push(fn);
                } else {
                    this.errorFns.push(fn);
                }
            } else {
                this.status = _Const2['default'].status.error;
                this.response = fn;
            }

            if (this.status == _Const2['default'].status.error) {
                for (var i in this.errorFns) {
                    this.errorFns[i].call(this, this.response);
                }
                for (var i in this.errorOnceFns) {
                    this.errorOnceFns[i].call(this, this.response);
                }
                this.errorOnceFns = [];
            }
            return this;
        }

        //__beforeSuccess(e){
        //    this.status = Const.status.complete;
        //    this.response = e;
        //}
        //
        //__beforeError(e){
        //    this.status = Const.status.error;
        //    this.response = e;
        //}

    }]);

    return AsyncBase;
})();

exports['default'] = AsyncBase;
module.exports = exports['default'];

},{"./Const":2}],2:[function(require,module,exports){
/**
 * Created by zilong on 6/15/15.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var Const = {
    status: {
        complete: 'complete',
        error: 'error'
    },
    token: {
        HsToken: 'HS_TOKEN'
    },
    tokenServer: {
        maxTokenRequestTime: 5,
        tokenRequestTimeout: 5000,
        tokenReadyStatus: 'tokenReady'
    },
    errorCode: {
        MAX_REQUEST_TOKEN_TIME_EXHAUST_ERR_CODE: -1
    },
    hsInstance: {
        timeout: 5000
    }
};
exports['default'] = Const
//module.exports = Const;
;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
//'use strict'
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _HsInstanceJs = require('./HsInstance.js');

var _HsInstanceJs2 = _interopRequireDefault(_HsInstanceJs);

var _TokenServerJs = require('./TokenServer.js');

var _TokenServerJs2 = _interopRequireDefault(_TokenServerJs);

var _ConstJs = require('./Const.js');

var _ConstJs2 = _interopRequireDefault(_ConstJs);

_TokenServerJs2['default'].onError(function (e) {
    var _this = this;
    if (e.error_code && e.error_code == _ConstJs2['default'].errorCode.MAX_REQUEST_TOKEN_TIME_EXHAUST_ERR_CODE) {
        //10分钟后重试
        setTimeout(function () {
            _this.requestToken();
        }, 10 * 1000);
    }
});

//class HsFactoryBase{
//    constructor(url,reqData){
//        this.url = url;
//        this.reqData = reqData;
//        this.hsInstance = new HsInstance(url,reqData)
//    }
//    onDataReady(fn){
//        if(typeof fn=='function'){
//            var newFunc = fn;
//            if(typeof this.dataFilter=='function'){
//                newFunc = function(e){
//                    var newE = this.dataFilter(e)
//                    fn(newE)
//                }
//            }
//            this.hsInstance.onDataReady(newFunc)
//        }
//        return this
//    }
//    onError(fn){
//        if(typeof fn=='function'){
//            this.hsInstance.onError(fn)
//        }
//        return this;
//    }
//    init(){
//        this.hsInstance.init();
//        return this;
//    }
//}

var apiUrlMap = {
    wizard: 'http://open.hs.net/quote/v1/wizard',
    kline: 'http://open.hs.net/quote/v1/kline',
    real: 'http://open.hs.net/quote/v1/real',
    trend: 'http://open.hs.net/quote/v1/trend'
};

//class WizardFactory extends HsFactoryBase{
//    constructor(reqData){
//        super(apiUrlMap.wizard,reqData)
//    }
//}
//
//class KlineFactory extends HsFactoryBase{
//    constructor(reqData){
//        super(apiUrlMap.kline,reqData)
//    }
//}
//
//class RealFactory extends HsFactoryBase{
//    constructor(reqData){
//        super(apiUrlMap.real,reqData)
//    }
//}

var HsDataFactoryList = {
    '__tokenServer': _TokenServerJs2['default']
};

for (var i in apiUrlMap) {
    var key = i;
    var url = apiUrlMap[i];
    (function (url) {
        HsDataFactoryList[key] = function (reqData) {
            return new _HsInstanceJs2['default'](url, reqData);
        };
    })(url);
}

//const HsDataFactoryList ={
//    'wizard':WizardFactory,
//    'kline':KlineFactory,
//    'real':RealFactory,
//    '__tokenServer':TokenServer
//}

exports['default'] = HsDataFactoryList;
module.exports = exports['default'];

},{"./Const.js":2,"./HsInstance.js":4,"./TokenServer.js":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _AsyncBaseJs = require('./AsyncBase.js');

var _AsyncBaseJs2 = _interopRequireDefault(_AsyncBaseJs);

var _ConstJs = require('./Const.js');

var _ConstJs2 = _interopRequireDefault(_ConstJs);

var _TokenServerJs = require('./TokenServer.js');

var _TokenServerJs2 = _interopRequireDefault(_TokenServerJs);

//import ajax from './reqwest.js'

var ajax = $.ajax;

var CommonErrorFunc = {
    invalidToken: function invalidToken(errObj) {
        if (errObj && errObj.error) {
            if (errObj.error == 'invalid_token') {
                this.client.needNewToken();
                return true;
            }
        }
    },
    dataEmpty: function dataEmpty(errObj) {
        if (errObj.error_no == '-1' && errObj.error_code == '1') {
            this.onDataReady({ data: [] });
            this.end();
            return true;
        }
    }
};

var HsInstance = (function (_AsyncBase) {
    function HsInstance(url, reqData) {
        _classCallCheck(this, HsInstance);

        _get(Object.getPrototypeOf(HsInstance.prototype), 'constructor', this).call(this);
        this.client = _TokenServerJs2['default'].createClient();
        this.url = url;
        this.reqData = reqData || {};
        this.tokenServer = _TokenServerJs2['default'];
        this.onError(CommonErrorFunc.invalidToken);
        this.onError(CommonErrorFunc.dataEmpty);
    }

    _inherits(HsInstance, _AsyncBase);

    _createClass(HsInstance, [{
        key: 'init',
        value: function init() {
            var _this = this;
            this.client.onTokenReady(function (tokenObj) {
                _this.reData(tokenObj.token);
            });
            return this;
        }
    }, {
        key: 'end',
        value: function end() {
            this.client.end();
        }
    }, {
        key: 'reData',
        value: function reData(token) {
            var _this = this;
            ajax({
                url: this.url,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: this.reqData,
                timeout: _ConstJs2['default'].hsInstance.timeout,
                success: function success(e) {
                    var resJson = {};
                    if (typeof e == 'string') {
                        resJson = JSON.parse(e);
                    } else {
                        resJson = e;
                    }
                    _this.onDataReady(resJson);
                    _this.end();
                },
                error: function error(e) {
                    if (e || e.responseText) {
                        var errObj;
                        try {
                            errObj = JSON.parse(e.responseText);
                        } catch (e) {
                            errObj = {
                                error: 'hs_server_unknown_error'
                            };
                        }
                        _this.errObj = errObj;
                        _this.onError(errObj);
                    }
                }
            });
        }
    }]);

    return HsInstance;
})(_AsyncBaseJs2['default']);

exports['default'] = HsInstance;
module.exports = exports['default'];

},{"./AsyncBase.js":1,"./Const.js":2,"./TokenServer.js":7}],5:[function(require,module,exports){
/**
 * Created by zilong on 6/15/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var ServerConfig = {
    tokenUrl: {
        url: 'http://api.wallstreetcn.com/v2/itn/token/public',
        urlWithClearCache: 'http://api.wallstreetcn.com/v2/itn/token/public?_eva_refresh_dispatch_cache=1'
    }
};
exports['default'] = ServerConfig;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
/**
 * Created by zilong on 6/15/15.
 */

/**
 * 如果localStorage 可用，用之
 * 如果不可用（node环境或浏览器禁用），用对象模拟
 *
 *
 * 因为仅仅是简单使用localStorage，直接使用对象形式
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function isLocalStorageNameSupported() {
    if (window && window.localStorage) {
        var testKey = '__test',
            storage = window.localStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
    return false;
}

var Storage = (function () {
    function Storage() {
        _classCallCheck(this, Storage);

        if (isLocalStorageNameSupported()) {
            this.pool = window.localStorage;
        } else {
            this.pool = {};
        }
    }

    _createClass(Storage, [{
        key: 'getItem',
        value: function getItem(key) {
            return this.pool[key];
        }
    }, {
        key: 'setItem',
        value: function setItem(key, value) {
            this.pool[key] = value;
        }
    }, {
        key: 'removeItem',
        value: function removeItem(key) {
            delete this.pool[key];
        }
    }]);

    return Storage;
})();

exports['default'] = new Storage();
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _AsyncBaseJs = require('./AsyncBase.js');

var _AsyncBaseJs2 = _interopRequireDefault(_AsyncBaseJs);

//import reqwest  from './reqwest.js'

var _StorageJs = require('./Storage.js');

var _StorageJs2 = _interopRequireDefault(_StorageJs);

var _ConstJs = require('./Const.js');

var _ConstJs2 = _interopRequireDefault(_ConstJs);

var _ServerConfigJs = require('./ServerConfig.js');

var _ServerConfigJs2 = _interopRequireDefault(_ServerConfigJs);

var ajax = $.ajax;
var HS_TOKEN_KEY = _ConstJs2['default'].token.HsToken;
var MAX_REQUEST_TOKEN_TIME_EXHAUST_ERR_CODE = _ConstJs2['default'].errorCode.MAX_REQUEST_TOKEN_TIME_EXHAUST_ERR_CODE;
var RE_TOKEN = 'reToken';

var TokenClient = (function (_AsyncBase) {
    function TokenClient(server, id) {
        _classCallCheck(this, TokenClient);

        _get(Object.getPrototypeOf(TokenClient.prototype), 'constructor', this).call(this);
        this.server = server;
        this.id = id;
        this.tokenReadyFn = undefined;
    }

    _inherits(TokenClient, _AsyncBase);

    _createClass(TokenClient, [{
        key: 'onTokenReady',
        value: function onTokenReady(fn) {
            if (typeof fn == 'function') {
                this.tokenReadyFn = fn;
            }
            if (this.server.status == _ConstJs2['default'].status.complete) {
                this.tokenReadyFn.call(this, { token: this.server.token });
            }
        }
    }, {
        key: 'needNewToken',
        value: function needNewToken() {
            this.server.reToken();
        }
    }, {
        key: 'end',
        value: function end() {
            this.server.removeClient(this);
        }
    }]);

    return TokenClient;
})(_AsyncBaseJs2['default']);

var TokenServer = (function (_AsyncBase2) {
    function TokenServer() {
        _classCallCheck(this, TokenServer);

        _get(Object.getPrototypeOf(TokenServer.prototype), 'constructor', this).call(this);
        this.clients = {};
        this.clientIndex = 0;
        this.tokenRequestTime = 0;

        //默认的onDataReady 和 onError 处理
        this.onDataReady(function (e) {
            for (var i in this.clients) {
                this.clients[i].onTokenReady(e);
            }
        });

        this.requestToken();
    }

    _inherits(TokenServer, _AsyncBase2);

    _createClass(TokenServer, [{
        key: 'createClient',
        value: function createClient() {
            var client = new TokenClient(this, this.clientIndex++);
            this.clients[client.id] = client;
            return client;
        }
    }, {
        key: 'removeClient',
        value: function removeClient(client) {
            delete this.clients[client.id];
        }
    }, {
        key: 'reToken',
        value: function reToken() {
            if (this.status == RE_TOKEN) {
                return;
            }
            this.status = RE_TOKEN;
            _StorageJs2['default'].removeItem(HS_TOKEN_KEY);
            this.requestToken();
        }
    }, {
        key: 'requestToken',
        value: function requestToken(url) {
            url = url || _ServerConfigJs2['default'].tokenUrl.url;
            var sToken = _StorageJs2['default'].getItem(HS_TOKEN_KEY);
            if (sToken) {
                this.token = sToken;
                this.onDataReady({ token: sToken });
                return;
            }
            this.tokenRequestTime++;

            if (this.tokenRequestTime > _ConstJs2['default'].tokenServer.maxTokenRequestTime) {
                this.tokenRequestTime = 0; //need reset??
                this.onError({ error_code: MAX_REQUEST_TOKEN_TIME_EXHAUST_ERR_CODE });
            }

            var _this = this;

            ajax({
                url: url,
                dataType: 'jsonp',
                timeout: _ConstJs2['default'].tokenServer.tokenRequestTimeout,
                success: function success(e) {
                    var token = e.results.access_token;
                    _this.token = token;
                    _StorageJs2['default'].setItem(_ConstJs2['default'].token.HsToken, token);
                    _this.onDataReady({ token: token });
                },
                error: function error(e) {
                    _this.requestToken(url);
                }
            });
        }
    }]);

    return TokenServer;
})(_AsyncBaseJs2['default']);

//单例
exports['default'] = TokenServer = new TokenServer();
module.exports = exports['default'];

},{"./AsyncBase.js":1,"./Const.js":2,"./ServerConfig.js":5,"./Storage.js":6}]},{},[3])(3)
});
//# sourceMappingURL=hsData.js.map