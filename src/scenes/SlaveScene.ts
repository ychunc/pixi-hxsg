import {
    Container,
    // Sprite, Texture, 
    Graphics
} from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Header, Frame, StyleText, Button } from "../components/component";
import { ws } from "../components/websocket";

export class SlaveScene extends Container implements IScene {

    public data: any;

    public n: number = 0;
    public back: Back;

    constructor() {
        super();

        let header = new Header(false);
        let frame = new Frame();


        let title = new StyleText('副将', {
            fontSize: 40,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        })
        title.y = 100;
        title.x = Manager.width / 2 - title.width / 2;
        this.addChild(title);

        let initY = 300;
        let initX = 80;
        let step = 80;

        let row = new StyleText("当前战斗力: 56000", {})
        row.y = 200;
        row.x = initX;
        this.addChild(row);

        let list = ws.data.list;
        console.log(ws.data, list);

        for (let index = 0; index < list.length; index++) {
            let item = list[index];

            let graphics = new Graphics();
            graphics.beginFill(0xFFFFFF, 0.14).drawRect(0, 0, Manager.width, 80);
            graphics.y = (initY - 16) + index * step;
            if (!(index % 2)) {
                this.addChild(graphics);
            }

            let but = new Button(item.up ? '休' : '战', { fontSize: 40 });
            but.y = initY + index * step;
            but.x = 550;
            this.addChild(but);
            but.on("pointertap", () => {
                ws.send({
                    route: 'slave',
                    uri: 'up',
                    sid: item.id,
                    up: item.up,
                })
            });

            let style = {
                fontSize: 40,
                fill: '#f7edca',
                lineJoin: "round",
                stroke: item.up ? '#d3393c' : '#140fe1',
                strokeThickness: 5,
            };
            let role = ['', '武', '文', '异']
            let txt = "(" + item.lv + "级)" + item.slave.name + "." + role[item.js]
            let row = new StyleText(txt, style)
            row.y = initY + index * step;
            row.x = initX;
            this.addChild(row);
        }


        this.addChild(frame);
        this.addChild(header);
        this.addChild(this.back = new Back(MainScene));
    }

    public update() { }
}