import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { IScene, ManageContainer, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Button, Frame, Header, StyleText } from "../components/component";
import { Scrollbox } from "pixi-scrollbox";

import { Location } from "../components/route";

export class PackScene extends ManageContainer implements IScene {

    constructor() {
        super();

        let header = new Header();
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
        sprite.height = Manager.height + 200;
        sprite.tint = 0x010134;

        // 我的装备
        var equipage = new Button('我的装备');
        equipage.x = 20;
        equipage.y = 40;
        scrollbox.content.addChild(equipage);
        equipage.on('pointertap', () => { });

        // 物品类型
        var data = ['药品', '装备', '矿石', '杂物'];
        var width = 20;
        data.forEach((element, key) => {
            var button = new Button(element, { fontSize: 46, fill: 0x63005d }, 0xdea500, (_this) => {
                _this.butWidth *= 1.2;
            });
            button.x = width;
            button.y = 120;

            width += button.width + 10;
            scrollbox.content.addChild(button);

            button.on('pointertap', () => Location.to(PackScene, { route: ["Goods", "list"], "type": key }));
        });

        // 分割线
        let graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(20, 0, Manager.width * 0.8, 6);
        graphics.endFill();
        graphics.y = 200;

        scrollbox.content.addChild(graphics);

        this.list(scrollbox);

        // force an update of the scrollbox's calculations after updating the children
        scrollbox.update();

        this.addChild(scrollbox)

        scrollbox.y = header.height + title.height;
        scrollbox.x = Manager.width / 2 - scrollbox.width / 2;

        this.addChild(frame, header, new Back(MainScene));
    }


    /**
     * 物品列表
     * @param scrollbox 
     */
    public list(scrollbox: any) {
        var container = new Container();

        for (let index = 0; index < PackScene.data.length; index++) {
            var row = new Container();
            row.x = 20;
            row.y = 250 + index * 70;

            let name = new StyleText(PackScene.data[index].name, {
                fontSize: 40,
                fill: '#F7EDCA',
                stroke: '#D3393C',
                strokeThickness: 6,
                lineJoin: "round",
            });

            let num = new StyleText('(' + PackScene.data[index].num + ')', { fontSize: 40 });
            num.x = name.width;

            let use = new Button('使用', { fontSize: 42 });
            use.x = 450;

            let cloumn = new Graphics();
            cloumn.beginFill(0xFFFFFF, 0.2).drawRect(-6, -8, Manager.width * 0.8, 70);
            cloumn.endFill();
            if (index % 2 == 0) {
                row.addChild(cloumn);
            }

            row.addChild(name, num, use);

            container.addChild(row);
        }

        scrollbox.content.addChild(container);
    }

}