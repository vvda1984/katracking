class KConfig {
    public enableDebug: boolean;
    public enableOffline: boolean;
    public protocol: string;
    public ipAddress: string;
    public port: string;
    public serviceName: string;
    public baseURL: string;
    public pingInterval: number;
    public requestTimeout: number;
    public enableMap: boolean;

    constructor() {
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

    public updateBaseURL(): void {
        let host = this.ipAddress;
        let subhost = '';
        let positionS = this.ipAddress.indexOf('/');
        if (positionS > 0) { //can't start with /
            host = this.ipAddress.substr(0, positionS);
            subhost = this.ipAddress.substr(positionS);
        }

        this.baseURL = this.protocol + '://' + host + ':' + this.port.toString() + subhost + '/' + this.serviceName;
        kapp.log.debug(this.baseURL);
    }

    public setValue(name: string, value: string) {
        switch (name) {
            case "protocol":
                this.protocol = value;
                break
            case "ipAddress":
                this.ipAddress = value;
                break
            case "port":
                this.port = value;
                break
            case "serviceName":
                this.serviceName = value;
                break
            case "pingInterval":
                this.pingInterval = parseInt(value);
                break
            case "requestTimeout":
                this.requestTimeout = parseInt(value);
                break
            case "enableMap":
                this.enableMap = parseInt(value) == 1;
                break
        }
    }
}

class KLogger {
    private _logSeverity: any;

    constructor() {
        this._logSeverity = 1;
    }

    private writeLog(str: any, level: LogSeverity): void {
        if (level == LogSeverity.Error) {
            console.error(str);
        } else if (level == LogSeverity.Info) {
            console.info(str);
        } else if (level == LogSeverity.Debug) {
            console.debug(str);
        } else {
            console.log(str);
        }
    }

    public info(str): void {
        if ((this._logSeverity & LogSeverity.Info) > 0)
            this.writeLog(str, LogSeverity.Info);
    }

    public debug(str): void {
        if ((this._logSeverity & LogSeverity.Debug) > 0)
            this.writeLog(str, LogSeverity.Debug);
    }

    public error(str): void {
        if ((this._logSeverity & LogSeverity.Error) > 0)
            this.writeLog(str, LogSeverity.Error);
    }   
}

class KUtils {
    constructor() {
    }

    public isEmpty(text): boolean {
        if (text == undefined) return true;
        if (text == null) return true;
        if (text == 'null') return true;
        return (!text || 0 === text.length);
    }

    public isNull(obj): boolean {
        if (obj == undefined) return true;
        if (obj == null) return true;
        return false;
    }

    public parseInt(str): number {
        try {
            return parseInt(str);
        }
        catch (ex) {
            return null;
        }
    }
}

class KContext {
    public user: IUser;
    public token: string;
    public userContext: any;
    public tag: any;
   
    constructor() {
        this.user = null;
        this.token = "";
        this.userContext = { truck: null };
    }

    public clear() {
        this.user = null;
        this.token = "";
        this.userContext = { truck: null };
        this.tag = null;
    }
}

class KParamter {
    public truck: any;
    public journal: any;
    public allowBack: boolean;
    public nextState : string;

    public clear(): void {
        this.truck = null;
        this.journal = null;
        this.allowBack = false;
        this.nextState = null;
    }
}

class KNetwork {
    private _isServerConnected: boolean;
    private _enablePing: boolean;
    private _pingAction: any;

    constructor() {
        this._isServerConnected = false;
        this._enablePing = false;
    } 

    public isReady(): boolean {
        return this.hasNetwork() && this._isServerConnected;
    }

    public hasNetwork() {
        if (kapp.config.enableOffline) return false;
     
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
            return (networkState !== Connection.NONE && networkState !== Connection.UNKNOWN)
        }
        catch (err) {
            return true;
        }
    }

    private doPing(): void {
        let _this = this;
        setTimeout(function () {
            if (_this._enablePing) {
                if (!kapp.utils.isNull(_this._pingAction)) {
                    _this._pingAction(function (result) {
                        _this._isServerConnected = result;
                        if (_this._enablePing) _this.doPing();
                    });
                }
                else
                    _this.doPing();
            }
        }, kapp.config.pingInterval * 1000);
    }

    public startPing(pingAction: any): void {
        if (!kapp.utils.isNull(pingAction)) {
            this._pingAction = pingAction;
        }

        if (!kapp.utils.isNull(this._pingAction)) {
            let _this = this;
            _this._enablePing = true;
            _this._pingAction(function (result) {
                _this._isServerConnected = result;
                if (_this._enablePing) _this.doPing();
            });
        }
    }

    public stopPing(): void {
        this._enablePing = false;
    }

    public post(http: angular.IHttpService, method: string, body: any, callback: (result: IPostResult) => any): void {
        if (this.hasNetwork()) {
            let url = kapp.config.baseURL + "/" + method;
            kapp.log.debug("Call api: " + url);
            http.post(url, JSON.stringify(body), { timeout: app.config.requestTimeout * 1000 })
                .success(function (response: IResponseData, status: number) {
                    kapp.log.debug("Response status: " + status.toString());
                    if (status == 200) {
                        kapp.log.debug(response);                        
                        if (response.status == ResponseStatus.Success) {
                            callback({ data: response });
                        } else if (response.status == ResponseStatus.Error) {
                            callback({ errorMessage: response.errorMessage });
                        } else {
                            callback({ data: response });
                        }
                    } else {
                        callback({ errorMessage: "Network error: " + status.toString() });
                    }
                })
                .error(function (error) {
                    kapp.log.error(error);
                    callback({ errorMessage: "Network: \n" + error });
                });
        }
        else {
            callback({ errorMessage: "Không có k?t n?i internet!" });
        }
    }

    public ajaxPost(method: string, body: any, callback: (result: IPostResult) => any): void {
        if (this.hasNetwork()) {
            let url = kapp.config.baseURL + "/" + method;
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
                    } else if (response.status === ResponseStatus.Error) {
                        callback({ errorMessage: response.errorMessage });
                    } else {
                        callback({ data: response });
                    }
                },
                error: function (a, b, c) {
                    //kapp.log.error(error);
                    callback({ errorMessage: "Network error"});
                }
            });
        }
        else {
            callback({ errorMessage: "Không có k?t n?i internet!" });
        }
    }
}

//***********************************************************
var kapp = new class KApp {
    public isReady: boolean;
    public log: KLogger;
    public db: IDatabaseAPI;
    public config: KConfig;
    public network: KNetwork;
    public utils: KUtils;
    public context: KContext;
    public paramters: KParamter;

    constructor() {
        this.isReady = false;
        this.log = new KLogger();
        this.utils = new KUtils();
        this.config = new KConfig();
        this.network = new KNetwork();
        this.db = new LocalStorageDB();    
        this.context = new KContext();   
        this.paramters = new KParamter();
    }

    //public initialize(): void {
    //    let _this = this;
    //    this.db.initialize(function (res) { _this.isReady = res; });
    //}
}
var app = kapp;
