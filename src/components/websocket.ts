import { Route } from "./route";

export interface ISSEND {
    route: string;
    uri: string;
}

export class ws {

    public static websocket: WebSocket;
    public static url: string = "wss://o0ooo0ooo0oo.xyz:8950";
    public static ISContent: boolean = false;

    public static data: any;

    private constructor() { }

    public static content(url: string = '') {
        ws.close();
        url = "wss://o0ooo0ooo0oo.xyz:8950"
        ws.websocket = new WebSocket(url || ws.url);
        ws.websocket.onopen = ws.onOpen;
        ws.websocket.onmessage = ws.onMessage;
        ws.websocket.onerror = ws.onError;
        ws.websocket.onclose = ws.onClose;
    }

    public static send(data: any): void {
        if (!ws.ISContent) {
            console.log('%c ws %c not content ',
                'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                'background:#ff0000 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
            return;
        }
        try {
            ws.websocket.send(JSON.stringify(data));
        } catch (error) {
            ws.ISContent = false;
        }
    }

    public static onError() {
        ws.ISContent = false;
    }

    public static close() {
        if (ws.ISContent) {
            ws.websocket.close();
        }
        ws.ISContent = false;
    }

    public static onOpen() {
        ws.ISContent = true;

        console.log('%c ws %c content',
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');

        if (ws.ISTEST == true) {
            ws.test();
        }
    }
    public static ISTEST = false;
    public static test() {
        // ws.send({ route: "goods", uri: "list", type: 3 })
        // ws.send({ "route": "user", "uri": "sort" })
        // ws.send({ "route": "npc", "uri": "join" })
        // ws.send({ "route": "npc", "uri": "row", "data": ["0", "0", "0", "0"], "skill": [0, 0, 0, 0] })
    }

    public static onMessage(e: { data: string; }) {
        var data = JSON.parse(e.data);
        if (data.code !== undefined) {
            ws.data = data.data;
            new Route(data, data.route)
        }
    }

    public static onClose() {
    }
}