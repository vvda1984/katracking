var TruckController = (function () {
    function TruckController($scope, $http, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
        this.$scope = $scope;
        this.$http = $http;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicHistory = $ionicHistory;
        this.$state = $state;
        app.log.debug(this.$ionicHistory.viewHistory());
        this.R = resources.language;
        this.allowBack = kapp.paramters.allowBack;
        var _tc = this;
        // Login
        _tc.$ionicLoading.show({ template: this.R.Signing, noBackdrop: false, });
        kapp.network.post(_tc.$http, "getTrucks", { token: kapp.context.token }, function (result) {
            _tc.$ionicLoading.hide();
            var selectedTruckId = kapp.context.userContext.truck != null ? kapp.context.userContext.truck.id : 0;
            var trucks = [];
            if (kapp.utils.isEmpty(result.errorMessage)) {
                for (var i = 0; i < result.data.items.length; i++) {
                    var truck = result.data.items[i];
                    truck.isSelected = (truck.id === selectedTruckId);
                    trucks.push(truck);
                }
                _tc.trucks = trucks;
            }
            else {
                var alertPopup = _tc.$ionicPopup.alert({ title: this.R.Error, template: result.errorMessage, });
            }
        });
    }
    TruckController.prototype.goBack = function () {
        var cc = this;
        var nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        if (nextState != null)
            cc.$state.go(nextState);
        else
            cc.$ionicHistory.goBack();
    };
    TruckController.prototype.viewDetail = function (id) {
        for (var i = 0; i < this.trucks.length; i++) {
            var truck = this.trucks[i];
            if (truck.id === id) {
                kapp.paramters.truck = truck;
                this.$state.go('truckDetailScreen');
                return;
            }
        }
    };
    return TruckController;
}());
var TruckDetailController = (function () {
    function TruckDetailController($scope, $ionicLoading, $ionicPopup, $state) {
        this.$scope = $scope;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$state = $state;
        this.R = resources.language;
        this.truck = kapp.paramters.truck;
    }
    TruckDetailController.prototype.save = function () {
        var truck = this.truck;
        var _tdc = this;
        app.context.userContext.truck = truck;
        _tdc.$ionicLoading.show({ template: this.R.Saving, noBackdrop: false, });
        kapp.db.saveUserContext(app.context.user.id, app.context.user.userName, JSON.stringify(app.context.userContext), function (result) {
            _tdc.$ionicLoading.hide();
            if (kapp.utils.isEmpty(result.errorMessage)) {
                //if (app.paramters.allowBack)
                //    _tdc.$ionicHistory.goBack(2);
                //else
                //    _tdc.$state.go('mainScreen');
                _tdc.$state.go('mainScreen');
            }
            else {
                var alertPopup = _tdc.$ionicPopup.alert({ title: _tdc.R.Error, template: result.errorMessage, });
            }
        });
    };
    return TruckDetailController;
}());

//# sourceMappingURL=ctrl.truck.js.map
