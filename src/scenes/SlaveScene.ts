import { Container, Graphics } from "pixi.js";
import { IScene, Manager, ManageContainer } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Header, Frame, StyleText, Button, SceneTite, confirmBox } from "../components/component";
import { ws } from "../components/websocket";

export class SlaveScene extends ManageContainer implements IScene {

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

            let but = new Button(item.up ? '休' : '战', { fontSize: 46 }, 0x4e50b5);
            but.y = initY + index * step - 4;
            but.x = 550;
            this.addChild(but);
            but.on("pointertap", () => {
                ws.send({ route: 'slave', uri: 'up', sid: item.id, up: item.up })
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
                SlaveDetailScene.data = item;
                SlaveDetailScene.selectedIndex = index;
                Manager.changeScene(new SlaveDetailScene());
            });

            this.addChild(row);
        }

        this.addChild(frame, header, title, new Back(MainScene));
    }

}

export class SlaveDetailScene extends ManageContainer implements IScene {
    public static selectedIndex: number = 0;

    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();

        var item = SlaveDetailScene.data

        let title = new SceneTite('副将:' + item.slave.name);

        let data = [
            [
                { type: 'text', name: '头衔', value: '将才', style: {}, calllback: () => { } },
                {
                    type: 'buttton', name: '休息', value: '将才', style: { x: -10 }, calllback: () => {
                        ws.send({ route: 'slave', uri: 'up', sid: item.id, up: item.up })
                    }
                },
            ],
            [{ type: 'text', name: '等级', value: item.lv + '级武士', style: {}, calllback: () => { } }],
            [
                { type: 'text', name: '升级', value: '需' + item.exp + '经验', style: {}, calllback: () => { } },
                {
                    type: 'button', name: '升级', value: '', style: {}, calllback: () => {
                        this.addChild(new confirmBox('确定使用副将心法?', {}, () => {
                            ws.send({ route: 'goods', uri: "useVaria", id: item.id, type: 3, num: 1 })
                        }))
                    }
                }
            ],
            [{ type: 'text', name: '气血', value: '12000', style: { stroke: '#d3393c', strokeThickness: 8 }, calllback: () => { } }],
            [{ type: 'text', name: '精力', value: '8700', style: { stroke: '#346eed', strokeThickness: 8 }, calllback: () => { } }],
            [
                { type: 'text', name: '攻击', value: '5600', style: false, calllback: () => { } },
                { type: 'text', name: '防御', value: '3200', style: false, calllback: () => { } },
            ],
            [{ type: 'text', name: '速度', value: '156', style: false, calllback: () => { } }],
            [
                { type: 'text', name: '属性点', value: '100', style: false, calllback: () => { } },
                { type: 'button', name: '查看', value: '100', style: false, calllback: () => Manager.changeScene(new AttributeScene) },
            ],
            [
                { type: 'button', name: '查看技能', value: '100', style: false, calllback: () => Manager.changeScene(new SkillScene) },
            ],
            [
                { type: 'button', name: '战斗能力', value: '100', style: false, calllback: () => Manager.changeScene(new AbilityScene) },
                { type: 'button', name: '初值培养', value: '100', style: false, calllback: () => { } },
            ],
            [
                { type: 'button', name: '副将生平', value: '100', style: false, calllback: () => { } },
                {
                    type: 'button', name: '解雇副将', value: '100', style: false, calllback: () => {
                        this.addChild(new confirmBox('确定要解雇副将吗?', {}, () => {
                            ws.send({ route: 'slave', uri: "del", id: item.id })
                        }))
                    }
                },
            ],
        ];

        var container = new Container();
        container.x = 80;
        container.y = 200;

        for (const key in data) {
            for (const line in data[key]) {
                let item = data[key][line];
                var row = null;

                let style = Object.assign({
                    fontSize: 40,
                }, item.style);
                if (item.type == 'text') {
                    style.fontSize = 40;
                    row = new StyleText(item.name + " : " + item.value, style)
                } else {
                    style.fontSize = 46;
                    row = new Button(item.name, style, 0x4e50b5);
                    row.y = -10;
                }
                row.x += Number(line) * 370;
                row.y += Number(key) * 85;
                row.on("pointertap", () => item.calllback(), this);
                container.addChild(row);
            }

        }

        this.addChild(container);

        this.addChild(frame, header, title, new Back(SlaveScene));
    }

}

export class SkillScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('技能')

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
    }
}


export class AttributeScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        var item = SlaveDetailScene.data

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite(item.slave.name + '属性点')

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
    }
}


export class AbilityScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('战斗能力')

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
    }
}