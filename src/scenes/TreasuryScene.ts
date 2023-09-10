import { Container, Graphics } from "pixi.js";

import { ManageContainer, IScene, Manager } from "../Manager";

import {
    Header, Frame, SceneTitle, StyleText, SplitLine,
    Scrollbox, Button, Avatar, confirmBox, Back
} from "../components/component";

import { MainScene } from "./MainScene";
import { Ws } from "../components/websocket";

export class TreasuryScene extends ManageContainer implements IScene {

    public scrollbox: Scrollbox;

    constructor() {
        super();
        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle('宝物');
        let splitLine = new SplitLine();

        // app backgroundColor
        Manager.backgroundColor(0x360033);

        // Scrollbox
        this.scrollbox = new Scrollbox();

        // list
        this.infos();

        // this addChild
        this.addChild(this.scrollbox);
        this.scrollbox.y = header.height + title.height;
        this.scrollbox.x = Manager.width / 2 - this.scrollbox.width / 2;

        // 分割线
        splitLine.x = this.scrollbox.width / 2 - splitLine.width / 2;
        this.scrollbox.content.addChild(splitLine);

        this.addChild(frame, header, title, new Back(MainScene));
    }

    /**
     * 构造界面器
     * @param data 
     * @returns 
     */
    public structure(data: any) {
        let container = new Container();

        for (const key in data) {
            let lastX = 0
            for (const line in data[key]) {
                let item = data[key][line];
                var row = null;
                if (item.type == 'text') {
                    let style = Object.assign({
                        fontSize: 40,
                    }, item.style);
                    row = new StyleText(item.name + " : " + item.value, style)
                } else {
                    row = new Button(item.name, item.style, item.color);
                }
                row.x = 20 + lastX + Number(line);
                row.y = 50 + Number(key) * 70;

                lastX += row.width + 6;

                row.on("pointertap", () => item.calllback(), this);
                container.addChild(row);
            }
        }

        return container;
    }

    /**
     * 构造界面数据
     */
    public infos() {
        let data = [
            [
                { type: 'button', name: '获取金砖', value: '', style: { fontSize: 46 }, color: 0xFF0000, calllback: () => { } },
                { type: 'button', name: '求助帮助', value: '', style: { fontSize: 46 }, color: 0xC600C3, calllback: () => { } },
            ],
            [
                { type: 'button', name: '宝物', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => { } },
                { type: 'button', name: '经验书', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => { } },
                {
                    type: 'button', name: '副将', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => {
                        Ws.send({ route: ["Slave", "slave"], attr: "up" });
                    }
                },
            ],
        ];
        this.scrollbox.content.addChild(this.structure(data));
    }

}

export class SlaveScene extends ManageContainer implements IScene {

    public scrollbox: Scrollbox;

    /**
     * 历史副将列表
     */
    constructor() {
        super();
        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle('招贤馆');
        let splitLine = new SplitLine();

        // app backgroundColor
        Manager.backgroundColor(0x360033);

        // Scrollbox
        this.scrollbox = new Scrollbox();

        // info
        this.infos();

        // list
        this.lists();

        // this addChild
        this.addChild(this.scrollbox);
        this.scrollbox.y = header.height + title.height;
        this.scrollbox.x = Manager.width / 2 - this.scrollbox.width / 2;

        // 分割线
        splitLine.x = this.scrollbox.width / 2 - splitLine.width / 2;
        splitLine.y = 280;
        this.scrollbox.content.addChild(splitLine);

        this.addChild(frame, header, title, new Back(MainScene));
    }

    public structure(data: any) {
        let container = new Container();

        for (const key in data) {
            let lastX = 0
            for (const line in data[key]) {
                let item = data[key][line];
                var row = null;
                if (item.type == 'text') {
                    let style = Object.assign({
                        fontSize: 40,
                    }, item.style);
                    row = new StyleText(item.name + " : " + item.value, style)
                } else {
                    row = new Button(item.name, item.style, item.color);
                }
                row.x = 20 + lastX + Number(line);
                row.y = 50 + Number(key) * 70;

                lastX += row.width + 6;

                row.on("pointertap", () => item.calllback(), this);
                container.addChild(row);
            }
        }

        return container;
    }

