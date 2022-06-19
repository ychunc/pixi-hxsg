import { Graphics } from "pixi.js";
import { IScene, Manager, Container } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Header, Frame, StyleText, Button, SceneTite, confirmBox } from "../components/component";
import { ws } from "../components/websocket";

export class SlaveScene extends Container implements IScene {

    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTite('副将')

        // app bakcgroupd
        Manager.backgroundColor(0x010134);

        let initY = 300;
        let initX = 80;
        let step = 80;

        let row = new StyleText("当前战斗力: 56000", {})
        row.y = 200;
        row.x = initX;
        this.addChild(row);

        let list = SlaveScene.data.list;

        for (let index = 0; index < list.length; index++) {
            let item = list[index];

            let graphics = new Graphics();
            graphics.beginFill(0xFFFFFF, 0.14).drawRect(0, 0, Manager.width, 80);
            graphics.y = (initY - 16) + index * step;
            if (!(index % 2)) {
                this.addChild(graphics);
            }

            let but = new Button(item.up ? '休' : '战', { fontSize: 42 });
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
            row.on("pointertap", () => {
                Manager.changeScene(new SlaveDetailScene(item));
            });

            this.addChild(row);
        }

        this.addChild(frame, header, title, new Back(MainScene));
    }

}

export class SlaveDetailScene extends Container implements IScene {
    public data: any;
    constructor(slave: any) {
        super();

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('副将:' + slave.slave.name);

        console.log(slave);

        let but = new Button('解雇副将', { fontSize: 42 });
        but.x = 400;
        but.y = Manager.height * 0.8;

        but.on('pointertap', () => {
            new confirmBox('确定要解雇副将吗?', {}, () => {
                console.log('ws send');
                
                ws.send({ route: 'slave', uri: "del", id: slave.id })
            })
        })

        this.addChild(but);

        this.addChild(frame, header, title, new Back(SlaveScene));
    }
}