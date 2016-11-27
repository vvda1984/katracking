class JournalController {
    public journal: any;
    public R: any;
    public map: any;
    public allowViewMap: boolean;

    constructor(private $ionicHistory: any) {
        app.log.debug(this.$ionicHistory.viewHistory());

        let jc = this;
        //jc.message = "This is test message!";
        jc.R = R;
        jc.journal = kapp.paramters.journal;
        jc.allowViewMap = true;
        //if (jc.allowViewMap) {
        //    jc.map = app.map.createMap("journalMap");
        //}
    }

    public updateMessage(message: string, type: number): void {
        $("#journalMessage").html(message);
    }

    public updateLocation(location: string): void {
        $("#currentLocation").html(location);
    }
}

class JournalViewController {
    public journal: any;
    public R: any;
    public map: any;
  
    public allowStartJournal: any;

    constructor(
        private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,       
        private $ionicPopup: ionic.popup.IonicPopupService,        
        private $ionicViewSwitcher: any,
        private $state: any) {

        //app.log.debug(this.$ionicHistory.viewHistory());

        var jvc = this;

        jvc.R = R;
        jvc.journal = kapp.paramters.journal;
        jvc.allowStartJournal = kapp.paramters.allowStartJournal;
        jvc.map = app.map.createMap("journalViewMap");
        app.map.addCurrentLocation(jvc.map, this.$ionicPopup);
        
        let m = this.map;
        let j = this.journal;
        let points = [];
    
        let startPoint = new google.maps.LatLng(j.startLat, j.startLng);
        points.push(startPoint);      
        app.map.addMarker(m, startPoint, R.Start + ": " + j.startLocation, "marker-start.png");

        for (let i = 0; i < j.stopPoints.length; i++) {
            var s = j.stopPoints[i];
            let point = new google.maps.LatLng(s.latitude, s.longitude);
            points.push(point);
            app.map.addMarker(m, point, s.name, "marker-delivery.png");
        }

        let endPoint = new google.maps.LatLng(j.endLat, j.endLng);
        points.push(endPoint)    
        app.map.addMarker(m, endPoint, R.End + ": " + j.endLocation, "marker-end.png");

        this.renderRoute(points, 0, 0, 0, function () {
            var idle = google.maps.event.addListener(jvc.map, "idle", function (event) {
                google.maps.event.removeListener(idle);
                                
                let b = new google.maps.LatLngBounds();
                for (let i = 0; i < points.length; i++) {
                    b.extend(points[i]);                    
                }
                b.getCenter();
                jvc.map.fitBounds(b);
            });            
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
                app.map.getCurrentLocation(function (result) {
                    if (!app.utils.isEmpty(result.errorMessage)) {
                        ctrl.$ionicLoading.hide();
                        ctrl.$ionicPopup.alert({ title: R.Error, template: result.errorMessage, });
                    } else {                       
                        app.network.submitActivity(
                            ctrl.$http,
                            {
                                activityId: JournalActivity.BatDauHanhTrinh,
                                journalId: ctrl.journal.id,
                                driverId: app.context.user.id,
                                truckId: app.context.getTruckId(),
                                activityDetail: "",
                                activityName: "BatDauHanhTrinh",
                                createdTS: app.utils.getCurrentDateTime(),
                                extendedData: null,
                                token: app.context.token,
                            },
                            true,
                            function (errorMessage) {
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

    constructor(
        private $scope: any,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicViewSwitcher: any,
        private $state: any) {

        let ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        app.map.curAccCircle = null;
        app.map.curLocationMarker = null;
        app.network.submitActivity(
            ctrl.$http,
            {
                activityId: JournalActivity.TroLaiHanhTrinh,
                journalId: ctrl.journal.id,
                driverId: app.context.user.id,
                truckId: app.context.getTruckId(),
                activityDetail: "",
                activityName: "Trở Lại Hành Trình",
                createdTS: app.utils.getCurrentDateTime(),
                extendedData: null,
                token: app.context.token,
            },
            false,
            function (errorMessage) {
            });

        app.map.startWatcher(function (errorMessage, request, submitCompleted) {
            if (!app.utils.isEmpty(errorMessage)) {
                ctrl.updateLocation(R.CannotGetLocation);
            } else {                                              
                if (app.config.enableGoogleService) {
                    app.map.getAddress(new google.maps.LatLng(request.latitude, request.longitude), function (address) {
                        if (app.utils.isEmpty(address))
                            ctrl.updateLocation("Latitude: " + request.latitude.toString() + "  Longitude:" + request.longitude.toString());
                        else
                            ctrl.updateLocation(address);
                        app.network.submitLocation(ctrl.$http, request, false, function (errorMessage) { });
                    });
                } else {
                    app.network.submitLocation(ctrl.$http, request, false, function (errorMessage) { });
                }
            }        
        });
    }

    public updateLocation(location: string): void {
        $("#currentLocation").html(location);
    }

    public existJournal(): void {
        let ctrl = this;        
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {       
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.network.submitActivity(
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
                        app.map.stopWatcher();
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
                    app.network.submitActivity(
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
                app.network.submitActivity(
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
                app.network.submitActivity(
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
                        app.map.stopWatcher();
                        ctrl.$state.go(app.paramters.nextState);
                    });
            }
        });
    }
}

class JournalMapController {
    public journal: any;
    public R: any;

    constructor(private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicViewSwitcher: any,
        private $state: any) {

        let ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
    }

    public existJournal(): void {
        let ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.network.submitActivity(
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
                        app.map.stopWatcher();
                        ctrl.$state.go(app.paramters.nextState);
                    });
            }
        });
    }   
}

class JournalActivityController {
    public journal: any;
    public R: any;
    public activities: Array<any>;
    private _queryActivities: any;

    constructor(private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicViewSwitcher: any,
        private $state: any) {

        let ctrl = this;
        ctrl.R = R;
        ctrl.journal = kapp.paramters.journal;
        ctrl._queryActivities = function () {
            app.db.getJournalActivities(ctrl.journal.id, function (result) {
                let activites = [];
                for (let i = 0; i < result.rows.length; i++) {
                    let activity = JSON.parse(result.rows.item(i).value);
                    activites.push(activity);
                }
                ctrl.activities = activites;
            });
        };
        ctrl._queryActivities();
    }

    public existJournal(): void {
        let ctrl = this;
        ctrl.$ionicPopup.confirm({ title: R.Confirm, template: R.ExitJournal + "?", }).then(function (res) {
            if (res) {
                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                app.network.submitActivity(
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
                        app.map.stopWatcher();
                        ctrl.$state.go(app.paramters.nextState);
                    });
            }
        });
    }   

    public refresh(): void {  
        let ctrl = this; 
        ctrl._queryActivities();    
    }
}
