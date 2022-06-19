import { Sprite, Texture } from "pixi.js";
import { IScene, Manager, ManageContainer } from "../Manager";
import { StyleText, Frame, Header, Button, SceneTite } from "../components/component";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Scrollbox } from "pixi-scrollbox";
import { Spine } from "../components/spine";
import gsap from "gsap";

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
        let data = [
            [{ type: 'text', name: '职业', value: '105级武士', style: {}, calllback: () => { } }],
            [{ type: 'text', name: '经验', value: '3212312', style: {}, calllback: () => { } }],
            [{ type: 'text', name: '称号', value: '独孤求败', style: { fill: '#D4AF37' }, calllback: () => { } }],
            [{ type: 'text', name: '教派', value: '兄弟会', style: {}, calllback: () => { } }],
            [{ type: 'text', name: '魅力', value: '520000', style: { fill: '#FF6699' }, calllback: () => { } }],
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
        ];

        let initY = 130;
        let initX = 30;
        let lastY = 150;
        console.log(lastY);

        for (const key in data) {
            for (const line in data[key]) {
                let item = data[key][line];
                var row = null;
                if (item.type == 'text') {
                    let style = Object.assign({
                        fontSize: 40,
                    }, item.style);
                    row = new StyleText(item.name + " : " + item.value, style)
                } else {
                    row = new Button(item.name, false, 0x4e50b5);
                }

                row.x = initX + Number(line) * 300;
                row.y = lastY = initY + Number(key) * 80;
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

export class AttributeScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('分配属性点')

        this.addChild(frame, header, title, new Back(UserScene));
    }
}

export class SkillScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('技能')

        this.addChild(frame, header, title, new Back(UserScene));
    }
}