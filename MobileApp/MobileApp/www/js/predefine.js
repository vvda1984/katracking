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
var SyncStatus;
(function (SyncStatus) {
    SyncStatus[SyncStatus["Sync"] = 0] = "Sync";
    SyncStatus[SyncStatus["Unsync"] = 1] = "Unsync";
})(SyncStatus || (SyncStatus = {}));
var predefinedActions = [
    {
        id: 1,
        name: "Bắt Đầu",
        description: "",
    },
    {
        id: 2,
        name: "Đến Điểm Nhận Hàng",
        description: "",
    },
    {
        id: 3,
        name: "Xuất Phát",
        description: "",
    },
    {
        id: 4,
        name: "Tắc Đường",
        description: "",
    },
    {
        id: 5,
        name: "Xe Hỏng",
        description: "",
    },
    {
        id: 6,
        name: "Đến Điểm Trả Hàng",
        description: "",
    },
    {
        id: 7,
        name: "Bắt Đầu Trả Hàng",
        description: "",
    },
    {
        id: 8,
        name: "Kết Thúc Trả Hàng",
        description: "",
    },
    {
        id: 9,
        name: "Gửi Thông Báo",
        description: "",
    },
    {
        id: 10,
        name: "Thoát Hành Trình",
        description: "",
    },
    {
        id: 11,
        name: "Trở Lại Hành Trình",
        description: "",
    },
    {
        id: 12,
        name: "Kết Thúc",
        description: "",
    },
];
var JournalStatus;
(function (JournalStatus) {
    JournalStatus[JournalStatus["Actived"] = 0] = "Actived";
    JournalStatus[JournalStatus["Started"] = 2] = "Started";
    JournalStatus[JournalStatus["Completed"] = 3] = "Completed";
    JournalStatus[JournalStatus["Deleted"] = 4] = "Deleted";
    JournalStatus[JournalStatus["Cancelled"] = 5] = "Cancelled";
})(JournalStatus || (JournalStatus = {}));
var JournalActivity;
(function (JournalActivity) {
    JournalActivity[JournalActivity["BatDauHanhTrinh"] = 1] = "BatDauHanhTrinh";
    JournalActivity[JournalActivity["DenDiemNhanHang"] = 2] = "DenDiemNhanHang";
    JournalActivity[JournalActivity["XuatPhat"] = 3] = "XuatPhat";
    JournalActivity[JournalActivity["TacDuong"] = 4] = "TacDuong";
    JournalActivity[JournalActivity["XeHong"] = 5] = "XeHong";
    JournalActivity[JournalActivity["DenDienTraHang"] = 6] = "DenDienTraHang";
    JournalActivity[JournalActivity["BatDauTraHang"] = 7] = "BatDauTraHang";
    JournalActivity[JournalActivity["KetThucTraHang"] = 8] = "KetThucTraHang";
    JournalActivity[JournalActivity["GuiThongBao"] = 9] = "GuiThongBao";
    JournalActivity[JournalActivity["ThoatHanhTrinh"] = 10] = "ThoatHanhTrinh";
    JournalActivity[JournalActivity["KetThucHanhTrinh"] = 11] = "KetThucHanhTrinh";
    JournalActivity[JournalActivity["TroLaiHanhTrinh"] = 12] = "TroLaiHanhTrinh";
})(JournalActivity || (JournalActivity = {}));

//# sourceMappingURL=predefine.js.map
