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

class JournalViewController {
    public journal: any;
    public R: any;
    public map: any;
    public data: any;
    public allowStartJournal: any;

    constructor(
        private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,       
        private $ionicPopup: ionic.popup.IonicPopupService,        
        private $ionicViewSwitcher: any,
        private $state: any) {

        //app.log.debug(this.$ionicHistory.viewHistory());

        var ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        ctrl.data = { activeDate: ctrl.journal.activeDate.replace(" 00:00:00", "")};
        ctrl.allowStartJournal = kapp.paramters.allowStartJournal;
        ctrl.map = app.mapAPI.createMap("journalViewMap");
        app.mapAPI.addCurrentLocation(ctrl.map, this.$ionicPopup);
        
        let m = this.map;
        let j = this.journal;
        let points = [];
    
        let startPoint = new google.maps.LatLng(j.startLat, j.startLng);
        points.push(startPoint);      
        //app.mapAPI.addMarker(m, startPoint, R.Start + ": " + j.startLocation, "marker-start.png");
        //for (let i = 0; i < j.stopPoints.length; i++) {
        //    var s = j.stopPoints[i];
        //    let point = new google.maps.LatLng(s.latitude, s.longitude);
        //    points.push(point);
        //    app.mapAPI.addMarker(m, point, s.name, "marker-delivery.png");
        //}
        let endPoint = new google.maps.LatLng(j.endLat, j.endLng);
        points.push(endPoint)    
        //app.mapAPI.addMarker(m, endPoint, R.End + ": " + j.endLocation, "marker-end.png");

        //this.renderRoute(points, 0, 0, 0, function () {
        //    var idle = google.maps.event.addListener(jvc.map, "idle", function (event) {
        //        google.maps.event.removeListener(idle);             
        //        let b = new google.maps.LatLngBounds();
        //        for (let i = 0; i < points.length; i++) {
        //            b.extend(points[i]);                    
        //        }
        //        b.getCenter();
        //        jvc.map.fitBounds(b);
        //    });            
        //});

        let directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(m);
        directionsDisplay.setPanel(document.getElementById("dvPanel"));
        //directionsDisplay.setOptions({ suppressMarkers: true });
        app.mapAPI.calcRoute(directionsDisplay, startPoint, endPoint, function (errorMessage, di, du) { });
        var idle = google.maps.event.addListener(ctrl.map, "idle", function (event) {
            google.maps.event.removeListener(idle);
            let b = new google.maps.LatLngBounds();
            for (let i = 0; i < points.length; i++) {
                b.extend(points[i]);
            }
            b.getCenter();
            ctrl.map.fitBounds(b);
        });
    }

    private renderRoute(points: Array<google.maps.LatLng>, index: number, totalDistance: number, totalDuration: number, callback : any): void {
        let jvc = this;
        if (index < points.length - 1) {
            let point1 = points[index];
            let point2 = points[index + 1];
            let directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(jvc.map);
            directionsDisplay.setOptions(
                {
                    suppressMarkers: true,
                    //polylineOptions: {
                    //    strokeWeight: 4,
                    //    strokeOpacity: 1,
                    //    strokeColor: app.utils.randomColor(),
                    //}
                });
            app.mapAPI.calcRoute(directionsDisplay, point1, point2, function (errorMessage, di, du) {
                if (errorMessage == null) {
                    totalDistance += di;
                    totalDuration += du;
                    jvc.renderRoute(points, index + 1, totalDistance, totalDuration, callback);
                } else {
                    jvc.$ionicPopup.alert({ title: R.Error, template: errorMessage, });
                }
            });
        } else {
            jvc.journal.totalDistance = totalDistance;
            jvc.journal.totalDuration = totalDuration;

            $("#distance").html((jvc.journal.totalDistance / 1000).toString() + " km");
            $("#duration").html(Math.round(jvc.journal.totalDistance / 60).toString() + " phút");
            callback();
        }
    }

