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
        this.defaultMapZoom = 17;
        this.acceptedAccuracy = 150;
        this.acceptedDistance = 30;
        this.getLocationInterval = 30;
        this.enableGoogleService = true;
        this.syncInterval = 5 * 60;
        this.getAddressInterval = 5 * 60;
        this.googleKey = "AIzaSyCD_ZRcJdEcKM3PEAAYKj7Fmyg-Pv2G-HQ";
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
                this.pingInterval = app.utils.parseInt(value);
                break;
            case "requestTimeout":
                this.requestTimeout = app.utils.parseInt(value);
                break;
            case "enableMap":
                this.enableMap = app.utils.parseInt(value) == 1;
                break;
            case "enableGoogleService":
                this.enableGoogleService = app.utils.parseInt(value) == 1;
                break;
            case "defaultMapZoom":
                this.defaultMapZoom = app.utils.parseInt(value);
                break;
            case "acceptedAccuracy":
                this.acceptedAccuracy = app.utils.parseInt(value);
                break;
            case "acceptedDistance":
                this.acceptedDistance = app.utils.parseInt(value);
                break;
            case "acceptedDistance":
                this.acceptedDistance = app.utils.parseInt(value);
                break;
            case "googleKey":
                this.googleKey = value;
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
    KUtils.prototype.randomColor = function () {
        return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
    };
    KUtils.prototype.getCurrentDate = function () {
        var today = new Date();
        var t = today.getDate();
        var dd = t < 10 ? "0" + t.toString() : t.toString();
        t = today.getMonth() + 1;
        var mm = t < 10 ? "0" + t.toString() : t.toString();
        var yyyy = today.getFullYear().toString();
        return yyyy + "-" + mm + "-" + dd;
    };
    KUtils.prototype.getCurrentDateTime = function () {
        var today = new Date();
        var t = today.getDate();
        var day = t < 10 ? "0" + t.toString() : t.toString();
        t = today.getMonth() + 1;
        var month = t < 10 ? "0" + t.toString() : t.toString();
        var year = today.getFullYear().toString();
        t = today.getHours();
        var hour = t < 10 ? "0" + t.toString() : t.toString();
        t = today.getMinutes();
        var min = t < 10 ? "0" + t.toString() : t.toString();
        t = today.getSeconds();
        var second = t < 10 ? "0" + t.toString() : t.toString();
        return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second;
    };
    KUtils.prototype.getDistance = function (pointA, pointB) {
        var calculateRad = function (x) { return x * Math.PI / 180; };
        var R = 6378137; // Earth�s mean radius in meter
        var dLat = calculateRad(pointA.lat - pointB.lat);
        var dLong = calculateRad(pointA.lng - pointB.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(calculateRad(pointB.lat)) * Math.cos(calculateRad(pointA.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return Math.round(d * 100) / 100;
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
    KContext.prototype.setJournalGroups = function (journals, callback) {
        var journalGroups = [];
        var groupIndex = 1;
        for (var i = 0; i < journals.length; i++) {
            var journal = journals[i];
            var groupName = journal.status == JournalStatus.Started ? R.Running : journal.activeDate.replace(" 00:00:00", "");
            var foundGround = null;
            for (var j = 0; j < journalGroups.length; j++) {
                var group = journalGroups[j];
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
            foundGround.journals.push(journal);
        }
        this._journalGroups = journalGroups;
        callback();
    };
    KContext.prototype.getJournalGroups = function () {
        return this._journalGroups;
    };
    KContext.prototype.hasStartedJournal = function () {
        return this._startedGroup != null && this._startedGroup.journals.length > 0;
        //let len = this._journalGroups.length;
        //for (let i = 0; i < len; i++) {
        //    let group = this._journalGroups[i];
        //    if (group.isCurrent) {
        //        return group.journals.length > 0;
        //    }
        //}
        //return false;
    };
    KContext.prototype.getTruckId = function () {
        return (this.userContext != null && this.userContext.truck != null) ? this.userContext.truck.id : 0;
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
        this.allowStartJournal = false;
        this.nextState = null;
    };
    return KParamter;
}());
var KNetwork = (function () {
    function KNetwork() {
        this._isServerConnected = true;
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
            callback({ errorMessage: R.CannotConnectToServer });
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
    KNetwork.prototype.getJournals = function (http, ionicLoading, ionicPopup, callback) {
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
                var journals = [];
                for (var i = 0; i < result.rows.length; i++) {
                    journals.push(JSON.parse(result.rows.item(i).value));
                }
                app.context.setJournalGroups(journals, callback);
            });
        }
    };
    KNetwork.prototype.getSettings = function (http, callback) {
        app.serverAPI.post(http, "getSettings", { token: app.context.token, driverId: app.context.user.id }, callback);
    };
    KNetwork.prototype.submitActivity = function (http, request, important, callback) {
        var n = this;
        var sycnStatus = SyncStatus.Unsync;
        var errorMessage = null;
        var insertDbAction = function (r, s, c) {
            app.db.addActivity(request, sycnStatus, function (result) {
                callback(errorMessage);
            });
        };
        if (n.isReady()) {
            n.post(http, "addJournalActivity", request, function (response) {
                if (!app.utils.isEmpty(response.errorMessage)) {
                    if (important) {
                        callback(R.CannotConnectToServer);
                    }
                    else {
                        insertDbAction(request, sycnStatus, callback);
                    }
                }
                else {
                    sycnStatus = SyncStatus.Sync;
                    insertDbAction(request, sycnStatus, callback);
                }
            });
        }
        else {
            if (important)
                callback(R.NoNetwork);
            else
                insertDbAction(request, sycnStatus, callback);
        }
    };
    KNetwork.prototype.submitLocation = function (http, request, important, callback) {
        if (request.accuracy > app.config.acceptedAccuracy) {
            app.log.debug("Ignore (" + request.latitude.toString() + ", " + request.longitude.toString() + ", " + request.accuracy.toString() + ")");
            callback(R.LocationNotCorrect);
            return;
        }
        var n = this;
        var sycnStatus = SyncStatus.Unsync;
        var errorMessage = null;
        var insertDbAction = function (r, s, c) {
            app.db.addLocation(r, s, function (dbresult) {
                c(errorMessage);
            });
        };
        if (n.isReady()) {
            app.serverAPI.post(http, "addJournalLocation", request, function (response) {
                if (!app.utils.isEmpty(response.errorMessage)) {
                    if (important) {
                        callback(R.CannotConnectToServer);
                    }
                    else {
                        insertDbAction(request, sycnStatus, callback);
                    }
                }
                else {
                    sycnStatus = SyncStatus.Sync;
                    insertDbAction(request, sycnStatus, callback);
                }
            });
        }
        else {
            if (important)
                callback(R.NoNetwork);
            else
                insertDbAction(request, sycnStatus, callback);
        }
    };
    KNetwork.prototype.syncData = function (http, callback) {
        var n = this;
        if (n.isReady()) {
            var data_1 = {
                token: app.context.token,
                activities: [],
                locations: [],
            };
            var activityIds_1 = new Array();
            var locationIds_1 = new Array();
            var submitAction_1 = function (h, d, ar, lr, c) {
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
                                    }
                                    else {
                                        c(dbr.errorMessage);
                                    }
                                });
                            }
                            else {
                                c(dbr.errorMessage);
                            }
                        });
                    }
                    else {
                        c(r.errorMessage);
                    }
                });
            };
            app.db.getActivities(SyncStatus.Unsync, function (ar) {
                if (!app.utils.isEmpty(ar.errorMessage)) {
                    callback(ar.errorMessage);
                }
                else {
                    for (var i = 0; i < ar.rows.length; i++) {
                        var item = ar.rows.item(i);
                        var activity = JSON.parse(item.value);
                        ;
                        activityIds_1.push(item.id);
                        data_1.activities.push(activity);
                    }
                    app.db.getLocations(SyncStatus.Unsync, function (jr) {
                        if (!app.utils.isEmpty(jr.errorMessage)) {
                            callback(ar.errorMessage);
                        }
                        else {
                            for (var i = 0; i < jr.rows.length; i++) {
                                var item = jr.rows.item(i);
                                var location_1 = JSON.parse(item.value);
                                ;
                                locationIds_1.push(item.id);
                                data_1.locations.push(location_1);
                            }
                            submitAction_1(http, data_1, activityIds_1, locationIds_1, callback);
                        }
                    });
                }
            });
        }
        else {
            callback(R.NoNetwork);
        }
    };
    KNetwork.prototype._startSyncTimer = function () {
        var n = this;
        if (n._submitUnsyncDataFunction == undefined || n._submitUnsyncDataFunction == null)
            return;
        n._curentTimer = setTimeout(function () {
            if (n._submitUnsyncDataFunction !== null) {
                var queueNextSync_1 = function () { n._startSyncTimer(); };
                if (n.isReady()) {
                    var data_2 = {
                        token: app.context.token,
                        activities: [],
                        locations: [],
                    };
                    var activityIds_2 = new Array();
                    var locationIds_2 = new Array();
                    var submitFunction_1 = function (d, ar, lr) {
                        if (d.activities.length === 0 && d.locations.length === 0) {
                            queueNextSync_1();
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
                                            queueNextSync_1();
                                        });
                                    }
                                    else {
                                        app.log.error(dbr.errorMessage);
                                        queueNextSync_1();
                                    }
                                });
                            }
                            else
                                queueNextSync_1();
                        });
                    };
                    app.db.getActivities(SyncStatus.Unsync, function (ar) {
                        if (!app.utils.isEmpty(ar.errorMessage)) {
                            queueNextSync_1();
                        }
                        else {
                            for (var i = 0; i < ar.rows.length; i++) {
                                var item = ar.rows.item(i);
                                var activity = JSON.parse(item.value);
                                ;
                                activityIds_2.push(item.id);
                                data_2.activities.push(activity);
                            }
                            app.db.getLocations(SyncStatus.Unsync, function (jr) {
                                if (!app.utils.isEmpty(jr.errorMessage)) {
                                    queueNextSync_1();
                                }
                                else {
                                    for (var i = 0; i < jr.rows.length; i++) {
                                        var item = jr.rows.item(i);
                                        var location_2 = JSON.parse(item.value);
                                        ;
                                        locationIds_2.push(item.id);
                                        data_2.locations.push(location_2);
                                    }
                                    if (n._submitUnsyncDataFunction !== null)
                                        submitFunction_1(data_2, activityIds_2, locationIds_2);
                                }
                            });
                        }
                    });
                }
                else {
                    queueNextSync_1();
                }
            }
        }, app.config.syncInterval * 1000);
    };
    KNetwork.prototype.startSync = function (submitFunction) {
        this._submitUnsyncDataFunction = submitFunction;
        if (this._curentTimer !== undefined && this._curentTimer !== null) {
            clearTimeout(this._curentTimer);
        }
        this._startSyncTimer();
    };
    KNetwork.prototype.stopSync = function () {
        this._submitUnsyncDataFunction = null;
        if (this._curentTimer !== undefined && this._curentTimer !== null) {
            clearTimeout(this._curentTimer);
        }
    };
    KNetwork.prototype.getActivities = function (http, journalId, callback) {
        var n = this;
        if (n.isReady()) {
            n.post(http, "getJournalActivities", { token: app.context.token, journalId: journalId, }, function (result) {
                if (!app.utils.isEmpty(result.errorMessage)) {
                    callback(result.errorMessage, null);
                }
                else {
                    var activites = [];
                    for (var i = 0; i < result.data.items.length; i++) {
                        activites.push(result.data.items[i]);
                    }
                    callback(null, activites);
                }
            });
        }
        else {
            app.db.getJournalActivities(journalId, function (result) {
                var activites = [];
                for (var i = 0; i < result.rows.length; i++) {
                    var activity = JSON.parse(result.rows.item(i).value);
                    activites.push(activity);
                }
                callback(null, activites);
            });
        }
    };
    return KNetwork;
}());
var KMap = (function () {
    function KMap() {
        this.curAcc = 0;
        this.curLat = 0;
        this.curLng = 0;
        this.curMap = null;
    }
    KMap.prototype.createMap = function (elementId) {
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
            });
            return this.curMap;
        }
        catch (err) {
            app.log.error(err);
            return null;
        }
    };
    KMap.prototype.addCurrentLocation = function (map, ionicPopup) {
        if (map == undefined || map == null)
            return;
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
        i.style.marginTop = "2px";
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
                    }
                    else {
                        ionicPopup.alert({ title: R.Error, template: response.errorMessage, });
                    }
                });
            }
            else {
                map.setCenter({ lat: m.curLat, lng: m.curLng });
            }
        });
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(btn);
        var point = new google.maps.LatLng(m.curLat, m.curLng);
        var cradius = (this.curAcc > 500) ? 500 : m.curAcc;
        m.curLocationMarker = this.addMarker(map, point, null, "marker-truck.png");
        m.curAccCircle = new google.maps.Circle({
            center: point,
            radius: cradius,
            map: map,
            fillColor: '#2196F3',
            fillOpacity: 0.2,
            strokeOpacity: 0,
        });
    };
    KMap.prototype.addMarkerInLatLng = function (map, lat, lng, title, iconName) {
        if (map == undefined || map == null)
            return null;
        var iconUrl = "img/" + iconName;
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
    };
    KMap.prototype.addMarker = function (map, point, title, iconName) {
        if (map == undefined || map == null)
            return null;
        var iconUrl = "img/" + iconName;
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
    };
    KMap.prototype.calcRoute = function (directionsDisplay, startPoint, endPoint, callback) {
        var ms = this;
        try {
            if (ms.directionsService == null)
                ms.directionsService = new google.maps.DirectionsService();
            ms.directionsService.route({
                origin: startPoint,
                destination: endPoint,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    app.log.debug(response);
                    directionsDisplay.setDirections(response);
                    var totalDistance = 0;
                    var totalDuration = 0;
                    var legs = response.routes[0].legs;
                    for (var i = 0; i < legs.length; ++i) {
                        totalDistance += legs[i].distance.value;
                        totalDuration += legs[i].duration.value;
                    }
                    callback(null, totalDistance, totalDuration);
                }
                else {
                    callback(R.GoogleAPIError + status, 0, 0);
                }
            });
        }
        catch (err) {
            callback(err.message, 0, 0);
        }
    };
    KMap.prototype.getAddress = function (point, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: point, region: "vi" }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                app.log.debug(results);
                if (results[1]) {
                    callback(results[1].formatted_address);
                }
                else {
                    callback(null);
                }
            }
            else {
                app.log.error(R.GoogleAPIError + status);
                callback(null);
            }
        });
    };
    KMap.prototype.initialize = function () {
        //this.directionsService = new google.maps.DirectionsService();
    };
    KMap.prototype.getCurrentLocation = function (callback) {
        var m = this;
        try {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var acc = position.coords.accuracy;
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
                }
                else if (err.TIMEOUT) {
                    callback({ errorMessage: R.Timeout });
                }
                else if (err.POSITION_UNAVAILABLE) {
                    callback({ errorMessage: R.CannotGetLocation });
                }
                else {
                    callback({ errorMessage: err.message + ": " + err.code.toString() });
                }
            }, { maximumAge: 30000, timeout: 5000, enableHighAccuracy: true });
        }
        catch (err) {
            callback({ errorMessage: err.message });
        }
    };
    KMap.prototype._startGetLocationTimer = function () {
        var m = this;
        m._curentTimer = setTimeout(function () {
            if (m._submitLocation !== null) {
                m.getCurrentLocation(function (response) {
                    m._submitLocation(response.errorMessage, {
                        token: app.context.token,
                        createdTS: app.utils.getCurrentDateTime(),
                        stopCount: 0,
                        latitude: response.lat,
                        longitude: response.lng,
                        accuracy: response.acc,
                        journalId: app.paramters.journal.id,
                        driverId: app.context.user.id,
                        truckId: app.context.userContext.truck.id,
                    }, function () {
                        if (m._submitLocation !== null)
                            m._startGetLocationTimer();
                    });
                });
            }
        }, app.config.getLocationInterval * 1000);
    };
    KMap.prototype.startWatcher = function (submit) {
        var m = this;
        m._submitLocation = submit;
        if (m._curentTimer !== undefined && m._curentTimer !== null) {
            clearTimeout(m._curentTimer);
        }
        ;
        m.getCurrentLocation(function (response) {
            m._submitLocation(response.errorMessage, {
                token: app.context.token,
                createdTS: app.utils.getCurrentDateTime(),
                stopCount: 0,
                latitude: response.lat,
                longitude: response.lng,
                accuracy: response.acc,
                journalId: app.paramters.journal.id,
                driverId: app.context.user.id,
                truckId: app.context.userContext.truck.id,
            }, function () {
                m._startGetLocationTimer();
            });
        });
    };
    KMap.prototype.stopWatcher = function () {
        this._submitLocation = null;
        if (this._curentTimer !== undefined && this._curentTimer !== null) {
            clearTimeout(this._curentTimer);
        }
    };
    return KMap;
}());
//***********************************************************
var kapp = new (function () {
    function KApp() {
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
    return KApp;
}());
var app = kapp;
function initializeMap() {
    //
}

//# sourceMappingURL=startup.js.map
