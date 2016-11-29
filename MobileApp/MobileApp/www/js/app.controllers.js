var TestMapController = (function () {
    function TestMapController($scope, $http, $ionicLoading, $ionicPopup, $ionicViewSwitcher, $state) {
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
        for (var i = 0; i < j.stopPoints.length; i++) {
            var s = j.stopPoints[i];
            var point = new google.maps.LatLng(s.latitude, s.longitude);
            points.push(point);
            app.mapAPI.addMarker(m, point, s.name, "marker-delivery.png");
        }
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
    TestMapController.prototype.renderRoute = function (points, index, totalDistance, totalDuration, callback) {
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
                }
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
            //jvc.journal.totalDistance = totalDistance;
            //jvc.journal.totalDuration = totalDuration;
            //$("#distance").html((jvc.journal.totalDistance / 1000).toString() + " km");
            //$("#duration").html(Math.round(jvc.journal.totalDistance / 60).toString() + " ph�t");
            callback();
        }
    };
    TestMapController.prototype.goBack = function () {
        var cc = this;
        var nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        cc.$ionicViewSwitcher.nextDirection("back");
        cc.$state.go(nextState);
    };
    return TestMapController;
}());
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

//# sourceMappingURL=app.controllers.js.map
