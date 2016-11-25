var JournalController = (function () {
    function JournalController($ionicHistory) {
        this.$ionicHistory = $ionicHistory;
        app.log.debug(this.$ionicHistory.viewHistory());
    }
    return JournalController;
}());
var JournalViewController = (function () {
    function JournalViewController($ionicHistory) {
        this.$ionicHistory = $ionicHistory;
        app.log.debug(this.$ionicHistory.viewHistory());
        this.journal = kapp.paramters.journal;
    }
    return JournalViewController;
}());

//# sourceMappingURL=ctrl.journal.js.map
