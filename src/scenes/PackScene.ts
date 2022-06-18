import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Button, Frame, Header, StyleText } from "../components/component";
import { Scrollbox } from "pixi-scrollbox";

export class PackScene extends Container implements IScene {
    public static data: any;

    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();

        // app backgroundColor
        Manager.backgroundColor(0x010134);

        // title
        let title = new StyleText('装备', {
            fontSize: 40,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        })
        title.y = header.height;
        title.x = Manager.width / 2 - title.width / 2;
        this.addChild(title);

        // create the scrollbox
        const scrollbox = new Scrollbox({
            boxWidth: Manager.width * 0.85,
            boxHeight: Manager.height,
        });

        const sprite = scrollbox.content.addChild(new Sprite(Texture.WHITE))
        sprite.width = Manager.width * 0.85;
        sprite.height = Manager.height + 500;
        sprite.tint = 0x010134;
        // sprite.tint = 0x000000;


        // 我的装备
        var equipage = new Button('我的装备');
        equipage.x = 20;
        equipage.y = 80;
        scrollbox.content.addChild(equipage);

        // 物品类型
        var data = ['药品', '装备', '矿石', '杂物'];
        var width = 20;
        data.forEach((element) => {
            var button = new Button(element, { fontSize: 46 }, 0xdea500, (_this) => {
                _this.butWidth *= 1.2;
            });
            button.x = width;
            button.y = 150;

            width += button.width + 10;
            scrollbox.content.addChild(button);

            button.on('pointertap', () => Manager.changeScene(new PackScene));
        });

        // 分割线
        let graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(20, 0, Manager.width * 0.8, 6);
        graphics.endFill();
        graphics.y = 225;

        scrollbox.content.addChild(graphics);

        this.list(scrollbox);

        // force an update of the scrollbox's calculations after updating the children
        scrollbox.update();

        this.addChild(scrollbox)

        scrollbox.y = header.height + title.height;
        scrollbox.x = Manager.width / 2 - scrollbox.width / 2;

        this.addChild(frame, header, new Back(MainScene));
    }


    public list(scrollbox: any) {
        var container = new Container();

        // PackScene.data = PackScene.data.concat(PackScene.data)
        // PackScene.data = PackScene.data.concat(PackScene.data)

        for (let index = 0; index < PackScene.data.length; index++) {
            var row = new Container();
            row.x = 20;
            row.y = 300 + index * 70;

            let name = new StyleText(PackScene.data[index].name, {
                fontSize: 34,
                fill: '#F7EDCA',
                stroke: '#D3393C',
                strokeThickness: 6,
                lineJoin: "round",
            });

            let num = new StyleText('(' + PackScene.data[index].num + ')', { fontSize: 32 });
            num.x = name.width;

            let use = new Button('使用', { fontSize: 42 });
            use.x = 450;

            let cloumn = new Graphics();
            cloumn.beginFill(0xFFFFFF, 0.2).drawRect(-6, -8, Manager.width * 0.8, 70);
            cloumn.endFill();

            row.addChild(name, num, use);

            if (index % 2 == 0) {
                row.addChild(cloumn);
            }

            container.addChild(row);
        }

        scrollbox.content.addChild(container);
    }

    public update(framesPassed: number): void {
        framesPassed
    }
}