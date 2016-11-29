//class JournalController {
//    public journal: any;
//    public R: any;
//    public map: any;
//    public allowViewMap: boolean;
//    constructor(private $ionicHistory: any) {
//        app.log.debug(this.$ionicHistory.viewHistory());
//        let jc = this;
//        //jc.message = "This is test message!";
//        jc.R = R;
//        jc.journal = kapp.paramters.journal;
//        jc.allowViewMap = true;
//        //if (jc.allowViewMap) {
//        //    jc.map = app.map.createMap("journalMap");
//        //}
//    }
//    public updateMessage(message: string, type: number): void {
//        $("#journalMessage").html(message);
//    }
//    public updateLocation(location: string): void {
//        $("#currentLocation").html(location);
//    }
//}
var JournalViewController = (function () {
    function JournalViewController($scope, $http, $ionicLoading, $ionicPopup, $ionicViewSwitcher, $state) {
        //app.log.debug(this.$ionicHistory.viewHistory());
        this.$scope = $scope;
        this.$http = $http;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicViewSwitcher = $ionicViewSwitcher;
        this.$state = $state;
        var jvc = this;
        jvc.R = R;
        jvc.journal = kapp.paramters.journal;
        jvc.allowStartJournal = kapp.paramters.allowStartJournal;
        jvc.map = app.mapAPI.createMap("journalViewMap");
        app.mapAPI.addCurrentLocation(jvc.map, this.$ionicPopup);
        var m = this.map;
        var j = this.journal;
        var points = [];
        var startPoint = new google.maps.LatLng(j.startLat, j.startLng);
        points.push(startPoint);
        app.mapAPI.addMarker(m, startPoint, R.Start + ": " + j.startLocation, "marker-start.png");
        //for (let i = 0; i < j.stopPoints.length; i++) {
        //    var s = j.stopPoints[i];
        //    let point = new google.maps.LatLng(s.latitude, s.longitude);
        //    points.push(point);
        //    app.mapAPI.addMarker(m, point, s.name, "marker-delivery.png");
        //}
        var endPoint = new google.maps.LatLng(j.endLat, j.endLng);
        points.push(endPoint);
        app.mapAPI.addMarker(m, endPoint, R.End + ": " + j.endLocation, "marker-end.png");
        this.renderRoute(points, 0, 0, 0, function () {
            var idle = google.maps.event.addListener(jvc.map, "idle", function (event) {
                google.maps.event.removeListener(idle);
                var b = new google.maps.LatLngBounds();
                for (var i = 0; i < points.length; i++) {
                    b.extend(points[i]);
                }
                b.getCenter();
                jvc.map.fitBounds(b);
            });
        });
    }
    JournalViewController.prototype.renderRoute = function (points, index, totalDistance, totalDuration, callback) {
        var jvc = this;
        if (index < points.length - 1) {
            var point1 = points[index];
            var point2 = points[index + 1];
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(jvc.map);
            directionsDisplay.setOptions({
                suppressMarkers: true,
            });
            app.mapAPI.calcRoute(directionsDisplay, point1, point2, function (errorMessage, di, du) {
                if (errorMessage == null) {
                    totalDistance += di;
                    totalDuration += du;
                    jvc.renderRoute(points, index + 1, totalDistance, totalDuration, callback);
                }
                else {
                    jvc.$ionicPopup.alert({ title: R.Error, template: errorMessage, });
                }
            });
        }
        else {
            jvc.journal.totalDistance = totalDistance;
            jvc.journal.totalDuration = totalDuration;
            $("#distance").html((jvc.journal.totalDistance / 1000).toString() + " km");
            $("#duration").html(Math.round(jvc.journal.totalDistance / 60).toString() + " phút");
            callback();
        }
    };
    JournalViewController.prototype.startJournal = function () {
        var ctrl = this;
        var confirmPopup = ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.PickUpJournal + "?", });
        confirmPopup.then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.mapAPI.getCurrentLocation(function (result) {
                    if (!app.utils.isEmpty(result.errorMessage)) {
                        ctrl.$ionicLoading.hide();
                        ctrl.$ionicPopup.alert({ title: R.Error, template: result.errorMessage, });
                    }
                    else {
                        app.serverAPI.submitActivity(ctrl.$http, {
                            activityId: JournalActivity.BatDauHanhTrinh,
                            journalId: ctrl.journal.id,
                            driverId: app.context.user.id,
                            truckId: app.context.getTruckId(),
                            activityDetail: "",
                            activityName: "Bắt Đầu Hành Trình",
                            createdTS: app.utils.getCurrentDateTime(),
                            extendedData: null,
                            token: app.context.token,
                        }, true, function (errorMessage) {
                            ctrl.$ionicLoading.hide();
                            if (app.utils.isEmpty(errorMessage)) {
                                app.mapAPI.curAccCircle = null;
                                app.mapAPI.curLocationMarker = null;
                                app.paramters.nextState = "mainScreen";
                                ctrl.$state.go('tab.dash');
                            }
                            else
                                ctrl.$ionicPopup.alert({ title: R.Error, template: errorMessage, });
                        });
                    }
                });
            }
        });
    };
    JournalViewController.prototype.goBack = function () {
        var cc = this;
        var nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        cc.$ionicViewSwitcher.nextDirection("back");
        cc.$state.go(nextState);
    };
    return JournalViewController;
}());
var JournalDashController = (function () {
    function JournalDashController($scope, $http, $ionicLoading, $ionicPopup, $ionicViewSwitcher, $state) {
        this.$scope = $scope;
        this.$http = $http;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicViewSwitcher = $ionicViewSwitcher;
        this.$state = $state;
        var ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        //app.network.submitActivity(
        //    ctrl.$http,
        //    {
        //        activityId: JournalActivity.TroLaiHanhTrinh,
        //        journalId: ctrl.journal.id,
        //        driverId: app.context.user.id,
        //        truckId: app.context.getTruckId(),
        //        activityDetail: "",
        //        activityName: "Trở Lại Hành Trình",
        //        createdTS: app.utils.getCurrentDateTime(),
        //        extendedData: null,
        //        token: app.context.token,
        //    },
        //    false,
        //    function (errorMessage) {
        //    });
        app.mapAPI.startWatcher(function (errorMessage, request, submitCompleted) {
            if (!app.utils.isEmpty(errorMessage)) {
                ctrl.updateLocation(R.CannotGetLocation);
                submitCompleted();
            }
            else {
                if (app.config.enableGoogleService) {
                    app.mapAPI.getAddress(new google.maps.LatLng(request.latitude, request.longitude), function (address) {
                        if (app.utils.isEmpty(address))
                            ctrl.updateLocation("Latitude: " + request.latitude.toString() + "  Longitude:" + request.longitude.toString());
                        else {
                            ctrl.updateLocation(address);
                            request.address = address;
                        }
                        app.serverAPI.submitLocation(ctrl.$http, request, false, function (errorMessage) {
                            if (!app.utils.isEmpty(errorMessage))
                                app.log.error(errorMessage);
                            submitCompleted();
                        });
                    });
                }
                else {
                    app.serverAPI.submitLocation(ctrl.$http, request, false, function (errorMessage) {
                        if (!app.utils.isEmpty(errorMessage))
                            app.log.error(errorMessage);
                        submitCompleted();
                    });
                }
            }
        });
    }
    JournalDashController.prototype.updateLocation = function (location) {
        $("#currentLocation").html(location);
    };
    JournalDashController.prototype.existJournal = function () {
        var ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(ctrl.$http, {
                    activityId: JournalActivity.ThoatHanhTrinh,
                    journalId: ctrl.journal.id,
                    driverId: app.context.user.id,
                    truckId: app.context.getTruckId(),
                    activityDetail: "",
                    activityName: "Thoát Hành Trình",
                    createdTS: app.utils.getCurrentDateTime(),
                    extendedData: null,
                    token: app.context.token,
                }, false, function (errorMessage) {
                    ctrl.$ionicLoading.hide();
                    app.mapAPI.stopWatcher();
                    ctrl.$state.go(app.paramters.nextState);
                });
            }
        });
    };
    JournalDashController.prototype.doActivity = function (activityId, activityAction, hasMessage) {
        var ctrl = this;
        if (!hasMessage) {
            ctrl.$ionicPopup.confirm({ title: R.Confirm, template: activityAction + "?", }).then(function (res) {
                if (res) {
                    ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                    app.serverAPI.submitActivity(ctrl.$http, {
                        activityId: activityId,
                        journalId: ctrl.journal.id,
                        driverId: app.context.user.id,
                        truckId: app.context.getTruckId(),
                        activityDetail: "",
                        activityName: activityAction,
                        createdTS: app.utils.getCurrentDateTime(),
                        extendedData: null,
                        token: app.context.token,
                    }, false, function (errorMessage) {
                        ctrl.$ionicLoading.hide();
                        if (!app.utils.isEmpty(errorMessage))
                            ctrl.$ionicPopup.alert({ title: R.Error, template: errorMessage, });
                    });
                }
            });
        }
        else {
            ctrl.$scope.data = { message: null };
            ctrl.$ionicPopup.show({
                template: '<input type="text" ng-model="data.message">',
                title: 'Gửi Thông Báo',
                subTitle: 'Nhập Thông báo',
                scope: ctrl.$scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!ctrl.$scope.data.message) {
                                //don't allow the user to close unless he enters message
                                e.preventDefault();
                            }
                            else {
                                return ctrl.$scope.data.message;
                            }
                        }
                    }
                ]
            }).then(function (message) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(ctrl.$http, {
                    activityId: activityId,
                    journalId: ctrl.journal.id,
                    driverId: app.context.user.id,
                    truckId: app.context.getTruckId(),
                    activityDetail: message,
                    activityName: activityAction,
                    createdTS: app.utils.getCurrentDate(),
                    extendedData: null,
                    token: app.context.token,
                }, false, function (errorMessage) {
                    ctrl.$ionicLoading.hide();
                    if (!app.utils.isEmpty(errorMessage))
                        ctrl.$ionicPopup.alert({ title: R.Error, template: errorMessage, });
                });
            });
        }
    };
    JournalDashController.prototype.endJournal = function () {
        var ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.EndJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(ctrl.$http, {
                    activityId: JournalActivity.KetThucHanhTrinh,
                    journalId: ctrl.journal.id,
                    driverId: app.context.user.id,
                    truckId: app.context.getTruckId(),
                    activityDetail: "Kết Thúc",
                    activityName: R.EndJournal,
                    createdTS: app.utils.getCurrentDateTime(),
                    extendedData: null,
                    token: app.context.token,
                }, false, function (errorMessage) {
                    ctrl.$ionicLoading.hide();
                    app.mapAPI.stopWatcher();
                    ctrl.$state.go(app.paramters.nextState);
                });
            }
        });
    };
    JournalDashController.prototype.goBack = function () {
        var ctrol = this;
        var nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        ctrol.$ionicViewSwitcher.nextDirection("back");
        ctrol.$state.go(nextState);
    };
    return JournalDashController;
}());
var JournalMapController = (function () {
    function JournalMapController($scope, $http, $ionicLoading, $ionicPopup, $ionicViewSwitcher, $state) {
        this.$scope = $scope;
        this.$http = $http;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicViewSwitcher = $ionicViewSwitcher;
        this.$state = $state;
        var ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        ctrl.map = app.mapAPI.createMap("journalViewMap");
        app.mapAPI.addCurrentLocation(ctrl.map, ctrl.$ionicPopup);
        var m = ctrl.map;
        var j = ctrl.journal;
        var points = [];
        var startPoint = new google.maps.LatLng(j.startLat, j.startLng);
        points.push(startPoint);
        app.mapAPI.addMarker(m, startPoint, R.Start + ": " + j.startLocation, "marker-start.png");
        var endPoint = new google.maps.LatLng(j.endLat, j.endLng);
        points.push(endPoint);
        app.mapAPI.addMarker(m, endPoint, R.End + ": " + j.endLocation, "marker-end.png");
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(m);
        directionsDisplay.setPanel(document.getElementById("dvPanel"));
        directionsDisplay.setOptions({ suppressMarkers: true });
        app.mapAPI.calcRoute(directionsDisplay, startPoint, endPoint, function (errorMessage, di, du) { });
        //var service = new google.maps.DistanceMatrixService();
        //service.getDistanceMatrix({
        //    origins: [startPoint],
        //    destinations: [endPoint],
        //    travelMode: google.maps.TravelMode.DRIVING,
        //    unitSystem: google.maps.UnitSystem.METRIC,
        //    avoidHighways: false,
        //    avoidTolls: false
        //}, function (response, status) {
        //    if (status == google.maps.DistanceMatrixStatus.OK &&
        //        response.rows[0].elements[0].status != google.maps.DistanceMatrixElementStatus.ZERO_RESULTS) {
        //        //var distance = response.rows[0].elements[0].distance.text;
        //        //var duration = response.rows[0].elements[0].duration.text;
        //        //var dvDistance = document.getElementById("dvDistance");
        //        //dvDistance.innerHTML = "";
        //        //dvDistance.innerHTML += "Distance: " + distance + "<br />";
        //        //dvDistance.innerHTML += "Duration:" + duration;
        //    } else {
        //        app.log.error("Unable to find the distance via road.");
        //    }
        //});
        var idle = google.maps.event.addListener(ctrl.map, "idle", function (event) {
            google.maps.event.removeListener(idle);
            if (app.mapAPI.curLat != 0) {
                ctrl.map.setCenter({ lat: app.mapAPI.curLat, lng: app.mapAPI.curLng });
            }
            else {
                var b = new google.maps.LatLngBounds();
                for (var i = 0; i < points.length; i++) {
                    b.extend(points[i]);
                }
                b.getCenter();
                ctrl.map.fitBounds(b);
            }
        });
    }
    JournalMapController.prototype.existJournal = function () {
        var ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(ctrl.$http, {
                    activityId: JournalActivity.ThoatHanhTrinh,
                    journalId: ctrl.journal.id,
                    driverId: app.context.user.id,
                    truckId: app.context.getTruckId(),
                    activityDetail: "",
                    activityName: "Thoát Hành Trình",
                    createdTS: app.utils.getCurrentDateTime(),
                    extendedData: null,
                    token: app.context.token,
                }, false, function (errorMessage) {
                    ctrl.$ionicLoading.hide();
                    app.mapAPI.stopWatcher();
                    ctrl.$state.go(app.paramters.nextState);
                });
            }
        });
    };
    JournalMapController.prototype.goBack = function () {
        var ctrol = this;
        var nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        ctrol.$ionicViewSwitcher.nextDirection("back");
        ctrol.$state.go(nextState);
    };
    return JournalMapController;
}());
var JournalActivityController = (function () {
    function JournalActivityController($scope, $http, $ionicLoading, $ionicPopup, $ionicViewSwitcher, $state) {
        this.$scope = $scope;
        this.$http = $http;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicViewSwitcher = $ionicViewSwitcher;
        this.$state = $state;
        this.data = { activities: [] };
        var ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        ctrl._queryActivities = function () {
            app.serverAPI.getActivities(ctrl.$http, ctrl.journal.id, function (errorMessage, items) {
                if (!app.utils.isEmpty(errorMessage))
                    ctrl.$ionicPopup.alert({ title: R.Error, template: errorMessage, });
                else
                    ctrl.data.activities = items;
            });
        };
        ctrl._queryActivities();
    }
    JournalActivityController.prototype.existJournal = function () {
        var ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(ctrl.$http, {
                    activityId: JournalActivity.ThoatHanhTrinh,
                    journalId: ctrl.journal.id,
                    driverId: app.context.user.id,
                    truckId: app.context.getTruckId(),
                    activityDetail: "",
                    activityName: "Thoát Hành Trình",
                    createdTS: app.utils.getCurrentDateTime(),
                    extendedData: null,
                    token: app.context.token,
                }, false, function (errorMessage) {
                    ctrl.$ionicLoading.hide();
                    app.mapAPI.stopWatcher();
                    ctrl.$state.go(app.paramters.nextState);
                });
            }
        });
    };
    JournalActivityController.prototype.refresh = function () {
        var ctrl = this;
        ctrl._queryActivities();
    };
    JournalActivityController.prototype.goBack = function () {
        var ctrol = this;
        var nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        ctrol.$ionicViewSwitcher.nextDirection("back");
        ctrol.$state.go(nextState);
    };
    return JournalActivityController;
}());

//# sourceMappingURL=ctrl.journal.js.map
