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
    public defaultMapZoom: number;
    public acceptedAccuracy: number;
    public acceptedDistance: number;
    public getLocationInterval: number;
    public enableGoogleService: boolean;
    public getAddressInterval: number;
    public syncInterval: number;
    public googleKey: string;

    constructor() {
        this.enableDebug = false;
        this.enableOffline = false;
        this.protocol = "http";
        this.ipAddress = "localhost/kas-test";
        this.port = "80";
        this.serviceName = "KAService.svc";
        this.baseURL = "http://localhost:80/kas-test/KAService.svc";

        this.pingInterval = 3;
        this.requestTimeout = 30;
        this.enableMap = true;
        this.defaultMapZoom = 17;
        this.acceptedAccuracy = 150;
        this.acceptedDistance = 30;
        this.getLocationInterval = 30;
        this.enableGoogleService = true;
        this.syncInterval = 5 * 60;
        this.getAddressInterval = 5 * 60;
        this.googleKey = "AIzaSyCD_ZRcJdEcKM3PEAAYKj7Fmyg-Pv2G-HQ";
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
                this.pingInterval = app.utils.parseInt(value);
                break
            case "requestTimeout":
                this.requestTimeout = app.utils.parseInt(value);
                break
            case "enableMap":
                this.enableMap = app.utils.parseInt(value) == 1;
                break
            case "enableGoogleService":
                this.enableGoogleService = app.utils.parseInt(value) == 1;
                break
            case "defaultMapZoom":
                this.defaultMapZoom = app.utils.parseInt(value);
                break
            case "acceptedAccuracy":
                this.acceptedAccuracy = app.utils.parseInt(value);
                break
            case "acceptedDistance":
                this.acceptedDistance = app.utils.parseInt(value);
                break
            case "acceptedDistance":
                this.acceptedDistance = app.utils.parseInt(value);
                break
            case "googleKey":
                this.googleKey = value;
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

    public randomColor() : string {
        return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
    }

    public getCurrentDate() : string {
        let today = new Date();      
        let t = today.getDate();
        let dd = t < 10 ? "0" + t.toString() : t.toString();
        t = today.getMonth() + 1;
        let mm = t < 10 ? "0" + t.toString() : t.toString();
        let yyyy = today.getFullYear().toString();
        return yyyy + "-" + mm + "-" + dd;
    }

    public getCurrentDateTime(): string {
        let today = new Date();

        let t = today.getDate();
        let day = t < 10 ? "0" + t.toString() : t.toString();
        t = today.getMonth() + 1;
        let month = t < 10 ? "0" + t.toString() : t.toString();
        let year = today.getFullYear().toString();

        t = today.getHours();
        let hour = t < 10 ? "0" + t.toString() : t.toString();

        t = today.getMinutes();
        let min = t < 10 ? "0" + t.toString() : t.toString();

        t = today.getSeconds();
        let second = t < 10 ? "0" + t.toString() : t.toString();

        return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second;
    }

    public getDistance(pointA: IPoint, pointB: IPoint): number {
        let calculateRad = function (x) { return x * Math.PI / 180 };
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = calculateRad(pointA.lat - pointB.lat);
        var dLong = calculateRad(pointA.lng - pointB.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(calculateRad(pointB.lat)) * Math.cos(calculateRad(pointA.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return Math.round(d * 100) / 100;
    }

    public replace(search:string, replacement: string): string {
        let reg = new RegExp("g");
        return search.replace(reg, replacement);
    }
}

class KContext {
    public DB_JOURNAL_TBL: string;
    public DB_JOURNAL_STOPPOINTS_TBL: string;
    public DB_JOURNAL_ACTIVITIES_TBL: string;
    public DB_JOURNAL_LOCATIONS_TBL: string;
    public user: IUser;
    public token: string;
    
    public userContext: any;
    public tag: any;

    private _journalGroups: Array<any>;
    private _startedGroup: any;

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

    public setJournalGroups(journals: Array<any>, callback: any) {
        let journalGroups = [];
        let groupIndex = 1;
        this._startedGroup = null;
        for (let i = 0; i < journals.length; i++) {
            let journal = journals[i];
            let groupName = journal.status == JournalStatus.Started ? R.Running : journal.activeDate.replace(" 00:00:00", "");
            
            let foundGround = null;
            for (let j = 0; j < journalGroups.length; j++) {
                let group = journalGroups[j];
                if (group.name === groupName) {
                    foundGround = group;
                    break;
                }
            }

            if (foundGround === null) {
                foundGround = {
                    id: groupIndex++,
                    name: groupName,
                    isCurrent: journal.status == JournalStatus.Started,
                    journals: []
                };
                journalGroups.push(foundGround);
                if (foundGround.isCurrent)
                    this._startedGroup = foundGround;
            }
            foundGround.journals.push(journal)
        }

        this._journalGroups = journalGroups;
        callback();
    }

    public getJournalGroups() {
        return this._journalGroups;
    }

    public hasStartedJournal(): boolean {        
        return this._startedGroup != null && this._startedGroup.journals.length > 0;
        //let len = this._journalGroups.length;
        //for (let i = 0; i < len; i++) {
        //    let group = this._journalGroups[i];
        //    if (group.isCurrent) {
        //        return group.journals.length > 0;
        //    }
        //}
        //return false;
    }

    public getTruckId(): number {
        return (this.userContext != null && this.userContext.truck != null) ? this.userContext.truck.id : 0;
    }

}

class KParamter {
    public truck: any;
    public journal: any;
    public allowBack: boolean;
    public allowStartJournal: boolean;
    public nextState: string;
    
    public clear(): void {
        this.truck = null;
        this.journal = null;
        this.allowBack = false;
        this.allowStartJournal = false;
        this.nextState = null;
    }
}

class KNetwork {
    private _isServerConnected: boolean;
    private _enablePing: boolean;
    private _pingAction: any;
    private _curentTimer: any;
    private _submitUnsyncDataFunction: (data: any, callback: (errorMessage: string) => any) => any;

    constructor() {
        this._isServerConnected = true;
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
            callback({ errorMessage: R.CannotConnectToServer });
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

    public getJournals(http: angular.IHttpService, ionicLoading: any, ionicPopup : any, callback:any) {       
        ionicLoading.show({ template: R.Loading, noBackdrop: false, });
        if (app.serverAPI.isReady()) {
            app.serverAPI.post(http, "getDriverJournals", { token: app.context.token, driverId: app.context.user.id }, function (result) {
                ionicLoading.hide();
                if (app.utils.isEmpty(result.errorMessage)) {
                    app.context.setJournalGroups(result.data.items, callback);
                }
                else {
                    ionicPopup.alert({ title: R.Error, template: result.errorMessage, });
                }
            });
        }
        else {
            app.db.getJournals(function (result) {
                ionicLoading.hide();
                let journals = [];
                for (let i = 0; i < result.rows.length; i++) {
                    journals.push(JSON.parse(result.rows.item(i).value));
                }
                app.context.setJournalGroups(journals, callback);
            });
        }
    }

    public getSettings(http: angular.IHttpService, callback: (result: IPostResult) => any) {
        app.serverAPI.post(http, "getSettings", { token: app.context.token, driverId: app.context.user.id }, callback);
    }

    public submitActivity(http: angular.IHttpService, request: IJournalActivity, important: boolean, callback: (errorMessage: string) => any) {        
        let n = this;
        let sycnStatus = SyncStatus.Unsync;
        let errorMessage = null;

        let insertDbAction = function (r, s, c) {
            app.db.addActivity(request, sycnStatus, function (result) {
                callback(errorMessage);
            });
        };

        if (n.isReady()) {
            n.post(http, "addJournalActivity", request, function (response) {
                if (!app.utils.isEmpty(response.errorMessage)) {
                    if (important) {
                        callback(R.CannotConnectToServer);
                    } else {
                        insertDbAction(request, sycnStatus, callback);
                    }
                } else {
                    sycnStatus = SyncStatus.Sync;
                    insertDbAction(request, sycnStatus, callback);
                }
            });
        } else {
            if (important)
                callback(R.NoNetwork);
            else
                insertDbAction(request, sycnStatus, callback);
        }
    }

    public submitLocation(http: angular.IHttpService, request: IJournalLocation, important: boolean, callback: (errorMessage: string) => any) {
        if (request.accuracy > app.config.acceptedAccuracy) {
            app.log.debug("Ignore (" + request.latitude.toString() + ", " + request.longitude.toString() + ", " + request.accuracy.toString() + ")");
            callback(R.LocationNotCorrect);
            return;
        }

        let n = this;
        let sycnStatus = SyncStatus.Unsync;
        let errorMessage = null;

        let insertDbAction = function (r, s, c) {
            app.db.addLocation(r, s, function (dbresult) {
                c(errorMessage);
            });
        };
        
        if (n.isReady()) {
            app.serverAPI.post(http, "addJournalLocation", request, function (response) {
                if (!app.utils.isEmpty(response.errorMessage)) {
                    if (important) {
                        callback(R.CannotConnectToServer);
                    } else {
                        insertDbAction(request, sycnStatus, callback);
                    }
                } else {
                    sycnStatus = SyncStatus.Sync;
                    insertDbAction(request, sycnStatus, callback);
                }
            })
        } else {
            if (important)
                callback(R.NoNetwork);
            else
                insertDbAction(request, sycnStatus, callback);
        }
    }

    public syncData(http: angular.IHttpService, callback: (errorMessage: string) => any) {
        let n = this;
        if (n.isReady()) {
            let data = {
                token: app.context.token,
                activities: [],
                locations: [],
            };
            let activityIds = new Array<number>();
            let locationIds = new Array<number>();

            let submitAction = function (h, d, ar, lr, c) {
                if (d.activities.length === 0 && d.locations.length === 0) {
                    c(null);
                    return;
                }
                n.post(h, "syncJournal", d, function (r) {
                    if (app.utils.isEmpty(r.errorMessage)) {
                        app.db.updateActivitiesStatus(ar, SyncStatus.Sync, function (dbr) {
                            if (app.utils.isEmpty(dbr.errorMessage)) {
                                app.db.updateLocationsStatus(lr, SyncStatus.Sync, function (dbr) {
                                    if (app.utils.isEmpty(dbr.errorMessage)) {
                                        c(null);
                                    } else {
                                        c(dbr.errorMessage);
                                    }
                                });
                            } else {
                                c(dbr.errorMessage);
                            }
                        });
                    } else {
                        c(r.errorMessage);
                    }
                });
            }

            app.db.getActivities(SyncStatus.Unsync, function (ar) {
                if (!app.utils.isEmpty(ar.errorMessage)) {
                    callback(ar.errorMessage);
                } else {
                    for (let i = 0; i < ar.rows.length; i++) {
                        let item = ar.rows.item(i);
                        let activity = JSON.parse(item.value);;
                        activityIds.push(item.id);
                        data.activities.push(activity);
                    }

                    app.db.getLocations(SyncStatus.Unsync, function (jr) {
                        if (!app.utils.isEmpty(jr.errorMessage)) {
                            callback(ar.errorMessage);
                        } else {
                            for (let i = 0; i < jr.rows.length; i++) {
                                let item = jr.rows.item(i);
                                let location = JSON.parse(item.value);;
                                locationIds.push(item.id);
                                data.locations.push(location);
                            }
                            submitAction(http, data, activityIds, locationIds, callback);
                        }
                    });
                }
            });
        } else {
            callback(R.NoNetwork);
        }
    }

    private _startSyncTimer(): void {
        let n = this;
        if (n._submitUnsyncDataFunction == undefined || n._submitUnsyncDataFunction == null) return;
        n._curentTimer = setTimeout(function () {
            if (n._submitUnsyncDataFunction !== null) {
                let queueNextSync = function () { n._startSyncTimer(); };
                if (n.isReady()) {
                    let data = {
                        token: app.context.token,
                        activities: [],
                        locations: [],
                    };
                    let activityIds = new Array<number>();
                    let locationIds = new Array<number>();

                    let submitFunction = function (d, ar, lr) {
                        if (d.activities.length === 0 && d.locations.length === 0) {
                            queueNextSync();
                            return;
                        }
                        n._submitUnsyncDataFunction(d, function (errorMessage) {
                            app.log.error(errorMessage);
                            if (app.utils.isEmpty(errorMessage)) {
                                app.db.updateActivitiesStatus(ar, SyncStatus.Sync, function (dbr) {
                                    if (app.utils.isEmpty(dbr.errorMessage)) {
                                        app.db.updateLocationsStatus(lr, SyncStatus.Sync, function (dbr) {
                                            if (!app.utils.isEmpty(dbr.errorMessage)) {
                                                app.log.error(dbr.errorMessage);
                                            }
                                            queueNextSync();
                                        });
                                    } else {
                                        app.log.error(dbr.errorMessage);
                                        queueNextSync();
                                    }
                                });
                            }
                            else
                                queueNextSync();
                        });
                    }

                    app.db.getActivities(SyncStatus.Unsync, function (ar) {
                        if (!app.utils.isEmpty(ar.errorMessage)) {
                            queueNextSync();
                        } else {
                            for (let i = 0; i < ar.rows.length; i++) {
                                let item = ar.rows.item(i);
                                let activity = JSON.parse(item.value);;
                                activityIds.push(item.id);
                                data.activities.push(activity);
                            }

                            app.db.getLocations(SyncStatus.Unsync, function (jr) {
                                if (!app.utils.isEmpty(jr.errorMessage)) {
                                    queueNextSync();
                                } else {
                                    for (let i = 0; i < jr.rows.length; i++) {
                                        let item = jr.rows.item(i);
                                        let location = JSON.parse(item.value);;
                                        locationIds.push(item.id);
                                        data.locations.push(location);
                                    }
                                    if (n._submitUnsyncDataFunction !== null)
                                        submitFunction(data, activityIds, locationIds);
                                }
                            });
                        }
                    });
                } else {
                    queueNextSync();
                }
            }
        }, app.config.syncInterval * 1000);
    }

    public startSync(submitFunction: (data: any, callback: (errorMessage: string) => any) => any) {
        this._submitUnsyncDataFunction = submitFunction;
        if (this._curentTimer !== undefined && this._curentTimer !== null) {
            clearTimeout(this._curentTimer);
        }
        this._startSyncTimer();
    }

    public stopSync() {
        this._submitUnsyncDataFunction = null;
        if (this._curentTimer !== undefined && this._curentTimer !== null) {
            clearTimeout(this._curentTimer);
        }
    }

    public getActivities(http: angular.IHttpService, journalId:number, callback: (errorMessage: string, items: Array<any>)=>any) {
        let n = this;
        if (n.isReady()) {
            n.post(http, "getJournalActivities", { token: app.context.token, journalId: journalId, }, function (result) {
                if (!app.utils.isEmpty(result.errorMessage)) {
                    callback(result.errorMessage, null);
                } else {
                    let activites = [];
                    for (let i = 0; i < result.data.items.length; i++) {
                        activites.push(result.data.items[i]);
                    }
                    callback(null, activites);
                }
            });
        }
        else {
            app.db.getJournalActivities(journalId, function (result) {
                let activites = [];
                for (let i = 0; i < result.rows.length; i++) {
                    let activity = JSON.parse(result.rows.item(i).value);
                    activites.push(activity);
                }
                callback(null, activites);
            });
        }
    }
}

class KMap {
    public directionsService: google.maps.DirectionsService;
    public curLat: number;
    public curLng: number;
    public curAcc: number;
    public curAccCircle: google.maps.Circle;
    public curLocationMarker: google.maps.Marker;
    public curMap: google.maps.Map;

    private _submitLocation: (errorMessage: string, response: IJournalLocation, callback: any) => any;
    private _curentTimer: any;
    private _watchLocationFunction: any;

    constructor() {
        this.curAcc = 0;
        this.curLat = 0;
        this.curLng = 0;
        this.curMap = null;
    }

    public createMap(elementId: string): any {
        this.curAccCircle = null;
        this.curLocationMarker = null;
        try {
            this.curMap = new google.maps.Map(document.getElementById(elementId), {
                zoom: app.config.defaultMapZoom,
                center: { lat: this.curLat, lng: this.curLng },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: false,
                //zoomControlOptions: {
                //    position: google.maps.ControlPosition.RIGHT_BOTTOM
                //},
                mapTypeControl: false,
                //mapTypeControlOptions: {
                //    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                //    position: google.maps.ControlPosition.BOTTOM_LEFT //BOTTOM_CENTER
                //},
                scaleControl: false,
                streetViewControl: false,
                //streetViewControlOptions: {
                //    position: google.maps.ControlPosition.RIGHT_BOTTOM
                //},
                //fullscreenControl: false,
            });
            return this.curMap;
        } catch (err) {
            app.log.error(err);
            return null;
        }
    }

    public addCurrentLocation(map: google.maps.Map, ionicPopup: any) {
        if (map == undefined || map == null) return;

        var m = this;
        var btn = document.createElement("div");
        btn.className = "item";      
        btn.style.padding = "0px";
        btn.style.border = "none";
        //btn.style.borderRadius = "16px";
        btn.style.marginRight = "4px";
        btn.style.width = "32px";
        btn.style.height = "32px";
        btn.style.textAlign = "center";
        btn.style.background = "transparent";
        var i = document.createElement("img");
        i.src = "img/cur-location.png";
        i.style.width = "28px";
        i.style.height = "28px";
        i.style.marginTop="2px";
        btn.appendChild(i);        

        //var btn = document.createElement("i");
        //btn.className = "icon ion-android-locate";
        //btn.style.width = "32px";
        //btn.style.height = "32px";
        //btn.style.marginRight = "4px";
       
        btn.addEventListener("click", function () {
            if (m.curLat === undefined || m.curLat === 0) {
                m.getCurrentLocation(function (response) {
                    if (app.utils.isEmpty(response.errorMessage)) {
                        map.setCenter({ lat: m.curLat, lng: m.curLng });
                    } else {
                        ionicPopup.alert({ title: R.Error, template: response.errorMessage, });
                    }
                });
            } else {
                map.setCenter({ lat: m.curLat, lng: m.curLng });
            }            
        });
        
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(btn);      

        var point = new google.maps.LatLng(m.curLat, m.curLng);
        var cradius = (this.curAcc > 500) ? 500 : m.curAcc;
        m.curLocationMarker = this.addMarker(map, point , null, "marker-truck.png");
        m.curAccCircle = new google.maps.Circle({
            center: point,
            radius: cradius,
            map: map,
            fillColor: '#2196F3',
            fillOpacity: 0.2,
            strokeOpacity: 0,
        });
    }

    public addMarkerInLatLng(map: google.maps.Map, lat: number, lng: number, title: string, iconName: string): google.maps.Marker {       
        if (map == undefined || map == null) return null;

        let iconUrl = "img/" + iconName;
        var marker = new google.maps.Marker();
        marker.setPosition(new google.maps.LatLng(lat, lng));        
        marker.setMap(map);
        marker.setIcon(iconUrl);
        if (title !== null) {
            marker.setTitle(title);
            marker.addListener("click", function () {
                var infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(title);
                infoWindow.open(map, marker);
            });
        }

        return marker;
    }

    public addMarker(map: google.maps.Map, point: google.maps.LatLng, title: string, iconName: string): google.maps.Marker {
        if (map == undefined || map == null) return null;

        let iconUrl = "img/" + iconName;
        var marker = new google.maps.Marker();        
        marker.setPosition(point);       
        marker.setMap(map);
        marker.setIcon(iconUrl);
        if (title !== null) {
            marker.setTitle(title);
            marker.addListener("click", function () {
                var infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(title);
                infoWindow.open(map, marker);
            });
        }

        return marker;
    }

    public calcRoute(directionsDisplay: google.maps.DirectionsRenderer, startPoint: google.maps.LatLng, endPoint: google.maps.LatLng, callback: any): any {
        var ms = this;
        try {
            if (ms.directionsService == null)
                ms.directionsService = new google.maps.DirectionsService();
            ms.directionsService.route(
                {
                    origin: startPoint,
                    destination: endPoint,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        app.log.debug(response);
                        directionsDisplay.setDirections(response);

                        let totalDistance = 0;
                        let totalDuration = 0;
                        let legs = response.routes[0].legs;
                        for (var i = 0; i < legs.length; ++i) {
                            totalDistance += legs[i].distance.value;
                            totalDuration += legs[i].duration.value;
                        }
                        callback(null, totalDistance, totalDuration);
                    } else {
                        callback(R.GoogleAPIError + status, 0, 0);
                    }
                });
        }
        catch (err) {
            callback(err.message, 0, 0);
        }
    }

    public getAddress(point: google.maps.LatLng, callback: (address: string) => any) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: point, region: "vi" }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                app.log.debug(results);
                if (results[1]) {
                    callback(results[1].formatted_address);
                } else {
                    callback(null);
                }
            } else {
                app.log.error(R.GoogleAPIError + status);
                callback(null);
            }
        });
    }

    public initialize() : void {
        //this.directionsService = new google.maps.DirectionsService();
    }

    public getCurrentLocation(callback: (response: IGetLocationResponse) => any): void {
        let m = this;
        try {
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                let acc = position.coords.accuracy;

                m.curLat = lat;
                m.curLng = lng;
                m.curAcc = acc;
                if (m.curLocationMarker !== null) {
                    m.curLocationMarker.setPosition({ lat: lat, lng: lng });
                    if (m.curAccCircle !== null) {
                        m.curAccCircle.setRadius(acc > 500 ? 500 : acc);
                        m.curAccCircle.setCenter({ lat: lat, lng: lng });
                    }
                    if (m.curMap != null) {
                        m.curMap.setCenter({ lat: lat, lng: lng });
                    }
                }

                callback({ lat: lat, lng: lng, acc: acc });
            }, function (err) {
                if (err.PERMISSION_DENIED) {
                    callback({ errorMessage: R.NoGPSPermission });
                } else if (err.TIMEOUT) {
                    callback({ errorMessage: R.Timeout });
                } else if (err.POSITION_UNAVAILABLE) {
                    callback({ errorMessage: R.CannotGetLocation });
                } else {
                    callback({ errorMessage: err.message + ": " + err.code.toString() });
                }
            }, { maximumAge: 30000, timeout: 5000, enableHighAccuracy: true });
        } catch (err) {
            callback({ errorMessage: err.message });
        }
    }

    private _startGetLocationTimer(): void {
        var m = this;
        m._curentTimer = setTimeout(function () {
            if (m._submitLocation !== null) {
                m.getCurrentLocation(function (response) {
                    m._submitLocation(
                        response.errorMessage,
                        {
                            token: app.context.token,
                            createdTS: app.utils.getCurrentDateTime(),
                            stopCount: 0,
                            latitude: response.lat,
                            longitude: response.lng,
                            accuracy: response.acc,
                            journalId: app.paramters.journal.id,
                            driverId: app.context.user.id,
                            truckId: app.context.userContext.truck.id,
                        },
                        function () {
                            if (m._submitLocation !== null)
                                m._startGetLocationTimer();
                        });
                });
            }
        }, app.config.getLocationInterval * 1000);
    }

    public startWatcher(submit: (errorMessage: string, request: IJournalLocation, submitCompleted: any) => any) {
        var m = this;
        m._submitLocation = submit;
        if (m._curentTimer !== undefined && m._curentTimer !== null) {
            clearTimeout(m._curentTimer);
        };

        m.getCurrentLocation(function (response) {
            m._submitLocation(
                response.errorMessage,
                {
                    token: app.context.token,
                    createdTS: app.utils.getCurrentDateTime(),
                    stopCount: 0,
                    latitude: response.lat,
                    longitude: response.lng,
                    accuracy: response.acc,
                    journalId: app.paramters.journal.id,
                    driverId: app.context.user.id,
                    truckId: app.context.userContext.truck.id,  
                },
                function () {
                    m._startGetLocationTimer();
                });
        });
    }

    public stopWatcher() {
        this._submitLocation = null;
        if (this._curentTimer !== undefined && this._curentTimer !== null) {
            clearTimeout(this._curentTimer);
        }
    }
}

//***********************************************************
var kapp = new class KApp {
    public isReady: boolean;
    public log: KLogger;
    public db: IDatabaseAPI;
    public config: KConfig;
    public serverAPI: KNetwork;
    public utils: KUtils;
    public context: KContext;
    public mapAPI: KMap;
    public paramters: KParamter;

    constructor() {
        this.isReady = false;
        this.log = new KLogger();
        this.utils = new KUtils();
        this.config = new KConfig();
        this.serverAPI = new KNetwork();
        this.db = new LocalStorageDB();    
        this.context = new KContext();   
        this.mapAPI = new KMap;
        this.paramters = new KParamter();
    }

    //public initialize(): void {
    //    let _this = this;
    //    this.db.initialize(function (res) { _this.isReady = res; });
    //}
}
var app = kapp;

function initializeMap() {
    //
}