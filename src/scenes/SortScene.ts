import { Container } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Button, Frame, Header, StyleText } from "../components/component";

export class SortScene extends Container implements IScene {

    public data: any;

    constructor() {
        super();

        let header = new Header(true);
        let frame = new Frame();

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
            var button = new Button(element)
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
            var button = new Button(element)
            button.x = width;
            button.y = 270;

            width += button.width + 10;
            this.addChild(button);

            button.on('pointertap', () => Manager.changeScene(new SortScene));
        });


        this.addChild(frame, header, new Back(MainScene));
    }
    public update(framesPassed: number): void {
        framesPassed
    }
}