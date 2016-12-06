/// <reference path="../typings/index.d.ts" />

angular.module("starter", ["ionic", "ngCordova", "starter.controllers", "starter.services"])
    .run(($ionicPlatform: ionic.platform.IonicPlatformService,
        $ionicLoading: ionic.loading.IonicLoadingService,
        $ionicPopup: ionic.popup.IonicPopupService) => {
        $ionicPlatform.ready(() => {
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

            kapp.db.initialize(function (initDBResult: IQueryResult) {
                if (kapp.utils.isEmpty(initDBResult.errorMessage)) {
                    kapp.log.debug("Initialize database successfully");
                    kapp.isReady = true;

                    kapp.db.getSettings(function (result: IQueryResult) {
                        $ionicLoading.hide();
                        if (kapp.utils.isEmpty(result.errorMessage)) {
                            for (var i = 0; i < result.rows.length; i++) {
                                var row = result.rows.item(i);
                                kapp.config.setValue(row.name, row.value);
                            }
                            kapp.config.updateBaseURL();
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: "Error",
                                template: result.errorMessage
                            });
                        }
                    });
                } else {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: "Error",
                        template: initDBResult.errorMessage
                    });
                }
            });

            try {
                // Android customization
                cordova.plugins.backgroundMode.setDefaults({ text: 'KA Logistic.' });
                // Enable background mode
                cordova.plugins.backgroundMode.enable();
                // Called when background mode has been activated
                cordova.plugins.backgroundMode.onactivate = function () {
                    setTimeout(function () {
                        // Modify the currently displayed notification
                        cordova.plugins.backgroundMode.configure({
                            text: 'Running in background.'
                        });
                    }, 5000);
                };

                cordova.plugins.backgroundMode.ondeactivate = function () {

                };
            }
            catch (err) {
                app.log.error(err);
            }
        });
    })
    .config(($stateProvider: any, $urlRouterProvider: any) => {
        $stateProvider
            // main screen
            .state("mainScreen", {
                url: "/main",
                cache: false,
                templateUrl: "templates/main.html",
                controller: "MainController as mc"
            })

            // login screen
            .state("loginScreen", {
                url: "/login",
                cache: false,
                templateUrl: "templates/login.html",
                controller: "LoginController as lc"
            })

            // config screen
            .state("configScreen", {
                url: "/config",
                templateUrl: "templates/config.html",
                controller: "ConfigController as cc"
            })

            // truck screen
            .state("truckScreen", {
                url: "/truck",
                templateUrl: "templates/truck.html",
                controller: "TruckController as tc"
            })

            // truck screen
            .state("truckDetailScreen", {
                url: "/truck-detail",
                templateUrl: "templates/truck-detail.html",
                controller: "TruckDetailController as tdc"
            })

            // test map screen
            .state("testMapScreen", {
                cache: false,
                url: "/testmap",
                templateUrl: "templates/map.html",
                controller: "TestMapController as tmc"
            })

            // view journal screen
            .state("viewJournalScreen", {
                cache: false,
                url: "/journal-view",
                templateUrl: "templates/journal-view.html",
                controller: "JournalViewController as jvc"
            })

            // view journal screen
            .state("tab", {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/journal-tabs.html"
            })
            .state("tab.dash", {
                url: "/dash",
                views: {
                    "tab-dash": {
                        templateUrl: "templates/journal-dash.html",
                        controller: "JournalDashController as jdc"
                    }
                }
            })
            .state("tab.map", {
                url: "/map",
                views: {
                    "tab-map": {
                        templateUrl: "templates/journal-map.html",
                        controller: "JournalMapController as jmc"
                    }
                }
            })
            .state("tab.activity", {
                url: "/activity",
                views: {
                    "tab-activity": {
                        templateUrl: "templates/journal-activity.html",
                        controller: "JournalActivityController as jac"
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/login");
    });