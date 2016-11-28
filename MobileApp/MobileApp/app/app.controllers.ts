class TestMapController {
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
        jvc.map = app.mapAPI.createMap("journalViewMap");
        app.mapAPI.addCurrentLocation(jvc.map, this.$ionicPopup);

        let m = this.map;
        let j = this.journal;
        let points = [];

        let startPoint = new google.maps.LatLng(j.startLat, j.startLng);
        points.push(startPoint);
        app.mapAPI.addMarker(m, startPoint, R.Start + ": " + j.startLocation, "marker-start.png");

        for (let i = 0; i < j.stopPoints.length; i++) {
            var s = j.stopPoints[i];
            let point = new google.maps.LatLng(s.latitude, s.longitude);
            points.push(point);
            app.mapAPI.addMarker(m, point, s.name, "marker-delivery.png");
        }

        let endPoint = new google.maps.LatLng(j.endLat, j.endLng);
        points.push(endPoint)
        app.mapAPI.addMarker(m, endPoint, R.End + ": " + j.endLocation, "marker-end.png");

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

    private renderRoute(points: Array<google.maps.LatLng>, index: number, totalDistance: number, totalDuration: number, callback: any): void {
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
                        //strokeColor: app.utils.randomColor(),
                    }
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
            //jvc.journal.totalDistance = totalDistance;
            //jvc.journal.totalDuration = totalDuration;

            //$("#distance").html((jvc.journal.totalDistance / 1000).toString() + " km");
            //$("#duration").html(Math.round(jvc.journal.totalDistance / 60).toString() + " phút");
            callback();
        }
    }

    public goBack(): void {
        let cc = this;
        let nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        cc.$ionicViewSwitcher.nextDirection("back");
        cc.$state.go(nextState);
    }
}

angular.module("starter.controllers", [])
    .controller("MainController", MainController)
    .controller("LoginController", LoginController)
    .controller("ConfigController", ConfigController)
    .controller("TruckController", TruckController)
    .controller("TruckDetailController", TruckDetailController)
    .controller("TestMapController", TestMapController)
    .controller("JournalViewController", JournalViewController)
    .controller("JournalDashController", JournalDashController)
    .controller("JournalMapController", JournalMapController)
    .controller("JournalActivityController", JournalActivityController);
