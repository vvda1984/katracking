var DB_NAME = "kamobile-v1.db";
var DB_ALIAS = "kamobile-v1.db";
var DB_VERSION = "2.0";
var DB_SIZE = 500 * 1024 * 1024;
var DB_SETTINGS_TBL = "settings";
var DB_USER_CONTEXTS_TBL = "userContexts";
var DB_JOURNAL_TBL = "journals";
var DB_JOURNAL_STOPPOINTS_TBL = "jrl_deliveries";
var DB_JOURNAL_ACTIVITIES_TBL = "jrl_activities";
var DB_JOURNAL_LOCATIONS_TBL = "jrl_locations";
var LocalStorageDB = (function () {
    function LocalStorageDB() {
    }
    LocalStorageDB.prototype.createTable = function (tx, name, columns) {
        var columnsSql = "";
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (i > 0)
                columnsSql += ", ";
            columnsSql += (column.name + " " + column.type + " " + column.extra);
        }
        var sql = "CREATE TABLE IF NOT EXISTS [" + name + "](" + columnsSql + ")";
        kapp.log.debug(sql);
        tx.executeSql(sql, [], function (tx) {
            kapp.log.debug("Create table " + name + " successfully");
        }, function (tx, dberr) {
            kapp.log.error("Error while create table " + name + ": " + dberr.message);
        });
    };
    LocalStorageDB.prototype.initialize = function (callback) {
        kapp.log.debug("Initialize database");
        this.db = window.openDatabase(DB_NAME, DB_VERSION, DB_ALIAS, DB_SIZE);
        var api = this;
        this.db.transaction(function (tx) {
            kapp.log.debug("Check to create table: " + DB_SETTINGS_TBL);
            api.createTable(tx, DB_SETTINGS_TBL, [
                { name: "name", type: "TEXT", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },
                { name: "value", type: "TEXT", extra: "" }
            ]);
            kapp.log.debug("Check to create table: " + DB_USER_CONTEXTS_TBL);
            api.createTable(tx, DB_USER_CONTEXTS_TBL, [
                { name: "userId", type: "INT", extra: "PRIMARY KEY NOT NULL" },
                { name: "userName", type: "TEXT", extra: "NOT NULL COLLATE NOCASE" },
                { name: "value", type: "TEXT", extra: "NULL" }
            ]);
            //kapp.log.debug("Check to create table: " + DB_JOURNAL_TBL);
            //api.createTable(tx, DB_JOURNAL_TBL, [                
            //    { name: "id", type: "INT", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },                
            //    { name: "userId", type: "INT", extra: "NOT NULL" },
            //    { name: "name", type: "TEXT", extra: "NOT NULL" },
            //    { name: "description", type: "TEXT", extra: "NULL" },
            //    { name: "startLocation", type: "TEXT", extra: "NOT NULL" },
            //    { name: "startLat", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "startLng", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "endLocation", type: "TEXT", extra: "NOT NULL" },
            //    { name: "endLat", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "endLng", type: "INT", extra: "NOT NULL" },
            //    { name: "activeDate", type: "TEXT", extra: "NOT NULL" },
            //    { name: "status", type: "INT", extra: "NOT NULL" },
            //    { name: "extendedData", type: "TEXT", extra: "NULL" },
            //    { name: "createdTS", type: "TEXT", extra: "NOT NULL" },
            //    { name: "lastUpdatedTS", type: "TEXT", extra: "NOT NULL" }
            //]);
            //kapp.log.debug("Check to create table: " + DB_JOURNAL_STOPPOINTS_TBL);
            //api.createTable(tx, DB_JOURNAL_STOPPOINTS_TBL, [                
            //    { name: "id", type: "INT", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },            
            //    { name: "journalId", type: "INT", extra: "NOT NULL" },
            //    { name: "mame", type: "TEXT", extra: "NOT NULL" },
            //    { name: "description", type: "TEXT", extra: "NOT NULL" },
            //    { name: "latitude", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "longitude", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "extendedData", type: "TEXT", extra: "NULL" },
            //    { name: "createdTS", type: "TEXT", extra: "NOT NULL" },
            //    { name: "lastUpdatedTS", type: "TEXT", extra: "NOT NULL" }
            //]);
            //kapp.log.debug("Check to create table: " + DB_JOURNAL_ACTIVITIES_TBL);
            //api.createTable(tx, DB_JOURNAL_ACTIVITIES_TBL, [
            //    { name: "id", type: "INT", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },
            //    { name: "journalId", type: "INT", extra: "NOT NULL" },
            //    { name: "userId", type: "INT", extra: "NOT NULL" },
            //    { name: "activityId", type: "INT", extra: "NOT NULL" },
            //    { name: "activityDetail", type: "TEXT", extra: "NULL" },
            //    { name: "extendedData", type: "TEXT", extra: "NULL" },
            //    { name: "createdTS", type: "TEXT", extra: "NOT NULL" },
            //    { name: "lastUpdatedTS", type: "TEXT", extra: "NOT NULL" }
            //]);       
            //kapp.log.debug("Check to create table: " + DB_JOURNAL_LOCATIONS_TBL);
            //api.createTable(tx, DB_JOURNAL_LOCATIONS_TBL, [
            //    { name: "id", type: "INT", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },
            //    { name: "journalId", type: "INT", extra: "NOT NULL" },
            //    { name: "UserId", type: "INT", extra: "NOT NULL" },
            //    { name: "TruckId", type: "INT", extra: "NULL" },
            //    { name: "latitude", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "longitude", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "accuracy", type: "FLOAT", extra: "NOT NULL" },
            //    { name: "stopCount", type: "INT", extra: "NOT NULL" },
            //    { name: "status", type: "INT", extra: "NULL" },
            //    { name: "createdTS", type: "TEXT", extra: "NOT NULL" },
            //    { name: "lastUpdatedTS", type: "TEXT", extra: "NOT NULL" }
            //]);
            setTimeout(function () { callback({ errorMessage: null }); }, 1000);
            //setTimeout(function () { callback(new QueryResult()); }, 1000);
        }, function (txerror) {
            kapp.log.error(txerror.errorMessage);
            callback({ errorMessage: "Cannot open db transation!" });
        });
    };
    LocalStorageDB.prototype.initializeForUser = function (callback) {
        kapp.log.debug("Initialize database");
        this.db = window.openDatabase(DB_NAME, DB_VERSION, DB_ALIAS, DB_SIZE);
        var api = this;
        this.db.transaction(function (tx) {
            kapp.log.debug("Check to create table: " + app.context.DB_JOURNAL_TBL);
            api.createTable(tx, app.context.DB_JOURNAL_TBL, [
                { name: "id", type: "INT", extra: "PRIMARY KEY NOT NULL" },
                { name: "name", type: "TEXT", extra: "NULL" },
                { name: "status", type: "INT", extra: "NULL" },
                { name: "value", type: "TEXT", extra: "NULL" }
            ]);
            kapp.log.debug("Check to create table: " + app.context.DB_JOURNAL_ACTIVITIES_TBL);
            api.createTable(tx, app.context.DB_JOURNAL_ACTIVITIES_TBL, [
                { name: "id", type: "INTEGER", extra: "PRIMARY KEY AUTOINCREMENT" },
                { name: "journalId", type: "INT", extra: "NOT NULL" },
                { name: "value", type: "INT", extra: "NOT NULL" },
                { name: "syncStatus", type: "INT", extra: "NOT NULL" }
            ]);
            kapp.log.debug("Check to create table: " + app.context.DB_JOURNAL_LOCATIONS_TBL);
            api.createTable(tx, app.context.DB_JOURNAL_LOCATIONS_TBL, [
                { name: "id", type: "INT", extra: "PRIMARY KEY AUTOINCREMENT" },
                { name: "journalId", type: "INT", extra: "NOT NULL" },
                { name: "driverId", type: "INT", extra: "NOT NULL" },
                { name: "truckId", type: "INT", extra: "NULL" },
                { name: "latitude", type: "FLOAT", extra: "NOT NULL" },
                { name: "longitude", type: "FLOAT", extra: "NOT NULL" },
                { name: "accuracy", type: "FLOAT", extra: "NOT NULL" },
                { name: "stopCount", type: "INT", extra: "NOT NULL" },
                { name: "syncStatus", type: "INT", extra: "NOT NULL" },
                { name: "createdTS", type: "TEXT", extra: "NOT NULL" }
            ]);
            setTimeout(function () { callback({ errorMessage: null }); }, 1000);
            //setTimeout(function () { callback(new QueryResult()); }, 1000);
        }, function (txerror) {
            kapp.log.error(txerror.errorMessage);
            callback({ errorMessage: "Cannot open db transation!" });
        });
    };
    LocalStorageDB.prototype.getSettings = function (callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            //var errResult = new QueryResult();
            //errResult.errorMessage = "Database was not initialized";
            //callback(errResult);
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + DB_SETTINGS_TBL;
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ rows: dbres.rows, transaction: tx });
                //let result = new QueryResult();
                //result.rows = dbres.rows;
                //result.dbtransaction = tx;
                //callback(result);
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
                //let result = new QueryResult();
                //result.errorObject = dberr;
                //result.errorMessage = dberr.message;
                //callback(result);
            });
        });
    };
    LocalStorageDB.prototype.saveSettings = function (settings, callback) {
        this.db.transaction(function (tx) {
            for (var i = 0; i < settings.length; i++) {
                var setting = settings[i];
                var sql = "INSERT OR REPLACE INTO " + DB_SETTINGS_TBL + " VALUES (";
                sql = sql.concat("'", setting.name, "', ");
                sql = sql.concat("'", setting.value, "')");
                kapp.log.debug(sql);
                tx.executeSql(sql, [], function () { }, function (tx, dberr) { kapp.log.debug(dberr.errorMessage); });
            }
            callback({ transaction: tx });
            //callback(new QueryResult());
        }, function (txerror) {
            kapp.log.error(txerror.errorMessage);
            callback({ errorMessage: "Cannot open db transation!" });
            //var result = new QueryResult();
            //result.errorMessage = "Cannot open db transation!";
            //callback(result);
        });
    };
    LocalStorageDB.prototype.getUserContext = function (userId, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + DB_USER_CONTEXTS_TBL + " WHERE userId = " + userId.toString() + " LIMIT 1";
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ rows: dbres.rows, transaction: tx });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.saveUserContext = function (userId, userName, value, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + DB_USER_CONTEXTS_TBL + " WHERE userId = " + userId.toString() + " LIMIT 1";
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                var sql = "";
                if (dbres.rows.length > 0) {
                    sql = "UPDATE " + DB_USER_CONTEXTS_TBL + " SET value = '" + value + "' WHERE userId = " + userId.toString();
                }
                else {
                    sql = "INSERT INTO " + DB_USER_CONTEXTS_TBL + " VALUES (" +
                        userId.toString() + "," +
                        "'" + userName + "'," +
                        "'" + value + "'" +
                        ")"; // userId,
                }
                kapp.log.debug(sql);
                tx.executeSql(sql, [], function (tx, dbres) {
                    callback({ transaction: tx });
                }, function (tx, dberr) {
                    callback({ errorMessage: dberr.message, transaction: tx });
                });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.getJournals = function (callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + app.context.DB_JOURNAL_TBL +
                " WHERE status in (" + JournalStatus.Actived.toString() + ", " + JournalStatus.Actived.toString() + " )";
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ rows: dbres.rows, transaction: tx });
                //let journals = [];
                //for (let i = 0; i < dbres.rows.length; i++) {
                //    journals.push(JSON.parse(dbres.rows.item(i).value));
                //}
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.addActivity = function (activity, syncStatus, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "INSERT INTO " + app.context.DB_JOURNAL_ACTIVITIES_TBL + " VALUES (";
            sql = sql.concat(activity.journalId.toString(), ", ");
            sql = sql.concat("'", JSON.stringify(activity), ", ");
            sql = sql.concat(syncStatus.toString(), ")");
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ transaction: tx });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.getActivities = function (syncStatus, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + app.context.DB_JOURNAL_ACTIVITIES_TBL + " WHERE syncStatus = " + syncStatus.toString();
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ rows: dbres.rows, transaction: tx });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.updateActivitiesStatus = function (ids, syncStatus, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var combinedIds = "";
        for (var i = 0; i < ids.length; i++) {
            if (i > 0)
                combinedIds = combinedIds.concat(",", ids[i].toString());
            else
                combinedIds = ids[i].toString();
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "UPDATE " + app.context.DB_JOURNAL_ACTIVITIES_TBL + " SET syncStatus = " + syncStatus.toString() +
                " WHERE id in (" + combinedIds + ")";
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ transaction: tx });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.getJournalActivities = function (journalId, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + app.context.DB_JOURNAL_ACTIVITIES_TBL + " WHERE journalId = " + journalId.toString();
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ rows: dbres.rows, transaction: tx });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.addLocation = function (location, syncStatus, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + app.context.DB_JOURNAL_LOCATIONS_TBL + " ORDER BY column DESC LIMIT 1;";
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                var isAddNew = true;
                var id = -1;
                var stopCount = 0;
                if (dbres.rows.length > 0) {
                    var lastLocation = dbres.rows.item(0);
                    var distance = app.utils.getDistance({ lat: location.latitude, lng: location.longitude }, { lat: lastLocation.latitude, lng: location.longitude });
                    isAddNew = (distance >= app.config.acceptedDistance);
                    id = lastLocation.id;
                    stopCount = lastLocation.stopCount + 1;
                }
                var sql = "";
                if (isAddNew) {
                    sql = "INSERT INTO " + app.context.DB_JOURNAL_LOCATIONS_TBL + " VALUES (";
                    sql = sql.concat(location.journalId.toString(), ", ");
                    sql = sql.concat(location.driverId.toString(), ", ");
                    sql = sql.concat(location.truckId.toString(), ", ");
                    sql = sql.concat(location.latitude.toString(), ", ");
                    sql = sql.concat(location.longitude.toString(), ", ");
                    sql = sql.concat(location.accuracy.toString(), ", ");
                    sql = sql.concat(location.stopCount.toString(), ", ");
                    sql = sql.concat(syncStatus.toString(), ", ");
                    sql = sql.concat("'", location.createdTS, "')");
                }
                else {
                    sql = "UPDATE " + app.context.DB_JOURNAL_LOCATIONS_TBL + " SET stopCount = " + stopCount.toString() +
                        " WHERE id = " + id.toString();
                }
                tx.executeSql(sql, [], function (tx, dbres) {
                    callback({ transaction: tx });
                }, function (tx, dberr) {
                    callback({ errorMessage: dberr.message, transaction: tx });
                });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.getLocations = function (syncStatus, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "SELECT * FROM " + app.context.DB_JOURNAL_LOCATIONS_TBL + " WHERE status = " + syncStatus.toString();
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ rows: dbres.rows, transaction: tx });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    LocalStorageDB.prototype.updateLocationsStatus = function (ids, syncStatus, callback) {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }
        var combinedIds = "";
        for (var i = 0; i < ids.length; i++) {
            if (i > 0)
                combinedIds = combinedIds.concat(",", ids[i].toString());
            else
                combinedIds = ids[i].toString();
        }
        var _this = this;
        this.db.transaction(function (tx) {
            var sql = "UPDATE " + app.context.DB_JOURNAL_LOCATIONS_TBL + " SET syncStatus = " + syncStatus.toString() +
                " WHERE id in (" + combinedIds + ")";
            kapp.log.debug(sql);
            tx.executeSql(sql, [], function (tx, dbres) {
                callback({ transaction: tx });
            }, function (tx, dberr) {
                callback({ errorMessage: dberr.message, transaction: tx });
            });
        });
    };
    return LocalStorageDB;
}());

//# sourceMappingURL=localStorageDB.js.map
