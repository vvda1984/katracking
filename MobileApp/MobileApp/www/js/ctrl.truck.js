var TruckController = (function () {
    function TruckController($scope, $http, $ionicLoading, $ionicPopup, $ionicViewSwitcher, $state) {
        this.$scope = $scope;
        this.$http = $http;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicViewSwitcher = $ionicViewSwitcher;
        this.$state = $state;
        this.R = R;
        this.allowBack = kapp.paramters.allowBack;
        var _tc = this;
        // Login
        _tc.$ionicLoading.show({ template: R.Signing, noBackdrop: false, });
        kapp.serverAPI.post(_tc.$http, "getTrucks", { token: kapp.context.token }, function (result) {
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
                var alertPopup = _tc.$ionicPopup.alert({ title: R.Error, template: result.errorMessage, });
            }
        });
    }
    TruckController.prototype.goBack = function () {
        var nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        this.$ionicViewSwitcher.nextDirection("back");
        this.$state.go(nextState);
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
    function TruckDetailController($scope, $ionicLoading, $ionicPopup, $ionicViewSwitcher, $ionicHistory, $state) {
        this.$scope = $scope;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicViewSwitcher = $ionicViewSwitcher;
        this.$ionicHistory = $ionicHistory;
        this.$state = $state;
        this.R = R;
        var truck = kapp.paramters.truck;
        //truck.description = app.utils.replace("\n", "<br/>");
        this.truck = kapp.paramters.truck;
    }
    TruckDetailController.prototype.save = function () {
        var truck = this.truck;
        var _tdc = this;
        app.context.userContext.truck = truck;
        _tdc.$ionicLoading.show({ template: R.Saving, noBackdrop: false, });
        kapp.db.saveUserContext(app.context.user.id, app.context.user.userName, JSON.stringify(app.context.userContext), function (result) {
            _tdc.$ionicLoading.hide();
            if (kapp.utils.isEmpty(result.errorMessage)) {
                //forward, back, enter, exit, swap.
                _tdc.$ionicViewSwitcher.nextDirection("forward");
                _tdc.$state.go('mainScreen');
            }
            else {
                var alertPopup = _tdc.$ionicPopup.alert({ title: _tdc.R.Error, template: result.errorMessage, });
            }
        });
    };
    TruckDetailController.prototype.goBack = function () {
        this.$ionicHistory.goBack();
    };
    return TruckDetailController;
}());

//# sourceMappingURL=ctrl.truck.js.map
