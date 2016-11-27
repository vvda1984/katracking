class LoginController {
    public loginData: any;
    public R: any;

    public http: angular.IHttpService;
    public state: any;
    public ionicLoading: ionic.loading.IonicLoadingService;
    public ionicPopup: ionic.popup.IonicPopupService;

    constructor(
        private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $state: any,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService) {

        this.R = R;
        this.http = $http;
        this.state = $state;
        this.ionicLoading = $ionicLoading;
        this.ionicPopup = $ionicPopup;

        app.network.stopSync();
        app.paramters.clear();

        this.loginData = { username: '', password: '', };
        if (app.config.enableDebug) {
            this.loginData.username = "user1";
            this.loginData.password = "123";
        }
    }

    public signin(): void {
        let data = this.loginData;
        if (app.utils.isEmpty(data.username)) {
            this.$ionicPopup.alert({ title: R.Error, template: R.Username_is_empty });
            return;
        }
        if (app.utils.isEmpty(data.password)) {
            this.$ionicPopup.alert({ title: R.Error, template: R.Password_is_empty, });
            return;
        }

        let ctrl = this;
        ctrl.ionicLoading.show({ template: R.Signing, noBackdrop: false, });
        //app.network.ajaxPost("signin", { username: data.username, password: data.password }, function (result) {
        app.network.post(ctrl.http, "signin", { username: data.username, password: data.password }, function (result) {
            ctrl.ionicLoading.hide();
            if (app.utils.isEmpty(result.errorMessage)) {
                app.context.user = result.data.user;
                app.context.token = result.data.token;

                let userId = app.context.user.id.toString();
                app.context.DB_JOURNAL_TBL = DB_JOURNAL_TBL + "_" + userId;
                app.context.DB_JOURNAL_STOPPOINTS_TBL = DB_JOURNAL_STOPPOINTS_TBL + "_" + userId;
                app.context.DB_JOURNAL_ACTIVITIES_TBL = DB_JOURNAL_ACTIVITIES_TBL + "_" + userId;
                app.context.DB_JOURNAL_LOCATIONS_TBL = DB_JOURNAL_LOCATIONS_TBL + "_" + userId;

                // Get user context
                ctrl.$ionicLoading.show({ template: ctrl.R.Loading, noBackdrop: false, });
                app.db.getUserContext(app.context.user.id, function (result: IQueryResult) {      
                    ctrl.ionicLoading.hide();             
                    if (app.utils.isEmpty(result.errorMessage)) {
                        let userContext = null;
                        try {
                            if (result.rows.length > 0) {
                                userContext = JSON.parse(result.rows.item(0).value);
                            }
                        }
                        catch (ex) {
                            app.log.error(ex.message);
                        }

                        app.db.initializeForUser(function (result: IQueryResult) {
                            if (app.utils.isEmpty(result.errorMessage)) {
                                ctrl.$ionicLoading.show({ template: R.Processing, noBackdrop: false, });
                                app.network.syncData(ctrl.$http, function (errorMessage) {
                                    ctrl.ionicLoading.hide();
                                    if (app.utils.isEmpty(errorMessage)) {
                                        app.network.getJournals(ctrl.$http, ctrl.$ionicLoading, ctrl.$ionicPopup, function () {
                                            if (userContext == null || userContext.truck == null) {
                                                app.paramters.allowBack = false;
                                                ctrl.state.go('truckScreen');
                                            } else {
                                                app.context.userContext = userContext;
                                                ctrl.state.go('mainScreen');
                                            }
                                        });
                                    } else {
                                        ctrl.ionicPopup.alert({ title: R.Error, template: errorMessage });
                                    }
                                });
                            }
                            else {                            
                                ctrl.ionicPopup.alert({ title: R.Error, template: result.errorMessage });
                            }
                        });
                        
                    } else {                        
                        ctrl.ionicPopup.alert({ title: R.Error, template: result.errorMessage });
                    }
                });
            }
            else {
                ctrl.$ionicPopup.alert({ title: ctrl.R.Error, template: result.errorMessage, });
            }
        });
    }

    public loadJournalData(ctrl: LoginController, callback: any) {
        ctrl.ionicLoading.show({ template: R.Loading, noBackdrop: false, });
        if (app.network.isReady()) {
            app.network.post(ctrl.$http, "getDriverJournals", { token: app.context.token, driverId: app.context.user.id }, function (result) {
                ctrl.$ionicLoading.hide();
                if (app.utils.isEmpty(result.errorMessage)) {
                    // save offline...
                    app.context.setJournalGroups(result.data.items, callback);
                }
                else {
                    ctrl.$ionicPopup.alert({ title: ctrl.R.Error, template: result.errorMessage, });
                }
            });
        }
        else {
            app.db.getJournals(function (result) {
                ctrl.$ionicLoading.hide();
                let journals = [];
                for (let i = 0; i < result.rows.length; i++) {
                    journals.push(JSON.parse(result.rows.item(i).value));
                }
                app.context.setJournalGroups(journals, callback);
            });
        }
    }

    public openConfig(): void {
        app.paramters.nextState = "loginScreen";
        this.state.go("configScreen");
    }
}