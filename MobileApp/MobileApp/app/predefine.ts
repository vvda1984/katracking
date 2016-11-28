interface IKeyedCollection<T> {
    Add(key: string, value: T);
    ContainsKey(key: string): boolean;
    Count(): number;
    Item(key: string): T;
    Keys(): string[];
    Remove(key: string): T;
    Values(): T[];
}

class KeyedCollection<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};

    private count: number = 0;

    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public Count(): number {
        return this.count;
    }

    public Add(key: string, value: T) {
        this.items[key] = value;
        this.count++;
    }

    public Remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }

    public Item(key: string): T {
        return this.items[key];
    }

    public Keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public Values(): T[] {
        var values: T[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }
}

interface IDatabaseAPI {
    initialize(callback): void;
    initializeForUser(callback: (result: IQueryResult) => any): void;
    getSettings(callback): void;
    saveSettings(settings: Array<any>, callback): void;
    getUserContext(userId: number, callback: (result: IQueryResult) => any): void;
    saveUserContext(userId: number, userName: string, value: string, callback: (result: IQueryResult) => any): void;
    getJournals(callback: (result: IQueryResult) => any): void;
    addActivity(activity: IJournalActivity, syncStatus: SyncStatus, callback: (result: IQueryResult) => any): void;
    getActivities(syncStatus: SyncStatus, callback: (result: IQueryResult) => any): void;
    updateActivitiesStatus(ids: Array<number>, syncStatus: SyncStatus, callback: (result: IQueryResult) => any): void;
    getJournalActivities(journalId: number, callback: (result: IQueryResult) => any): void;
    addLocation(location: IJournalLocation, syncStatus: SyncStatus, callback: (result: IQueryResult) => any): void;
    getLocations(syncStatus: number, callback: (result: IQueryResult) => any): void;
    updateLocationsStatus(ids: Array<number>, syncStatus: SyncStatus, callback: (result: IQueryResult) => any): void;
}

interface IQueryResult {
    errorMessage?: string;
    rows?: any;
    transaction?: any;
    tag?: any;
}

interface IPostResult {
    errorMessage?: string;
    data?: any;
}

interface IResponseData {
    status?: number;
    errorMessage?: string;
    data?: any;
}

interface IUser {
    id: number;
    userName: string;
    role: number;
    firstName: string;
    lastName: string;
    ssn: string;
    address: string;
    dob: string;
    phone: string;
    email: string;
    note: string;
    status: number;
    createdTS: string;
    lastUpdatedTS: string;
}

interface ITruck {
    id: number;
    name: string;
    number: string;
    description: string;
    status: number;
    createdTS: string;
    lastUpdatedTS: string;
    isSelected?: boolean;
}

interface IUserContext {
    truck? : ITruck,
}

enum LogSeverity {
    Undefined = 0,
    Debug = 1,
    Info = 2,
    Error = 4,
}

enum ResponseStatus {
    Error = -1,
    Success = 0,
}

enum SyncStatus {
    Sync = 0,
    Unsync = 1,    
}

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

enum JournalStatus {
    Actived = 0,
    Started = 2,
    Completed = 3,
    Deleted = 4,
    Cancelled = 5,
}

enum JournalActivity {
    BatDauHanhTrinh = 1,
    DenDiemNhanHang = 2,
    XuatPhat = 3,
    TacDuong = 4,
    XeHong = 5,
    DenDienTraHang = 6,
    BatDauTraHang = 7,
    KetThucTraHang = 8,
    GuiThongBao = 9,
    ThoatHanhTrinh = 10,
    KetThucHanhTrinh = 11,
    TroLaiHanhTrinh = 12,
}

interface IJournalActivity {
    activityId: number;
    journalId: number;
    driverId: number;
    truckId: number;
    activityDetail: string;   
    activityName: string;
    createdTS: string;    
    extendedData: string;
    token?: string;    
}

interface IJournalLocation {
    journalId: number;
    driverId: number;
    truckId: number;
    latitude: number;
    longitude: number;
    accuracy: number;
    createdTS: string;
    address?: string;
    stopCount?: number;    
    token?: string;    
}

interface IPoint {
    lat: number;
    lng: number;
    acc?: number;
}

interface IGetLocationResponse {
    errorMessage?: string,
    lat?: number;
    lng?: number;
    acc?: number;
}