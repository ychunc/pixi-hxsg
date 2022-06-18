import { Container, Graphics } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Button, Frame, Header, StyleText } from "../components/component";

export class SortScene extends Container implements IScene {

    public static data: any;

    public update(): void { }

    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();

        // app backgroundColor
        Manager.backgroundColor(0x360033);

        let title = new StyleText("排行榜", {
            fontSize: 38,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        })
        title.y = 100;
        title.x = Manager.width / 2 - title.width / 2;
        this.addChild(title);

        // 排行分类 (一级)
        var data = ['玩家', '教派', '副将', '教派'];

        var width = 76;
        data.forEach((element) => {
            var button = new Button(element, { fill: ['#76174d'], fontSize: 46 }, 0xdea500);
            button.x = width;
            button.y = 200;

            width += button.width + 10;
            this.addChild(button);

            button.on('pointertap', () => Manager.changeScene(new SortScene));
        });


        // 排行分类 (二级)
        var data = ['高手', '富', '排', '美', '战'];

        var width = 76;
        data.forEach((element) => {
            var button = new Button(element, { fontSize: 46 }, 0xe74500, (_this) => {
                _this.butWidth *= 1.3;
            });
            button.x = width;
            button.y = 270;

            width += button.width + 10;
            this.addChild(button);

            button.on('pointertap', () => Manager.changeScene(new SortScene));
        });

        // 分割线
        let graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(0, 0, Manager.width * 0.8, 4);
        graphics.endFill();
        graphics.y = 350;
        graphics.x = Manager.width / 2 - graphics.width / 2;
        this.addChild(graphics);

        this.list();

        this.addChild(frame, header, new Back(MainScene));
    }

    public list() {

        var container = new Container();
        for (let index = 0; index < SortScene.data.length; index++) {
            var row = new Container();
            row.x = 80;
            row.y = 400 + index * 70;

            let no = new StyleText((index + 1 + '.').toString());
            let name = new StyleText(SortScene.data[index].nick, {
                fontSize: 32,
                fill: '#F7EDCA',
                stroke: '#D3393C',
                strokeThickness: 6,
                lineJoin: "round",
            });
            name.x = no.width

            let level = new StyleText('(' + SortScene.data[index].lv + '级)', {
                fontSize: 32
            });
            level.x = no.width + name.width

            let cloumn = new Graphics();
            cloumn.beginFill(0xFFFFFF, 0.2).drawRect(-6, -6, Manager.width * 0.8, 60);
            cloumn.endFill();

            row.addChild(no, name, level);

            if (index % 2 == 0) {
                row.addChild(cloumn);
            }

            container.addChild(row);
        }

        this.addChild(container);
    }

}