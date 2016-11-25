class ConfigController {
    public data: any;
    public R: any;

    constructor(
        private $scope: angular.IScope,
        private $state: any,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicHistory: any) {
        app.log.debug(this.$ionicHistory.viewHistory());

        this.R = resources.language;
        this.data = {
            ip: kapp.config.ipAddress,
            port: kapp.config.port,
            serviceName: kapp.config.serviceName,
            requestTimeout: kapp.config.requestTimeout.toString(),
            enableMap: kapp.config.enableMap
        };
    }

    public save(): void {
        let data = this.data;
        if (kapp.utils.isEmpty(data.ip)) {
            var alertPopup = this.$ionicPopup.alert({ title: this.R.Error, template: this.R.IPaddress_is_empty, });
            return;
        }
        if (kapp.utils.isEmpty(data.port)) {
            var alertPopup = this.$ionicPopup.alert({
                title: this.R.Error,
                template: this.R.Port_is_empty,
            });
            return;
        }
        if (kapp.utils.isEmpty(data.serviceName)) {
            var alertPopup = this.$ionicPopup.alert({ title: this.R.Error, template: this.R.Service_is_empty, });
            return;
        }

        let requestTimeout = app.utils.parseInt(data.requestTimeout);
        if (requestTimeout == null || requestTimeout <= 0) {
            var alertPopup = this.$ionicPopup.alert({ title: this.R.Error, template: this.R.Timout_is_invalid, });
            return;
        }

        let configCtrl = this;
        this.$ionicLoading.show({ template: this.R.Saving, noBackdrop: false, });
        kapp.db.saveSettings([
            { name: "ipAddress", value: data.ip },
            { name: "port", value: data.port },
            { name: "serviceName", value: data.serviceName },
            { name: "enableMap", value: data.enableMap ? "1" : "0" },
            { name: "requestTimeout", value: data.requestTimeout }
        ],
            function (result: IQueryResult) {
                configCtrl.$ionicLoading.hide();
                if (kapp.utils.isEmpty(result.errorMessage)) {
                    kapp.config.ipAddress = data.ip;
                    kapp.config.port = data.port;
                    kapp.config.serviceName = data.serviceName;
                    kapp.config.updateBaseURL();

                    kapp.config.requestTimeout = requestTimeout;
                    kapp.config.enableMap = data.enableMap;

                    configCtrl.$ionicHistory.goBack();
                } else {
                    var alertPopup = this.$ionicPopup.alert({ title: this.R.Error, template: result.errorMessage, });
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
}