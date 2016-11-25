var KeyedCollection = (function () {
    function KeyedCollection() {
        this.items = {};
        this.count = 0;
    }
    KeyedCollection.prototype.ContainsKey = function (key) {
        return this.items.hasOwnProperty(key);
    };
    KeyedCollection.prototype.Count = function () {
        return this.count;
    };
    KeyedCollection.prototype.Add = function (key, value) {
        this.items[key] = value;
        this.count++;
    };
    KeyedCollection.prototype.Remove = function (key) {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    };
    KeyedCollection.prototype.Item = function (key) {
        return this.items[key];
    };
    KeyedCollection.prototype.Keys = function () {
        var keySet = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    };
    KeyedCollection.prototype.Values = function () {
        var values = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    };
    return KeyedCollection;
}());
var LogSeverity;
(function (LogSeverity) {
    LogSeverity[LogSeverity["Undefined"] = 0] = "Undefined";
    LogSeverity[LogSeverity["Debug"] = 1] = "Debug";
    LogSeverity[LogSeverity["Info"] = 2] = "Info";
    LogSeverity[LogSeverity["Error"] = 4] = "Error";
})(LogSeverity || (LogSeverity = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Error"] = -1] = "Error";
    ResponseStatus[ResponseStatus["Success"] = 0] = "Success";
})(ResponseStatus || (ResponseStatus = {}));

//# sourceMappingURL=predefine.js.map
