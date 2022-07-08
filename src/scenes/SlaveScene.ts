import { Container, Graphics } from "pixi.js";
import { IScene, Manager, ManageContainer } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Header, Frame, StyleText, Button, SceneTite, confirmBox, Avatar } from "../components/component";
import { ws } from "../components/websocket";
import { SlaveDetailScene as SlaveSlaveDetailScene } from "./TreasuryScene"

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
        console.log(item);

        let title = new SceneTite('副将:' + item.slave.name);

        this.addChild(new Avatar({ avatar: item.sid, y: 180 }));

        var attr_num = item.lv * 4 - item.attr_atk - item.attr_hp - item.attr_mp - item.attr_spd;

        let data = [
            [
                { type: 'text', name: '头衔', value: '将才', style: {}, calllback: () => { } },
                {
                    type: 'buttton', name: '休息', value: '', style: { x: -150 }, calllback: () => {
                        ws.send({ route: 'slave', uri: 'up', sid: item.id, up: item.up })
                    }
                },
            ],
            [{ type: 'text', name: '等级', value: item.lv + '级武士', style: {}, calllback: () => { } }],
            [
                { type: 'text', name: '升级', value: '需' + item.exp + '经验', style: {}, calllback: () => { } },
                {
                    type: 'button', name: '升级', value: '', style: {}, calllback: () => {
                        this.addChild(new confirmBox('确定使用副将心法?', () => {
                            ws.send({ route: 'goods', uri: "useVaria", id: item.id, type: 3, num: 1 })
                        }))
                    }
                }
            ],
            [{ type: 'text', name: '气血', value: item.d.x, style: { stroke: '#d3393c', strokeThickness: 8 }, calllback: () => { } }],
            [{ type: 'text', name: '精力', value: item.d.j, style: { stroke: '#346eed', strokeThickness: 8 }, calllback: () => { } }],
            [
                { type: 'text', name: '攻击', value: item.d.g, style: false, calllback: () => { } },
                { type: 'text', name: '防御', value: '3200', style: false, calllback: () => { } },
            ],
            [{ type: 'text', name: '速度', value: item.d.s, style: false, calllback: () => { } }],
            [
                { type: 'text', name: '属性点', value: attr_num, style: false, calllback: () => { } },
                {
                    type: 'button', name: attr_num > 0 ? '分配' : '查看', value: '100', style: false, calllback: () => Manager.changeScene(new AttributeScene)
                },
            ],
            [
                { type: 'button', name: '查看技能', value: '100', style: false, calllback: () => Manager.changeScene(new SkillScene) },
            ],
            [
                { type: 'button', name: '战斗能力', value: '100', style: false, calllback: () => Manager.changeScene(new AbilityScene) },
                { type: 'button', name: '初值培养', value: '100', style: false, calllback: () => { Manager.changeScene(new SlaveSlaveDetailScene(item['slave'], SlaveDetailScene)) } },
            ],
            [
                { type: 'button', name: '副将生平', value: '100', style: false, calllback: () => { Manager.changeScene(new SlaveSlaveDetailScene(item['slave'], SlaveDetailScene)) } },
                {
                    type: 'button', name: '解雇副将', value: '100', style: false, calllback: () => {
                        this.addChild(new confirmBox('确定要解雇副将吗?', () => {
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
                    row.x = 'x' in style ? Number(style.x) : 0;
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
    constructor() {
        super();

        var item = SlaveDetailScene.data;

        SkillScene.data = item;

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite(item.slave.name + '技能');

        console.log(SkillScene.data);

        this.lists();

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
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
                        fontSize: 37,
                    }, item.style);
                    row = new StyleText(item.name + "" + item.value, style)
                } else {
                    row = new Button(item.name, item.style, item.color, () => { }, false);
                }
                row.x = 'x' in item.style ? Number(item.style.x) : lastX + Number(line);
                row.y = 'y' in item.style ? Number(item.style.y) * Number(key) : 86 * Number(key) + 6;

                lastX += row.width + 6;

                row.on("pointertap", () => item.calllback(), this);
                container.addChild(row);
            }
        }

        container.x = 80;
        container.y = 200;
        return container;
    }

    public lists() {

        var data = SkillScene.data;

        var display = [];

        for (let index = 0; index < data.skill.length; index++) {
            var item = data.skill[index];
            let row = [
                { type: 'text', name: item.skill_name, value: `(${item.lv})级`, style: {}, color: 0xC600C3, calllback: () => { } },
                { type: 'text', name: '熟练度:', value: item.sld, style: {}, color: 0xC600C3, calllback: () => { } },
                {
                    type: 'button', name: item.sld / 6000 >= item.lv ? "升级" : "提高", value: '', style: { x: 480, y: 78 }, color: item.sld / 6000 >= item.lv ? 0xFF0000 : 0x4e50b5, calllback: () => {
                        var item = data.skill[index];
                        var lv: any = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五' };
                        this.addChild(new confirmBox("确定使用" + lv[item.lv] + "级技能书?", () => {
                            ws.send({ route: 'goods', uri: "useVaria", id: item.id, type: 2, num: 1 })
                        }));
                    }
                },
            ];
            display.push(row);
        }

        display.push([
            {
                type: 'button', name: '学习技能', value: '', style: {}, color: 0x4e50b5, calllback: () => {
                    this.addChild(new confirmBox("确定学习新技能?", () => {
                        ws.send({ route: 'slave', uri: "skillStudy", usid: data.id })
                    }));
                }
            },
        ]);

        this.addChild(this.structure(display));
    }
}

type attr = 'hp' | 'mp' | 'atk' | 'spd'

export class AttributeScene extends ManageContainer implements IScene {
    constructor() {
        super();

        var item = SlaveDetailScene.data;

        AttributeScene.data = item;

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite(item.slave.name + '属性点');

        this.infos();

        var confirm = new Button('确认分配', {}, 0xFF0000, () => { }, true);
        confirm.x = 72;
        confirm.y = Manager.height * 0.86;
        this.addChild(confirm);
        confirm.on('pointertap', () => ws.send({ route: 'slave', uri: 'attr', attr: this.attr, id: item.id }))

        var reset = new Button('重新分配', {}, 0x4e50b5, () => { }, true);
        reset.x = confirm.x + confirm.width + 50;
        reset.y = confirm.y;
        this.addChild(reset);
        reset.on('pointertap', () => Manager.changeScene(new AttributeScene))

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
    }

    public structure(data: any) {
        let container = new Container();

        for (const key in data) {
            let lastX = 0
            let rowContainer = new Container();
            for (const line in data[key]) {
                let item = data[key][line];
                var row: StyleText | Button | null = null;
                if (item.type == 'text') {
                    let style = Object.assign({
                        fontSize: 40,
                    }, item.style);
                    row = new StyleText(item.name + " " + item.value, style)
                } else {
                    row = new Button(item.name, item.style, item.color, () => { }, false);
                }
                row.x = 'x' in item.style ? Number(item.style.x) : lastX + Number(line);
                row.y = Number(key) * 70;

                lastX += row.width + 6;

                row.on("pointertap", () => item.calllback(row), this);
                rowContainer.addChild(row);
            }
            container.addChild(rowContainer);
        }

        container.x = 80;
        container.y = 200;
        return container;
    }

    public attr: any = {};
    public attr_num: number = 0;

    public infos() {

        console.log(AttributeScene.data);
        var item = AttributeScene.data

        this.attr_num = item.lv * 4 - item.attr_atk - item.attr_hp - item.attr_mp - item.attr_spd;

        this.attr = { 'attr_hp': 0, 'attr_mp': 0, 'attr_atk': 0, 'attr_spd': 0 };

        let data = [
            [{ type: 'text', name: '目前剩于点数', value: this.attr_num, style: { fill: 0xf6f800 }, color: 0xdea500, calllback: () => { } },],

            [{ type: 'text', name: '气血', value: item.d.x, style: {}, color: 0xdea500, calllback: () => { } },],
            [
                { type: 'text', name: `体质点:${item.attr_hp}`, value: '', style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'text', name: '+', value: this.attr.attr_hp, style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'button', name: '分配全部', value: '', style: { x: 350 }, color: 0xaf4403, calllback: (_this: any) => this.actionAttr(_this, this.attr_num, 'hp') },
            ],
            [
                { type: 'button', name: ' +1 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 1, 'hp') },
                { type: 'button', name: ' +3 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 3, 'hp') },
                { type: 'button', name: ' -1 ', value: 0, style: { x: 350 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -1, 'hp') },
                { type: 'button', name: ' -3 ', value: 0, style: { x: 456 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -3, 'hp') },
            ],

            [{ type: 'text', name: '精力', value: item.d.x, style: {}, color: 0xdea500, calllback: () => { } },],
            [
                { type: 'text', name: `智力点:${item.attr_mp}`, value: '', style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'text', name: '+', value: this.attr.attr_mp, style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'button', name: '分配全部', value: '', style: { x: 350 }, color: 0xaf4403, calllback: (_this: any) => this.actionAttr(_this, this.attr_num, 'mp') },
            ],
            [
                { type: 'button', name: ' +1 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 1, 'mp') },
                { type: 'button', name: ' +3 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 3, 'mp') },
                { type: 'button', name: ' -1 ', value: 0, style: { x: 350 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -1, 'mp') },
                { type: 'button', name: ' -3 ', value: 0, style: { x: 456 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -3, 'mp') },
            ],

            [{ type: 'text', name: '攻击', value: item.d.g, style: {}, color: 0xdea500, calllback: () => { } },],
            [
                { type: 'text', name: `力量点:${item.attr_atk}`, value: '', style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'text', name: '+', value: this.attr.attr_atk, style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'button', name: '分配全部', value: '', style: { x: 350 }, color: 0xaf4403, calllback: (_this: any) => this.actionAttr(_this, this.attr_num, 'atk') },
            ],
            [
                { type: 'button', name: ' +1 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 1, 'atk') },
                { type: 'button', name: ' +3 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 3, 'atk') },
                { type: 'button', name: ' -1 ', value: 0, style: { x: 350 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -1, 'atk') },
                { type: 'button', name: ' -3 ', value: 0, style: { x: 456 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -3, 'atk') },
            ],

            [{ type: 'text', name: '速度', value: item.d.s, style: {}, color: 0xdea500, calllback: () => { } },],
            [
                { type: 'text', name: `敏捷点:${item.attr_spd}`, value: '', style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'text', name: '+', value: this.attr.attr_spd, style: {}, color: 0xdea500, calllback: () => { } },
                { type: 'button', name: '分配全部', value: '', style: { x: 350 }, color: 0xaf4403, calllback: (_this: any) => this.actionAttr(_this, this.attr_num, 'spd') },
            ],
            [
                { type: 'button', name: ' +1 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 1, 'spd') },
                { type: 'button', name: ' +3 ', value: 0, style: {}, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, 3, 'spd') },
                { type: 'button', name: ' -1 ', value: 0, style: { x: 350 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -1, 'spd') },
                { type: 'button', name: ' -3 ', value: 0, style: { x: 456 }, color: 0x4e50b5, calllback: (_this: any) => this.actionAttr(_this, -3, 'spd') },
            ],
        ];

        this.addChild(this.structure(data));
    }

    public actionAttr(_this: any, num: number, attrName: attr) {
        var index = { 'hp': 2, 'mp': 5, 'atk': 8, 'spd': 11 }
        console.log(_this, num, attrName);

        if (this.attr_num - num < 0 || this.attr['attr_' + attrName] + num < 0) {
            console.log('可分配点数不足');
            return;
        }
        console.log('加完点后', this.attr_num - num);

        this.attr['attr_' + attrName] += num;
        _this.parent.parent.children[index[attrName]].children[1].text.text = '+ ' + this.attr['attr_' + attrName]

        this.attr_num -= num;
        _this.parent.parent.children[0].children[0].children[0].text = '目前剩于点数 ' + this.attr_num;
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

