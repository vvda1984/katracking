class ConfigController {
    public data: any;
    public R: any;

    constructor(
        private $scope: angular.IScope,
        private $state: any,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicViewSwitcher: any) {

        this.R = R;
        this.data = {
            ip: kapp.config.ipAddress,
            port: kapp.config.port,
            serviceName: kapp.config.serviceName,
            requestTimeout: kapp.config.requestTimeout.toString(),
            enableGoogleService: kapp.config.enableGoogleService
        };
    }

    public save(): void {
        let data = this.data;
        if (kapp.utils.isEmpty(data.ip)) {
            this.$ionicPopup.alert({ title: R.Error, template: R.IPaddress_is_empty, });
            return;
        }
        if (kapp.utils.isEmpty(data.port)) {
            this.$ionicPopup.alert({title: R.Error, template: R.Port_is_empty, });
            return;
        }
        if (kapp.utils.isEmpty(data.serviceName)) {
            this.$ionicPopup.alert({ title: R.Error, template: R.Service_is_empty, });
            return;
        }

        let requestTimeout = app.utils.parseInt(data.requestTimeout);
        if (requestTimeout == null || requestTimeout <= 0) {
            this.$ionicPopup.alert({ title: R.Error, template: R.Timout_is_invalid, });
            return;
        }

        let configCtrl = this;
        configCtrl.$ionicLoading.show({ template: R.Saving, noBackdrop: false, });
        kapp.db.saveSettings([
            { name: "ipAddress", value: data.ip },
            { name: "port", value: data.port },
            { name: "serviceName", value: data.serviceName },
            { name: "enableGoogleService", value: data.enableGoogleService ? "1" : "0" },
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
                    kapp.config.enableGoogleService = data.enableGoogleService;

                    configCtrl.goBack();                   
                } else {
                    configCtrl.$ionicPopup.alert({ title: R.Error, template: result.errorMessage, });
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