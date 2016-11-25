class TruckController {
    public allowBack: boolean;
    public trucks: Array<any>;
    public R: any;

    constructor(
        private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicHistory: any,
        private $state: any) {

        app.log.debug(this.$ionicHistory.viewHistory());
        this.R = resources.language;
        this.allowBack = kapp.paramters.allowBack;

        let _tc = this;
        // Login
        _tc.$ionicLoading.show({ template: this.R.Signing, noBackdrop: false, });
        kapp.network.post(_tc.$http, "getTrucks", { token: kapp.context.token }, function (result) {
            _tc.$ionicLoading.hide();

            let selectedTruckId = kapp.context.userContext.truck != null ? kapp.context.userContext.truck.id : 0;
            let trucks = [];
            if (kapp.utils.isEmpty(result.errorMessage)) {
                for (let i = 0; i < result.data.items.length; i++){
                    var truck = result.data.items[i];
                    truck.isSelected = (truck.id === selectedTruckId);
                    trucks.push(truck);
                }
                _tc.trucks = trucks;
            }
            
            else {
                let alertPopup = _tc.$ionicPopup.alert({ title: this.R.Error, template: result.errorMessage, });
            }
        });
    }

    public goBack(): void {
        let cc = this;
        let nextState = app.paramters.nextState;
        app.paramters.nextState = null;
        if (nextState != null)
            cc.$state.go(nextState);
        else
            cc.$ionicHistory.goBack();
    }

    public viewDetail(id: number): void {
        for (let i = 0; i < this.trucks.length; i++) {
            var truck = this.trucks[i];
            if (truck.id === id) {
                kapp.paramters.truck = truck;
                this.$state.go('truckDetailScreen');
                return;
            }
        }
    }
}

class TruckDetailController {
    public truck: any;
    public R: any;

    constructor(
        private $scope: angular.IScope,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $state: any) {

        this.R = resources.language;
        this.truck = kapp.paramters.truck;
    }

    public save(): void {
        let truck = this.truck;
        let _tdc = this;
        app.context.userContext.truck = truck;
        _tdc.$ionicLoading.show({ template: this.R.Saving, noBackdrop: false, });
        kapp.db.saveUserContext(app.context.user.id, app.context.user.userName, JSON.stringify(app.context.userContext),
            function (result: IQueryResult) {
                _tdc.$ionicLoading.hide();
                if (kapp.utils.isEmpty(result.errorMessage)) {
                    //if (app.paramters.allowBack)
                    //    _tdc.$ionicHistory.goBack(2);
                    //else
                    //    _tdc.$state.go('mainScreen');
                    _tdc.$state.go('mainScreen');
                } else {
                    var alertPopup = _tdc.$ionicPopup.alert({ title: _tdc.R.Error, template: result.errorMessage, });
                }
            });
    }
}