    public infos() {
        let data = [
            [{
                type: 'button', name: '招募副将', value: '', style: { fontSize: 46 }, color: 0xC600C3, calllback: () => {
                    Manager.currentScene.addChild(new confirmBox('确定招募副将?', () => {
                        Ws.send({ route: ["Slave", "get"] });
                        Manager.changeScene(new SlaveScene)
                    }))
                }
            },
            { type: 'button', name: '猛将传介绍', value: '', style: { fontSize: 46 }, color: 0xC600C3, calllback: () => { } },
            ],
            [
                { type: 'button', name: '常人', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => { } },
                { type: 'button', name: '英才', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => { } },
                { type: 'button', name: '将才', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => { } },
            ],
            [
                {
                    type: 'button', name: '成长', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => {
                        Ws.send({ route: ["Slave", "slave"], attr: "up" })
                    }
                },
                {
                    type: 'button', name: '血', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => {
                        Ws.send({ route: ["Slave", "slave"], attr: "x" })
                    }
                },
                {
                    type: 'button', name: '精', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => {
                        Ws.send({ route: ["Slave", "slave"], attr: "j" })
                    }
                },
                {
                    type: 'button', name: '攻', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => {
                        Ws.send({ route: ["Slave", "slave"], attr: "g" })
                    }
                },
                {
                    type: 'button', name: '速', value: '', style: { fontSize: 46, fill: 0x63005d }, color: 0xdea500, calllback: () => {
                        Ws.send({ route: ["Slave", "slave"], attr: "s" })
                    }
                },
            ],
        ];

        this.scrollbox.content.addChild(this.structure(data));
    }

    public lists() {
        var container = new Container();
        let data = SlaveScene.data.list;
        let attr = SlaveScene.data.attr;

        for (let index = 0; index < data.length; index++) {
            var row = new Container();
            row.x = 20;
            row.y = 300 + index * 70;

            let name = new StyleText(data[index].name, {
                fontSize: 40,
                fill: '#F7EDCA',
                stroke: '#D3393C',
                strokeThickness: 6,
                lineJoin: "round",
            });
            name.on('pointertap', () => Manager.changeScene(new SlaveDetailScene(data[index], SlaveScene)));

            let level = new StyleText('  (0.85-' + data[index][attr] + ')', { fontSize: 40 });
            level.x = name.width;

            let cloumn = new Graphics();
            cloumn.beginFill(0xFFFFFF, 0.2).drawRect(-6, -6, Manager.width * 0.8, 60);
            cloumn.endFill();
            if (index % 2 == 0) {
                row.addChild(cloumn);
            }

            row.addChild(name, level);

            container.addChild(row);
        }

        this.scrollbox.content.addChild(container);
    }

}


export class SlaveDetailScene extends ManageContainer implements IScene {

    /**
     * 副将详情
     * @param item 副将详情
     * @param Scene 返回界面
     */
    constructor(item: any, Scene: any) {
        super();

        console.log(item);

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle(item.name);

        this.lists(item);

        this.addChild(new Avatar({ avatar: item.sid, y: 150 }));

        this.addChild(frame, header, title, new Back(Scene));
    }

    public structure(data: any) {
        let container = new Container();

        for (const key in data) {
            let lastX = 0
            for (const line in data[key]) {
                let item = data[key][line];
                var row = null;
                if (item.type == 'text') {
                    let style = Object.assign({
                        fontSize: 40,
                    }, item.style);
                    row = new StyleText(item.name + " : " + item.value, style)
                } else {
                    row = new Button(item.name, item.style, item.color);
                }
                row.x = 80 + lastX + Number(line);
                row.y = 170 + Number(key) * 80;

                lastX += row.width + 6;

                row.on("pointertap", () => item.calllback(), this);
                container.addChild(row);
            }
        }

        return container;
    }

    public lists(item: any) {
        let data = [
            [{ type: 'text', name: '头衔', value: '将才', style: {}, color: 0xC600C3, calllback: () => { } },],
            [{ type: 'text', name: '成长率', value: item.up, style: {}, color: 0xC600C3, calllback: () => { } },],
            [{ type: 'text', name: '气血初值', value: item.x, style: {}, color: 0xC600C3, calllback: () => { } },],
            [{ type: 'text', name: '智力初值', value: item.j, style: {}, color: 0xC600C3, calllback: () => { } },],
            [{ type: 'text', name: '攻击初值', value: item.g, style: {}, color: 0xC600C3, calllback: () => { } },],
            [{ type: 'text', name: '敏捷初值', value: item.s, style: {}, color: 0xC600C3, calllback: () => { } },],
            [
                { type: 'button', name: '生平', value: '', style: {}, color: 0xC600C3, calllback: () => { } },
                { type: 'button', name: '数据说明', value: '', style: {}, color: 0xC600C3, calllback: () => { } },
            ],
        ];

        this.addChild(this.structure(data));
    }
}