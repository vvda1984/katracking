class MainController {
    public data: any;
    public user: any;
    public R: any;

    constructor(
        private $scope: angular.IScope,
        private $state: any,
        private $ionicLoading: ionic.loading.IonicLoadingService,
        private $ionicPopup: ionic.popup.IonicPopupService,
        private $ionicHistory: any,
        private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate) {

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

    private generateJournal(id: number) {
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
        }
    }

    public showHideMenu(): void {
        let sideMenu = this.$ionicSideMenuDelegate;
        if (sideMenu.isOpenLeft())
            sideMenu.toggleLeft(false);
        else
            sideMenu.toggleLeft(true);
    }

    public viewJournal(groupId: number, journalId: number) {
        for (let i = 0; i < this.data.journalGroups.length; i++) {
            var jg = this.data.journalGroups[i];
            if (jg.id === groupId) {
                for (let j = 0; j < jg.journals.length; j++) {
                    var journal = jg.journals[j];
                    if (journal.id === journalId) {
                        kapp.paramters.journal = journal;
                        this.$state.go('viewJournalScreen');
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