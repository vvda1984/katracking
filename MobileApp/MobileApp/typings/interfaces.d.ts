interface Window {
    sqlitePlugin: any;
    //location: any;
    //openDatabase: any;
}

interface Navigator {
    /**
     * This plugin provides an implementation of an old version of the Network Information API.
     * It provides information about the device's cellular and wifi connection, and whether the device has an internet connection.
     */
    connection: any;
    network: {
        connection: Connection
    }
}

interface Document {
    addEventListener(type: "online", connectionStateCallback: () => any, useCapture?: boolean): void;
    addEventListener(type: "offline", connectionStateCallback: () => any, useCapture?: boolean): void;
}

interface Connection {
    type: number
}

declare var Connection: {
    UNKNOWN: number;
    ETHERNET: number;
    WIFI: number;
    CELL_2G: number;
    CELL_3G: number;
    CELL_4G: number;
    CELL: number;
    NONE: number;
}   

interface Navigator {
    app: {
        exitApp: () => any; 
    }
}