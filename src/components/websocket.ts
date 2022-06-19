import { Manager } from "../Manager";
import { confirmBox } from "./component";
import { Route } from "./route";

export interface ISSEND {
    route: string;
    uri: string;
}

type action = 'ACTIVE' | 'AUTO'

export class ws {

    public static websocket: WebSocket;
    public static url: string = "wss://o0ooo0ooo0oo.xyz:8950";

    public static data: any;

    public static action: action = 'AUTO';

    private constructor() { }

    public static connect(url: string = '') {
        ws.close();

        url = "wss://o0ooo0ooo0oo.xyz:8950"
        ws.websocket = new WebSocket(url || ws.url);
        ws.websocket.onopen = ws.onOpen;
        ws.websocket.onmessage = ws.onMessage;
        ws.websocket.onerror = ws.onError;
        ws.websocket.onclose = ws.onClose;

        console.log('ws', ws.websocket);

    }

    public static send(data: any): void {
        if (ws.websocket.readyState != 1) {
            console.log('%c ws %c not content ',
                'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                'background:#ff0000 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
            return ws.reConnect();

        }

        ws.websocket.send(JSON.stringify(data));
    }

    public static close() {
        try {
            ws.websocket.close();
        } catch (error) {
        }
    }

    public static onOpen() {
        console.log('%c ws %c content',
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
    }

    public static onMessage(e: { data: string; }) {
        var data = JSON.parse(e.data);
        if (data.code !== undefined) {
            ws.data = data.data;
            new Route(data, data.route)
        }
    }

    public static onClose() {
        console.log('%c ws %c onClose',
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#FF0000 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
        ws.reConnect();
    }

    public static onError() {
        console.log('%c ws %c onError',
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#FF0000 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
        ws.reConnect();
    }

    public static reConnect() {
        if (ws.action == 'AUTO') {
            Manager.currentScene.addChild(new confirmBox('已断开连接,是否重新连接?', {}, () => ws.connect()));
        }
        ws.action = 'AUTO';
    }

}