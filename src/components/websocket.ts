import { Manager } from "../Manager";
import { LoginScene } from "../scenes/LoginScene";
import { confirmBox } from "./component";
import { Route } from "./route";

export interface ISSEND {
    route: string;
    uri: string;
}

type action = 'ACTIVE' | 'AUTO'

export class ws {

    public static websocket: WebSocket;
    public static url: string = "ws://" + location.hostname + ":8950";

    public static data: any;

    public static action: action = 'AUTO';

    private constructor() { }

    public static connect(url: string = '') {
        ws.close();

        switch (window.location.host.split('.')[0]) {
            case "hxsg":
                url = "ws://47.100.109.35:8950"
                break;
        }

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
        console.log('send...', data);

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

        if (data.type == 'ping') {
            ws.websocket.send(JSON.stringify({ route: "pong" }));
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
        ws.reConnect('服务器未响应');
    }

    public static confirmBox: confirmBox;

    public static reConnect(mes: string = '已断开连接,是否重新连接?') {
        // 自动断开提示
        if (ws.action == 'AUTO') {
            if (this.confirmBox) this.confirmBox.destroy();
            Manager.currentScene.addChild(this.confirmBox = new confirmBox(mes,
                () => ws.connect(),
                () => Manager.changeScene(new LoginScene))
            );
        }
        ws.action = 'AUTO';
    }

}