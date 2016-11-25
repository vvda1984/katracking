var KConfig = (function () {
    function KConfig() {
        this.enableDebug = true;
        this.enableOffline = false;
        this.protocol = "http";
        this.ipAddress = "localhost/kas-test";
        this.port = "80";
        this.serviceName = "KAService.svc";
        this.baseURL = "http://localhost:80/kas-test/KAService.svc";
        this.pingInterval = 3;
        this.requestTimeout = 30;
        this.enableMap = true;
    }
    KConfig.prototype.updateBaseURL = function () {
        var host = this.ipAddress;
        var subhost = '';
        var positionS = this.ipAddress.indexOf('/');
        if (positionS > 0) {
            host = this.ipAddress.substr(0, positionS);
            subhost = this.ipAddress.substr(positionS);
        }
        this.baseURL = this.protocol + '://' + host + ':' + this.port.toString() + subhost + '/' + this.serviceName;
        kapp.log.debug(this.baseURL);
    };
    KConfig.prototype.setValue = function (name, value) {
        switch (name) {
            case "protocol":
                this.protocol = value;
                break;
            case "ipAddress":
                this.ipAddress = value;
                break;
            case "port":
                this.port = value;
                break;
            case "serviceName":
                this.serviceName = value;
                break;
            case "pingInterval":
                this.pingInterval = parseInt(value);
                break;
            case "requestTimeout":
                this.requestTimeout = parseInt(value);
                break;
            case "enableMap":
                this.enableMap = parseInt(value) == 1;
                break;
        }
    };
    return KConfig;
}());
var KLogger = (function () {
    function KLogger() {
        this._logSeverity = 1;
    }
    KLogger.prototype.writeLog = function (str, level) {
        if (level == LogSeverity.Error) {
            console.error(str);
        }
        else if (level == LogSeverity.Info) {
            console.info(str);
        }
        else if (level == LogSeverity.Debug) {
            console.debug(str);
        }
        else {
            console.log(str);
        }
    };
    KLogger.prototype.info = function (str) {
        if ((this._logSeverity & LogSeverity.Info) > 0)
            this.writeLog(str, LogSeverity.Info);
    };
    KLogger.prototype.debug = function (str) {
        if ((this._logSeverity & LogSeverity.Debug) > 0)
            this.writeLog(str, LogSeverity.Debug);
    };
    KLogger.prototype.error = function (str) {
        if ((this._logSeverity & LogSeverity.Error) > 0)
            this.writeLog(str, LogSeverity.Error);
    };
    return KLogger;
}());
var KUtils = (function () {
    function KUtils() {
    }
    KUtils.prototype.isEmpty = function (text) {
        if (text == undefined)
            return true;
        if (text == null)
            return true;
        if (text == 'null')
            return true;
        return (!text || 0 === text.length);
    };
    KUtils.prototype.isNull = function (obj) {
        if (obj == undefined)
            return true;
        if (obj == null)
            return true;
        return false;
    };
    KUtils.prototype.parseInt = function (str) {
        try {
            return parseInt(str);
        }
        catch (ex) {
            return null;
        }
    };
    return KUtils;
}());
var KContext = (function () {
    function KContext() {
        this.user = null;
        this.token = "";
        this.userContext = { truck: null };
    }
    KContext.prototype.clear = function () {
        this.user = null;
        this.token = "";
        this.userContext = { truck: null };
        this.tag = null;
    };
    return KContext;
}());
var KParamter = (function () {
    function KParamter() {
    }
    KParamter.prototype.clear = function () {
        this.truck = null;
        this.journal = null;
        this.allowBack = false;
        this.nextState = null;
    };
    return KParamter;
}());
var KNetwork = (function () {
    function KNetwork() {
        this._isServerConnected = false;
        this._enablePing = false;
    }
    KNetwork.prototype.isReady = function () {
        return this.hasNetwork() && this._isServerConnected;
    };
    KNetwork.prototype.hasNetwork = function () {
        if (kapp.config.enableOffline)
            return false;
        try {
            //states[Connection.UNKNOWN] = 'Unknown connection';
            //states[Connection.ETHERNET] = 'Ethernet connection';
            //states[Connection.WIFI] = 'WiFi connection';
            //states[Connection.CELL_2G] = 'Cell 2G connection';
            //states[Connection.CELL_3G] = 'Cell 3G connection';
            //states[Connection.CELL_4G] = 'Cell 4G connection';
            //states[Connection.CELL] = 'Cell generic connection';
            //states[Connection.NONE] = 'No network connection';
            var networkState = navigator.connection.type;
            kapp.log.info('Network status: ' + networkState);
            return (networkState !== Connection.NONE && networkState !== Connection.UNKNOWN);
        }
        catch (err) {
            return true;
        }
    };
    KNetwork.prototype.doPing = function () {
        var _this = this;
        setTimeout(function () {
            if (_this._enablePing) {
                if (!kapp.utils.isNull(_this._pingAction)) {
                    _this._pingAction(function (result) {
                        _this._isServerConnected = result;
                        if (_this._enablePing)
                            _this.doPing();
                    });
                }
                else
                    _this.doPing();
            }
        }, kapp.config.pingInterval * 1000);
    };
    KNetwork.prototype.startPing = function (pingAction) {
        if (!kapp.utils.isNull(pingAction)) {
            this._pingAction = pingAction;
        }
        if (!kapp.utils.isNull(this._pingAction)) {
            var _this_1 = this;
            _this_1._enablePing = true;
            _this_1._pingAction(function (result) {
                _this_1._isServerConnected = result;
                if (_this_1._enablePing)
                    _this_1.doPing();
            });
        }
    };
    KNetwork.prototype.stopPing = function () {
        this._enablePing = false;
    };
    KNetwork.prototype.post = function (http, method, body, callback) {
        if (this.hasNetwork()) {
            var url = kapp.config.baseURL + "/" + method;
            kapp.log.debug("Call api: " + url);
            http.post(url, JSON.stringify(body), { timeout: app.config.requestTimeout * 1000 })
                .success(function (response, status) {
                kapp.log.debug("Response status: " + status.toString());
                if (status == 200) {
                    kapp.log.debug(response);
                    if (response.status == ResponseStatus.Success) {
                        callback({ data: response });
                    }
                    else if (response.status == ResponseStatus.Error) {
                        callback({ errorMessage: response.errorMessage });
                    }
                    else {
                        callback({ data: response });
                    }
                }
                else {
                    callback({ errorMessage: "Network error: " + status.toString() });
                }
            })
                .error(function (error) {
                kapp.log.error(error);
                callback({ errorMessage: "Network: \n" + error });
            });
        }
        else {
            callback({ errorMessage: "Kh�ng c� k?t n?i internet!" });
        }
    };
    KNetwork.prototype.ajaxPost = function (method, body, callback) {
        if (this.hasNetwork()) {
            var url = kapp.config.baseURL + "/" + method;
            kapp.log.debug("Call api: " + url);
            $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify(body),
                processData: false,
                dataType: "text",
                timeout: app.config.requestTimeout * 1000,
                success: function (resp) {
                    kapp.log.debug(resp);
                    var response = JSON.parse(resp);
                    if (response.status === ResponseStatus.Success) {
                        callback({ data: response });
                    }
                    else if (response.status === ResponseStatus.Error) {
                        callback({ errorMessage: response.errorMessage });
                    }
                    else {
                        callback({ data: response });
                    }
                },
                error: function (a, b, c) {
                    //kapp.log.error(error);
                    callback({ errorMessage: "Network error" });
                }
            });
        }
        else {
            callback({ errorMessage: "Kh�ng c� k?t n?i internet!" });
        }
    };
    return KNetwork;
}());
//***********************************************************
var kapp = new (function () {
    function KApp() {
        this.isReady = false;
        this.log = new KLogger();
        this.utils = new KUtils();
        this.config = new KConfig();
        this.network = new KNetwork();
        this.db = new LocalStorageDB();
        this.context = new KContext();
        this.paramters = new KParamter();
    }
    return KApp;
}());
var app = kapp;

//# sourceMappingURL=startup.js.map
