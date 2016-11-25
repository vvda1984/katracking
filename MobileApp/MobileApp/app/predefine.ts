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
    getSettings(callback): void;
    saveSettings(settings: Array<any>, callback): void;
    getUserContext(userId: number, callback: (result: IQueryResult) => any): void;
    saveUserContext(userId: number, userName: string, value: string, callback: (result: IQueryResult) => any): void;
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