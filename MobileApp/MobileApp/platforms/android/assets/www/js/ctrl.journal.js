var JournalController = (function () {
    function JournalController($ionicHistory) {
        this.$ionicHistory = $ionicHistory;
        app.log.debug(this.$ionicHistory.viewHistory());
        var jc = this;
        //jc.message = "This is test message!";
        jc.R = R;
        jc.journal = kapp.paramters.journal;
        jc.allowViewMap = true;
        //if (jc.allowViewMap) {
        //    jc.map = app.map.createMap("journalMap");
        //}
    }
    JournalController.prototype.updateMessage = function (message, type) {
        $("#journalMessage").html(message);
    };
    JournalController.prototype.updateLocation = function (location) {
        $("#currentLocation").html(location);
    };
    return JournalController;
}());
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
        jvc.map = app.map.createMap("journalViewMap");
        app.map.addCurrentLocation(jvc.map, this.$ionicPopup);
        var m = this.map;
        var j = this.journal;
        var points = [];
        var startPoint = new google.maps.LatLng(j.startLat, j.startLng);
        points.push(startPoint);
        app.map.addMarker(m, startPoint, R.Start + ": " + j.startLocation, "marker-start.png");
        for (var i = 0; i < j.stopPoints.length; i++) {
            var s = j.stopPoints[i];
            var point = new google.maps.LatLng(s.latitude, s.longitude);
            points.push(point);
            app.map.addMarker(m, point, s.name, "marker-delivery.png");
        }
        var endPoint = new google.maps.LatLng(j.endLat, j.endLng);
        points.push(endPoint);
        app.map.addMarker(m, endPoint, R.End + ": " + j.endLocation, "marker-end.png");
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
                polylineOptions: {
                    strokeWeight: 4,
                    strokeOpacity: 1,
                    strokeColor: app.utils.randomColor(),
                }
            });
            app.map.calcRoute(directionsDisplay, point1, point2, function (errorMessage, di, du) {
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
                app.map.getCurrentLocation(function (result) {
                    if (!app.utils.isEmpty(result.errorMessage)) {
                        ctrl.$ionicLoading.hide();
                        ctrl.$ionicPopup.alert({ title: R.Error, template: result.errorMessage, });
                    }
                    else {
                        app.network.submitActivity(ctrl.$http, {
                            activityId: JournalActivity.BatDauHanhTrinh,
                            journalId: ctrl.journal.id,
                            driverId: app.context.user.id,
                            truckId: app.context.getTruckId(),
                            activityDetail: "",
                            activityName: "BatDauHanhTrinh",
                            createdTS: app.utils.getCurrentDateTime(),
                            extendedData: null,
                            token: app.context.token,
                        }, true, function (errorMessage) {
                            ctrl.$ionicLoading.hide();
                            if (app.utils.isEmpty(errorMessage)) {
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
        app.map.curAccCircle = null;
        app.map.curLocationMarker = null;
        app.network.submitActivity(ctrl.$http, {
            activityId: JournalActivity.TroLaiHanhTrinh,
            journalId: ctrl.journal.id,
            driverId: app.context.user.id,
            truckId: app.context.getTruckId(),
            activityDetail: "",
            activityName: "Trở Lại Hành Trình",
            createdTS: app.utils.getCurrentDateTime(),
            extendedData: null,
            token: app.context.token,
        }, false, function (errorMessage) {
        });
        app.map.startWatcher(function (errorMessage, request, submitCompleted) {
            if (!app.utils.isEmpty(errorMessage)) {
                ctrl.updateLocation(R.CannotGetLocation);
            }
            else {
                if (app.config.enableGoogleService) {
                    app.map.getAddress(new google.maps.LatLng(request.latitude, request.longitude), function (address) {
                        if (app.utils.isEmpty(address))
                            ctrl.updateLocation("Latitude: " + request.latitude.toString() + "  Longitude:" + request.longitude.toString());
                        else
                            ctrl.updateLocation(address);
                        app.network.submitLocation(ctrl.$http, request, false, function (errorMessage) { });
                    });
                }
                else {
                    app.network.submitLocation(ctrl.$http, request, false, function (errorMessage) { });
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
                app.network.submitActivity(ctrl.$http, {
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
                    app.map.stopWatcher();
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
                    app.network.submitActivity(ctrl.$http, {
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
                app.network.submitActivity(ctrl.$http, {
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
                app.network.submitActivity(ctrl.$http, {
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
                    app.map.stopWatcher();
                    ctrl.$state.go(app.paramters.nextState);
                });
            }
        });
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
    }
    JournalMapController.prototype.existJournal = function () {
        var ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.network.submitActivity(ctrl.$http, {
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
                    app.map.stopWatcher();
                    ctrl.$state.go(app.paramters.nextState);
                });
            }
        });
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
        var ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        ctrl._queryActivities = function () {
            app.db.getJournalActivities(ctrl.journal.id, function (result) {
                var activites = [];
                for (var i = 0; i < result.rows.length; i++) {
                    var activity = JSON.parse(result.rows.item(i).value);
                    activites.push(activity);
                }
                ctrl.activities = activites;
            });
        };
        ctrl._queryActivities();
    }
    JournalActivityController.prototype.existJournal = function () {
        var ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.network.submitActivity(ctrl.$http, {
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
                    app.map.stopWatcher();
                    ctrl.$state.go(app.paramters.nextState);
                });
            }
        });
    };
    JournalActivityController.prototype.refresh = function () {
        var ctrl = this;
        ctrl._queryActivities();
    };
    return JournalActivityController;
}());

//# sourceMappingURL=ctrl.journal.js.map
