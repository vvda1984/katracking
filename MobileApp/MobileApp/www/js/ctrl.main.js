var MainController = (function () {
    function MainController($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, $ionicSideMenuDelegate) {
        this.$scope = $scope;
        this.$state = $state;
        this.$ionicLoading = $ionicLoading;
        this.$ionicPopup = $ionicPopup;
        this.$ionicHistory = $ionicHistory;
        this.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
        this.$ionicHistory.clearHistory();
        app.log.debug(this.$ionicHistory.viewHistory());
        this.$ionicSideMenuDelegate.toggleLeft(false);
        this.R = resources.language;
        this.user = app.context.user;
        this.data = {
            journalGroups: [
                {
                    id: 1,
                    name: "TEST",
                    isCurrent: true,
                    journals: [
                        this.generateJournal(1),
                        this.generateJournal(2)]
                },
                {
                    id: 2,
                    name: "2016-11-28",
                    isCurrent: false,
                    journals: [
                        this.generateJournal(3),
                        this.generateJournal(4),
                        this.generateJournal(5),]
                }],
        };
    }
    MainController.prototype.generateJournal = function (id) {
        return {
            id: id,
            name: "JOURNAL " + id.toString(),
            description: "description",
            startLocation: "startLocation",
            startLat: 0,
            startLng: 0,
            endLocation: "endLocation",
            endLat: 0,
            endLng: 0,
            activeDate: null,
            status: 0,
            createdTS: null,
            lastUpdatedTS: null,
            stopPoints: [
                {
                    name: "Stop Point 1",
                    description: "Kho Hang Nguyen Dinh Chieu",
                    latitude: 0,
                    longitude: 0,
                },
                {
                    name: "Stop Point 2",
                    description: "Kho Hang Dien Bien Phu",
                    latitude: 0,
                    longitude: 0,
                }
            ],
        };
    };
    MainController.prototype.showHideMenu = function () {
        var sideMenu = this.$ionicSideMenuDelegate;
        if (sideMenu.isOpenLeft())
            sideMenu.toggleLeft(false);
        else
            sideMenu.toggleLeft(true);
    };
    MainController.prototype.viewJournal = function (groupId, journalId) {
        for (var i = 0; i < this.data.journalGroups.length; i++) {
            var jg = this.data.journalGroups[i];
            if (jg.id === groupId) {
                for (var j = 0; j < jg.journals.length; j++) {
                    var journal = jg.journals[j];
                    if (journal.id === journalId) {
                        kapp.paramters.journal = journal;
                        this.$state.go('viewJournalScreen');
                        return;
                    }
                }
            }
        }
    };
    MainController.prototype.exitApp = function () {
        var mc = this;
        var confirmPopup = mc.$ionicPopup.confirm({
            title: mc.R.Confirm,
            template: mc.R.Exit + "?",
        });
        confirmPopup.then(function (res) {
            if (res) {
                mc.$ionicSideMenuDelegate.toggleLeft(false);
                navigator.app.exitApp();
            }
        });
    };
    MainController.prototype.logout = function () {
        var mc = this;
        var confirmPopup = mc.$ionicPopup.confirm({
            title: mc.R.Confirm,
            template: mc.R.Logout + "?",
        });
        confirmPopup.then(function (res) {
            if (res) {
                mc.$ionicSideMenuDelegate.toggleLeft(false);
                app.context.clear();
                mc.$state.go("loginScreen");
            }
        });
    };
    MainController.prototype.openConfig = function () {
        var mc = this;
        mc.$ionicSideMenuDelegate.toggleLeft(false);
        app.paramters.nextState = "mainScreen";
        mc.$state.go("configScreen");
    };
    MainController.prototype.openTruck = function () {
        var mc = this;
        mc.$ionicSideMenuDelegate.toggleLeft(false);
        app.paramters.allowBack = true; //.nextState = "mainScreen";
        app.paramters.nextState = "mainScreen";
        mc.$state.go("truckScreen");
    };
    return MainController;
}());

//# sourceMappingURL=ctrl.main.js.map
