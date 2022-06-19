import { Sprite, Texture } from "pixi.js";
import { IScene, Manager, Container } from "../Manager";
import { StyleText, Frame, Header, Button, SceneTite } from "../components/component";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Scrollbox } from "pixi-scrollbox";
import { Spine } from "../components/spine";
import gsap from "gsap";

export class UserScene extends Container implements IScene {

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
            [{ name: '职业', value: '105级武士', style: {}, link: false }],
            [{ name: '经验', value: '3212312', style: {}, link: false }],
            [{ name: '称号', value: '独孤求败', style: { fill: '#D4AF37' }, link: false }],
            [{ name: '教派', value: '兄弟会', style: {}, link: false }],
            [{ name: '魅力', value: '520000', style: { fill: '#FF6699' }, link: false }],
            [{ name: '气血', value: '12000', style: { stroke: '#d3393c', strokeThickness: 8 }, link: false }],
            [{ name: '精力', value: '8700', style: { stroke: '#346eed', strokeThickness: 8 }, link: false }],
            [
                { name: '攻击', value: '5600', style: false, link: false },
                { name: '防御', value: '3200', style: false, link: false },
            ],
            [{ name: '速度', value: '156', style: false, link: false }],
            [
                { name: '属性点', value: '100', style: false, link: AttributeScene },
            ],
        ];

        let initY = 130;
        let initX = 30;
        let lastY = 150;
        for (const key in data) {
            for (const line in data[key]) {
                let item = data[key][line]

                let style = Object.assign({
                    fontSize: 40,
                    fill: '#f7edca',
                    lineJoin: "round",
                }, item.style);
                let row = new StyleText(item.name + " : " + item.value, style)

                row.x = initX + Number(line) * 300;
                row.y = lastY = initY + Number(key) * 80;
                this.scrollbox.content.addChild(row);

                if (item.link) {
                    let but = new Button('查看');
                    but.x = row.x + 300;
                    but.y = row.y - 10;
                    but.on("pointertap", () => Manager.changeScene(new AttributeScene), this);

                    this.scrollbox.content.addChild(but);
                }

            }
        }

        let but1 = new Button('查看技能');
        but1.x = 30;
        but1.y = lastY + 100;
        this.scrollbox.content.addChild(but1);
    }

    public spine() {
        let spine = new Spine();
        spine.x = -spine.width;
        spine.x = -200;
        spine.y = 250;
        spine.scale.x = -0.6;
        spine.scale.y = 0.6;
        this.addChild(spine);

        gsap.to(spine, { duration: 1, ease: "power2.out", x: Manager.width * 0.99 })
    }

}

export class AttributeScene extends Container implements IScene {
    public data: any;
    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();
        let title = new SceneTite('分配属性点')

        this.addChild(frame, header, title, new Back(UserScene));
    }
}