// import { sound } from "@pixi/sound";
import { Manager } from "../Manager";
import { LoginScene } from "../scenes/LoginScene";
import { confirmBox } from "./component";
import { Route } from "./route";

export interface ISSEND {
    route: string;
    uri: string;
}

type action = 'ACTIVE' | 'AUTO'

export class Ws {

    public static websocket: WebSocket;
    public static url: string = "ws://" + location.hostname + ":8950";

    public static data: any;

    public static action: action = 'AUTO';

    private constructor() { }

    public static connect(url: string = '') {
        Ws.close();

        switch (window.location.host.split('.')[0]) {
            case "hxsg":
                url = "ws://47.100.109.35:8950"
                break;
        }

        Ws.websocket = new WebSocket(url || Ws.url);
        Ws.websocket.onopen = Ws.onOpen;
        Ws.websocket.onmessage = Ws.onMessage;
        Ws.websocket.onerror = Ws.onError;
        Ws.websocket.onclose = Ws.onClose;

        console.log('ws', Ws.websocket);

    }

    public static send(data: any): void {
        if (Ws.websocket.readyState != 1) {
            console.log('%c ws %c not content ',
                'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                'background:#ff0000 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
            return Ws.reConnect();

        }
        console.log('send...', data);
        // 点击声音
        // sound.play('click');
        // 发送数据
        Ws.websocket.send(JSON.stringify(data));
    }

    public static close() {
        try {
            Ws.websocket.close();
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
            Ws.data = data.data;
            new Route(data, data.route)
        }

        if (data.type == 'ping') {
            Ws.websocket.send(JSON.stringify({ route: ["Tool", "pong"] }));
        }
    }

    public static onClose() {
        console.log('%c ws %c onClose',
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#FF0000 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
        Ws.reConnect();
    }

    public static onError() {
        console.log('%c ws %c onError',
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#FF0000 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
        Ws.reConnect('服务器未响应');
    }

    public static confirmBox: confirmBox;

    public static reConnect(mes: string = '已断开连接,是否重新连接?') {
        // 自动断开提示
        // if (Ws.action == 'AUTO') {
        if (this.confirmBox) this.confirmBox.destroy();
        Manager.currentScene.addChild(this.confirmBox = new confirmBox(mes,
            () => Ws.connect(),
            () => Manager.changeScene(new LoginScene))
        );
        // }
        Ws.action = 'AUTO';
    }

}