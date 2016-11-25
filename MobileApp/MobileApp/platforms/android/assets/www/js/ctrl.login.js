var LoginController = (function () {
    function LoginController($scope, $http, $state, $ionicHistory, $ionicLoading, $ionicPopup) {
        this.$scope = $scope;
        this.$http = $http;
        this.$state = $state;
        this.$ionicHistory = $ionicHistory;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicHistory.clearHistory();
        this.loginData = {
            username: '',
            password: '',
        };
        if (app.config.enableDebug) {
            this.loginData.username = "user1";
            this.loginData.password = "123";
        }
        this.R = resources.language;
        app.paramters.clear();
    }
    LoginController.prototype.signin = function () {
        var data = this.loginData;
        if (kapp.utils.isEmpty(data.username)) {
            var alertPopup = this.$ionicPopup.alert({ title: this.R.Error, template: this.R.Username_is_empty });
            return;
        }
        if (kapp.utils.isEmpty(data.password)) {
            var alertPopup = this.$ionicPopup.alert({ title: this.R.Error, template: this.R.Password_is_empty, });
            return;
        }
        var _lc = this;
        // Login
        _lc.$ionicLoading.show({ template: this.R.Signing, noBackdrop: false, });
        //kapp.network.ajaxPost("signin", { username: data.username, password: data.password }, function (result) {
        kapp.network.post(this.$http, "signin", { username: data.username, password: data.password }, function (result) {
            _lc.$ionicLoading.hide();
            if (kapp.utils.isEmpty(result.errorMessage)) {
                kapp.context.user = result.data.user;
                kapp.context.token = result.data.token;
                // Get user context
                _lc.$ionicLoading.show({ template: _lc.R.Loading, noBackdrop: false, });
                kapp.db.getUserContext(kapp.context.user.id, function (result) {
                    _lc.$ionicLoading.hide();
                    if (kapp.utils.isEmpty(result.errorMessage)) {
                        var userContext = null;
                        try {
                            if (result.rows.length > 0) {
                                userContext = JSON.parse(result.rows.item(0).value);
                            }
                        }
                        catch (ex) {
                            kapp.log.error(ex.message);
                        }
                        if (userContext == null || userContext.truck == null) {
                            app.paramters.allowBack = false;
                            //window.location.href = "#/truck";
                            _lc.$state.go('truckScreen');
                        }
                        else {
                            app.context.userContext = userContext;
                            window.location.href = "#/main";
                            _lc.$state.go('mainScreen');
                        }
                    }
                    else {
                        var alertPopup = _lc.$ionicPopup.alert({
                            title: "Error",
                            template: result.errorMessage
                        });
                    }
                });
            }
            else {
                var alertPopup = _lc.$ionicPopup.alert({ title: this.R.Error, template: result.errorMessage, });
            }
        });
    };
    return LoginController;
}());

//# sourceMappingURL=ctrl.login.js.map
