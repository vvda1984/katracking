class MainController {
    public data: any;
    public user: any;
    public R: any;
    //public ctrl: MainController;

    constructor(
        private $scope: angular.IScope,
        private $http: angular.IHttpService,
        private $state: any,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicHistory: any,
        private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate) {

        //this.ctrl = this;
        this.$ionicHistory.clearHistory();
        app.log.debug(this.$ionicHistory.viewHistory());

        this.$ionicSideMenuDelegate.toggleLeft(false);
        this.R = R;
        this.user = app.context.user;
        this.data = { journalGroups: app.context.getJournalGroups() };
        var ctrl = this;
        app.network.startSync(function (data, callback) {
            app.network.post(ctrl.$http, "syncJournal", data, function (response) {
                callback(response.errorMessage);
            });
        });
    }
   
    private generateJournal(id: number) {
        return {
            id: id,
            name: "JOURNAL " + id.toString(),
            description: "description",
            startLocation: "startLocation",
            startLat: 10.8646331,
            startLng: 106.7236255,
            endLocation: "endLocation",
            endLat: 10.855919,
            endLng: 106.690397,
            activeDate: "2016-12-01",
            status: 0,
            totalDistance: 0,
            totalDuration: 0,
            createdTS: null,
            lastUpdatedTS: null,
            stopPoints: [
                {
                    name: "Stop Point 1",
                    description: "Kho Hang Nguyen Dinh Chieu",
                    latitude: 10.857478,
                    longitude: 106.710553,
                },
                {
                    name: "Stop Point 2",
                    description: "Kho Hang Dien Bien Phu",
                    latitude: 10.861882,
                    longitude: 106.694857,
                }
            ],
        }
    }

    public showHideMenu(): void {
        let sideMenu = this.$ionicSideMenuDelegate;
        if (sideMenu.isOpenLeft())
            sideMenu.toggleLeft(false);
        else
            sideMenu.toggleLeft(true);
    }

    public refresh() {
        var mc = this;
        app.network.getJournals(mc.$http, mc.$ionicLoading, mc.$ionicPopup, function () {
            mc.data.journalGroups = app.context.getJournalGroups();
        });
    }

    public viewJournal(groupId: number, journalId: number) {
        let ctrl = this;
        for (let i = 0; i < this.data.journalGroups.length; i++) {
            var jg = this.data.journalGroups[i];
            if (jg.id === groupId) {
                for (let j = 0; j < jg.journals.length; j++) {
                    var journal = jg.journals[j];
                    if (journal.id === journalId) {
                        if (jg.isCurrent) {
                            app.paramters.nextState = "mainScreen";
                            app.paramters.journal = journal;
                            //this.$state.go('journalScreen');
                            this.$state.go('tab.dash');
                        } else {                                                      
                            if (app.context.hasStartedJournal()) {
                                app.paramters.allowStartJournal = false;
                            } else {
                                let today = app.utils.getCurrentDate();
                                app.paramters.allowStartJournal = journal.activeDate.replace(" 00:00:00", "") === today;
                            }
                            app.paramters.nextState = "mainScreen";
                            app.paramters.journal = journal;
                            this.$state.go('viewJournalScreen');
                        }
                        return;
                    }
                }
            }
        }
    }

    public exitApp(): void {
        let mc = this;
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
    }

    public logout(): void {
        let mc = this;
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
    }

    public openConfig(): void {
        let mc = this;
        mc.$ionicSideMenuDelegate.toggleLeft(false);
        app.paramters.nextState = "mainScreen";
        mc.$state.go("configScreen");
    }

    public openTruck(): void {
        let mc = this;
        mc.$ionicSideMenuDelegate.toggleLeft(false);
        app.paramters.allowBack = true; //.nextState = "mainScreen";
        app.paramters.nextState = "mainScreen";
        mc.$state.go("truckScreen");
    }
}