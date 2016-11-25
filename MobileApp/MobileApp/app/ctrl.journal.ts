class JournalController {
    constructor(private $ionicHistory: any) {
        app.log.debug(this.$ionicHistory.viewHistory());
    }
}

class JournalViewController {
    public journal: any;
    constructor(private $ionicHistory: any) {
        app.log.debug(this.$ionicHistory.viewHistory());
        this.journal = kapp.paramters.journal;
    }
}