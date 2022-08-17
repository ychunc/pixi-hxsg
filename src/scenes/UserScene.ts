import { Container, Sprite, Texture } from "pixi.js";
import { IScene, Manager, ManageContainer } from "../Manager";
import { StyleText, Frame, Header, Button, SceneTite, confirmBox } from "../components/component";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Scrollbox } from "pixi-scrollbox";
import { Spine } from "../components/spine";
import gsap from "gsap";
import { ws } from "../components/websocket";

export class UserScene extends ManageContainer implements IScene {

    public scrollbox: Scrollbox;

    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('赤壁区-' + UserScene.data.nick + '(10001)');


        // app bakcgroupd
        Manager.backgroundColor(0x010134);

        // create the scrollbox
        this.scrollbox = new Scrollbox({
            boxWidth: Manager.width - frame.left.width * 2,
            boxHeight: Manager.height + 500,
        })

        const sprite = new Sprite(Texture.WHITE)
        sprite.alpha = 0;
        sprite.width = Manager.width - frame.left.width * 2;
        sprite.height = Manager.height + 300;
        sprite.height = Manager.height;
        this.scrollbox.content.addChild(sprite)

        // content
        this.spine();
        this.infos();

        // force an update of the scrollbox's calculations after updating the children
        this.scrollbox.update();
        this.scrollbox.y = header.height;
        this.scrollbox.x = frame.left.width;
        this.addChild(this.scrollbox)

        this.addChild(frame, header, title, new Back(MainScene));
    }

    public infos() {
        var user = UserScene.data
        var occ: any = { 1: '武士', 2: '文人', 3: '异人' }
        var attr_num = user.lv * 4 - user.attr_atk - user.attr_hp - user.attr_mp - user.attr_spd;
        let display: any = [
            [{ type: 'text', name: '职业', value: user.lv + '级' + occ[user.j], style: {}, calllback: () => { } }],
            [{ type: 'text', name: '经验', value: '还需' + user.exp + '经验升级', style: {}, calllback: () => { } }],
            [{ type: 'text', name: '称号', value: '独孤求败', style: { fill: '#D4AF37' }, calllback: () => { } }],
            [{ type: 'text', name: '教派', value: '兄弟会', style: {}, calllback: () => { } }],
            [{ type: 'text', name: '魅力', value: '520000', style: { fill: '#FF6699' }, calllback: () => { } }],
            [{ type: 'text', name: '气血', value: user.struct.d.x, style: { stroke: '#d3393c', strokeThickness: 8 }, calllback: () => { } }],
            [{ type: 'text', name: '精力', value: user.struct.d.j, style: { stroke: '#346eed', strokeThickness: 8 }, calllback: () => { } }],
            [
                { type: 'text', name: '攻击', value: user.struct.d.g, style: false, calllback: () => { } },
                { type: 'text', name: '防御', value: '3200', style: false, calllback: () => { } },
            ],
            [{ type: 'text', name: '速度', value: user.struct.d.s, style: false, calllback: () => { } }],
            [
                { type: 'text', name: '属性点', value: attr_num, style: false, calllback: () => { } },
                { type: 'button', name: attr_num > 0 ? '分配' : '查看', value: '', style: { butColor: attr_num > 0 ? 0xFF0000 : 0x4e50b5 }, calllback: () => Manager.changeScene(new AttributeScene) },
            ],
            [
                { type: 'button', name: '查看技能', value: '', style: false, calllback: () => Manager.changeScene(new SkillScene) },
            ],
        ];

        for (const key in display) {
            for (const line in display[key]) {
                let item = display[key][line];
                var row = null;
                if (item.type == 'text') {
                    let style = Object.assign({
                        fontSize: 40,
                    }, item.style);
                    row = new StyleText(item.name + " : " + item.value, style)
                } else {
                    row = new Button(item.name, false, item.style.butColor ? item.style.butColor : 0x4e50b5);
                }

                row.x = 30 + Number(line) * 300;
                row.y = 100 + Number(key) * 80;
                row.on("pointertap", () => item.calllback(), this);
                this.scrollbox.content.addChild(row);
            }
        }
    }

    public spine() {
        let spine = new Spine();
        spine.x = -spine.width;
        spine.x = -200;
        spine.y = 250;
        spine.scale.x = -1;
        // spine.scale.y = 0.6;
        this.addChild(spine);

        gsap.to(spine, { duration: 1, ease: "power2.out", x: Manager.width * 0.99 })
    }

}

type attr = 'hp' | 'mp' | 'atk' | 'spd'

export class AttributeScene extends ManageContainer implements IScene {
    constructor() {
        super();

        var item = UserScene.data;

        AttributeScene.data = item;

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('分配属性点');

        this.infos();

        var confirm = new Button('确认分配', {}, 0xFF0000, () => { }, true);
        confirm.x = 72;
        confirm.y = Manager.height * 0.86;
        this.addChild(confirm);
        confirm.on('pointertap', () => ws.send({ route: 'user', uri: 'attr', attr: this.attr }))

        var reset = new Button('重新分配', {}, 0x4e50b5, () => { }, true);
        reset.x = confirm.x + confirm.width + 50;
        reset.y = confirm.y;
        this.addChild(reset);
        reset.on('pointertap', () => Manager.changeScene(new AttributeScene))

        this.addChild(frame, header, title, new Back(UserScene));
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
        var item = AttributeScene.data

        this.attr_num = item.lv * 4 - item.attr_atk - item.attr_hp - item.attr_mp - item.attr_spd;

        this.attr = { 'attr_hp': 0, 'attr_mp': 0, 'attr_atk': 0, 'attr_spd': 0 };

        let data = [
            [{ type: 'text', name: '目前剩于点数', value: this.attr_num, style: { fill: 0xf6f800 }, color: 0xdea500, calllback: () => { } },],

            [{ type: 'text', name: '气血', value: item.struct.d.x, style: {}, color: 0xdea500, calllback: () => { } },],
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

            [{ type: 'text', name: '精力', value: item.struct.d.x, style: {}, color: 0xdea500, calllback: () => { } },],
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

            [{ type: 'text', name: '攻击', value: item.struct.d.g, style: {}, color: 0xdea500, calllback: () => { } },],
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

            [{ type: 'text', name: '速度', value: item.struct.d.s, style: {}, color: 0xdea500, calllback: () => { } },],
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

export class SkillScene extends ManageContainer implements IScene {
    constructor() {
        super();

        var item = UserScene.data;

        SkillScene.data = item;

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('技能');

        console.log(SkillScene.data);

        this.lists();

        this.addChild(frame, header, title, new Back(UserScene));
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

        var data = SkillScene.data.struct;

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
                        ws.send({ route: "user", uri: "skillStudy" })
                    }));
                }
            },
        ]);

        this.addChild(this.structure(display));
    }
}