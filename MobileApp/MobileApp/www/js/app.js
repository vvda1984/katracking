/// <reference path="../typings/index.d.ts" />
angular.module("starter", ["ionic", "ngCordova", "starter.controllers", "starter.services"])
    .run(function ($ionicPlatform, $ionicLoading, $ionicPopup) {
    $ionicPlatform.ready(function () {
        // hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            window.StatusBar.styleLightContent();
        }
        kapp.log.info("Device ready!");
        $ionicLoading.show({
            template: 'Loading...',
            noBackdrop: false,
        });
        kapp.db.initialize(function (initDBResult) {
            if (kapp.utils.isEmpty(initDBResult.errorMessage)) {
                kapp.log.debug("Initialize database successfully");
                kapp.isReady = true;
                kapp.db.getSettings(function (result) {
                    $ionicLoading.hide();
                    if (kapp.utils.isEmpty(result.errorMessage)) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            kapp.config.setValue(row.name, row.value);
                        }
                        kapp.config.updateBaseURL();
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: "Error",
                            template: result.errorMessage
                        });
                    }
                });
            }
            else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: "Error",
                    template: initDBResult.errorMessage
                });
            }
        });
    });
})
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("loginScreen", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginController as lc"
    })
        .state("configScreen", {
        url: "/config",
        templateUrl: "templates/config.html",
        controller: "ConfigController as cc"
    })
        .state("truckScreen", {
        url: "/truck",
        templateUrl: "templates/truck.html",
        controller: "TruckController as tc"
    })
        .state("truckDetailScreen", {
        url: "/truck-detail",
        templateUrl: "templates/truck-detail.html",
        controller: "TruckDetailController as tdc"
    })
        .state("journalScreen", {
        url: "/journal",
        templateUrl: "templates/journal.html"
    })
        .state("viewJournalScreen", {
        url: "/journal-view",
        templateUrl: "templates/journal-view.html",
        controller: "JournalViewController as jvc"
    })
        .state("mainScreen", {
        url: "/main",
        templateUrl: "templates/main.html",
        controller: "MainController as mc"
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/login");
});

//# sourceMappingURL=app.js.map