    public startJournal() {
        let ctrl = this;
        var confirmPopup = ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.PickUpJournal + "?", });
        confirmPopup.then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.mapAPI.getCurrentLocation(function (result) {
                    if (!app.utils.isEmpty(result.errorMessage)) {
                        ctrl.$ionicLoading.hide();
                        ctrl.$ionicPopup.alert({ title: R.Error, template: result.errorMessage, });
                    } else {                       
                        app.serverAPI.submitActivity(
                            ctrl.$http,
                            {
                                activityId: JournalActivity.BatDauHanhTrinh,
                                journalId: ctrl.journal.id,
                                driverId: app.context.user.id,
                                truckId: app.context.getTruckId(),
                                activityDetail: "",
                                activityName: "Bắt Đầu Hành Trình",
                                createdTS: app.utils.getCurrentDateTime(),
                                extendedData: null,
                                token: app.context.token,
                            },
                            true,
                            function (errorMessage) {
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
    }

    public goBack(): void {
        let cc = this;
        let nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        cc.$ionicViewSwitcher.nextDirection("back");
        cc.$state.go(nextState);
    }
}

class JournalDashController {
    public journal: any;
    public R: any;
    private _getAddressIndicator: number;
    private _lastAddress: string;

    constructor(
        private $scope: any,
        private $timeout: angular.ITimeoutService,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicViewSwitcher: any,
        private $state: any) {

        let ctrl = this;
        ctrl._lastAddress = null;
        ctrl._getAddressIndicator = 100000;
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
                ctrl.updateLocation(R.CannotGetLocation, 0, 0);
                submitCompleted();
            } else {
                let submitFunction = function (a, r) {
                    ctrl.updateLocation(a, r.latitude, r.longitude);
                    if (!app.utils.isEmpty(a)) {
                        ctrl._lastAddress = a;
                    }
                    r.address = ctrl._lastAddress;

                    app.serverAPI.submitLocation(ctrl.$http, r, false, function (errorMessage) {
                        if (!app.utils.isEmpty(errorMessage)) app.log.error(errorMessage)
                        submitCompleted();
                    });
                };

                if (app.config.enableGoogleService) {
                    var getAddressIndicator = app.utils.parseInt(app.config.getAddressInterval / app.config.getLocationInterval);

                    if (ctrl._getAddressIndicator >= getAddressIndicator) {
                        ctrl._getAddressIndicator = 0;
                        app.mapAPI.getAddress(new google.maps.LatLng(request.latitude, request.longitude), function (address) {
                            submitFunction(address, request);
                        });
                    } else {
                        submitFunction(null, request);
                    }
                } else {
                    submitFunction(null, request);
                }
            }
        });
    }

    public updateLocation(location: string, lat: number, lng: number): void {
        if(location!=null) $("#currentLocation").html(location);
        //$("#currentLocationLatLng").html("Lat: " + lat.toString() + ", Lng: " + lng.toString());
    }

    public existJournal(): void {
        let ctrl = this;        
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {       
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(
                    ctrl.$http,
                    {
                        activityId: JournalActivity.ThoatHanhTrinh,
                        journalId: ctrl.journal.id,
                        driverId: app.context.user.id,
                        truckId: app.context.getTruckId(),
                        activityDetail: "",
                        activityName: "Thoát Hành Trình",
                        createdTS: app.utils.getCurrentDateTime(),
                        extendedData: null,
                        token: app.context.token,
                    },
                    false,
                    function (errorMessage) {
                        ctrl.$ionicLoading.hide();
                        app.mapAPI.stopWatcher();
                        ctrl.$state.go(app.paramters.nextState);
                    });
            }
        });
    }   
        
    public doActivity(activityId : number, activityAction: string, hasMessage? : boolean) : void{
        let ctrl = this;
        if (!hasMessage) {
            ctrl.$ionicPopup.confirm({ title: R.Confirm, template: activityAction + "?", }).then(function (res) {
                if (res) {
                    ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                    app.serverAPI.submitActivity(
                        ctrl.$http,
                        {
                            activityId: activityId,
                            journalId: ctrl.journal.id,
                            driverId: app.context.user.id,
                            truckId: app.context.getTruckId(),
                            activityDetail: "",
                            activityName: activityAction,
                            createdTS: app.utils.getCurrentDateTime(),
                            extendedData: null,
                            token: app.context.token,
                        },
                        false,
                        function (errorMessage) {
                            ctrl.$ionicLoading.hide();
                            if(!app.utils.isEmpty(errorMessage))
                                ctrl.$ionicPopup.alert({ title: R.Error, template: errorMessage, });                          
                        });
                }
            });
        } else {
            ctrl.$scope.data = { message: null};
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
                            } else {
                                return ctrl.$scope.data.message;
                            }
                        }
                    }
                ]
            }).then(function (message) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(
                    ctrl.$http,
                    {
                        activityId: activityId,
                        journalId: ctrl.journal.id,
                        driverId: app.context.user.id,
                        truckId: app.context.getTruckId(),
                        activityDetail: message,
                        activityName: activityAction,
                        createdTS: app.utils.getCurrentDate(),
                        extendedData: null,
                        token: app.context.token,
                    },
                    false,
                    function (errorMessage) {
                        ctrl.$ionicLoading.hide();
                        if (!app.utils.isEmpty(errorMessage))
                            ctrl.$ionicPopup.alert({ title: R.Error, template: errorMessage, });   
                    });
            });
        }
    }

    public endJournal() {
        let ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.EndJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(
                    ctrl.$http,
                    {
                        activityId: JournalActivity.KetThucHanhTrinh,
                        journalId: ctrl.journal.id,
                        driverId: app.context.user.id,
                        truckId: app.context.getTruckId(),
                        activityDetail: "Kết Thúc",
                        activityName: R.EndJournal,
                        createdTS: app.utils.getCurrentDateTime(),
                        extendedData: null,
                        token: app.context.token,
                    },
                    false,
                    function (errorMessage) {
                        ctrl.$ionicLoading.hide();
                        app.mapAPI.stopWatcher();
                        ctrl.$state.go(app.paramters.nextState);
                    });
            }
        });
    }

    public goBack(): void {
        let ctrol = this;
        let nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        ctrol.$ionicViewSwitcher.nextDirection("back");
        ctrol.$state.go(nextState);
    }
}

class JournalMapController {
    public journal: any;
    public R: any;
    public map: google.maps.Map;    
  
    constructor(private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicViewSwitcher: any,
        private $state: any) {

        var ctrl = this;
      
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        ctrl.map = app.mapAPI.createMap("journalViewMap");
        app.mapAPI.addCurrentLocation(ctrl.map, ctrl.$ionicPopup);

        let m = ctrl.map;
        let j = ctrl.journal;
        let points = [];

        let startPoint = new google.maps.LatLng(j.startLat, j.startLng);
        points.push(startPoint);
        app.mapAPI.addMarker(m, startPoint, R.Start + ": " + j.startLocation, "marker-start.png");       
        let endPoint = new google.maps.LatLng(j.endLat, j.endLng);
        points.push(endPoint)
        app.mapAPI.addMarker(m, endPoint, R.End + ": " + j.endLocation, "marker-end.png");

        let directionsDisplay = new google.maps.DirectionsRenderer();
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
                let b = new google.maps.LatLngBounds();
                for (let i = 0; i < points.length; i++) {
                    b.extend(points[i]);
                }
                b.getCenter();
                ctrl.map.fitBounds(b);
            }
        });
    }

    public existJournal(): void {
        let ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(
                    ctrl.$http,
                    {
                        activityId: JournalActivity.ThoatHanhTrinh,
                        journalId: ctrl.journal.id,
                        driverId: app.context.user.id,
                        truckId: app.context.getTruckId(),
                        activityDetail: "",
                        activityName: "Thoát Hành Trình",
                        createdTS: app.utils.getCurrentDateTime(),
                        extendedData: null,
                        token: app.context.token,
                    },
                    false,
                    function (errorMessage) {
                        ctrl.$ionicLoading.hide();
                        app.mapAPI.stopWatcher();
                        ctrl.$state.go(app.paramters.nextState);
                    });
            }
        });
    }   

    public goBack(): void {
        let ctrol = this;
        let nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        ctrol.$ionicViewSwitcher.nextDirection("back");
        ctrol.$state.go(nextState);
    }
}

class JournalActivityController {
    public journal: any;
    public data: any;
    public R: any;
    //public activities: Array<any>;
    private _queryActivities: any;

    constructor(private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicViewSwitcher: any,
        private $state: any) {

        this.data = { activities: [] };
        let ctrl = this;        
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

    public existJournal(): void {
        let ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.serverAPI.submitActivity(
                    ctrl.$http,
                    {
                        activityId: JournalActivity.ThoatHanhTrinh,
                        journalId: ctrl.journal.id,
                        driverId: app.context.user.id,
                        truckId: app.context.getTruckId(),
                        activityDetail: "",
                        activityName: "Thoát Hành Trình",
                        createdTS: app.utils.getCurrentDateTime(),
                        extendedData: null,
                        token: app.context.token,
                    },
                    false,
                    function (errorMessage) {
                        ctrl.$ionicLoading.hide();
                        app.mapAPI.stopWatcher();
                        ctrl.$state.go(app.paramters.nextState);
                    });
            }
        });
    }   

    public refresh(): void {  
        let ctrl = this; 
        ctrl._queryActivities();    
    }

    public goBack(): void {
        let ctrol = this;
        let nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        ctrol.$ionicViewSwitcher.nextDirection("back");
        ctrol.$state.go(nextState);
    }
}