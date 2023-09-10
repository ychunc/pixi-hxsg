import { Graphics } from "pixi.js";
import { IScene, ManageContainer, Manager } from "../Manager";
import { Frame, Header, SceneTitle, Back, Button, StyleText } from "../components/component";
import { MainScene } from "./MainScene";
import { Ws } from "../components/websocket";

export class Square extends ManageContainer implements IScene {

    public Votes: StyleText;
    public Last: StyleText;

    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle('娱乐场>赤壁斗');

        // app bakcgroupd
        Manager.backgroundColor(0x360033);

        // 切换栏
        this.nav();

        // 分割线
        let graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(70, 220, Manager.width * 0.8, 6);
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(70, 740, Manager.width * 0.8, 6);
        graphics.endFill();
        this.addChild(graphics);

        this.play();

        // 刷新
        let refresh = new Button("刷新", { fontSize: 40, fill: 0xffffff });
        refresh.x = 70;
        refresh.y = 670;
        this.addChild(refresh);
        refresh.on('pointertap', () => { Manager.changeScene(new Square) });

        // 增援
        this.succor();

        // 拉票内容
        this.Votes = new StyleText('', {
            fontSize: 36, fill: 0xf5df38,
            wordWrap: true, wordWrapWidth: Manager.width * 0.82, breakWords: true
        });
        this.Votes.x = 70;
        this.Votes.y = 260;
        this.addChild(this.Votes);

        // 已增援
        let txt = "已增援蜀军1000金100000银";
        let text = new StyleText(txt, {
            fontSize: 36, fill: 0xffffff,
            wordWrap: true, wordWrapWidth: Manager.width * 0.85, breakWords: true
        });
        text.x = 70;
        text.y = 850;
        this.addChild(text);

        // 上次胜利
        this.Last = new StyleText('', {
            fontSize: 36, fill: 0xf5df38,
            wordWrap: true, wordWrapWidth: Manager.width * 0.82, breakWords: true
        });
        this.Last.x = 70;
        this.Last.y = 910;
        this.addChild(this.Last);

        let sort = new Button("战利品排行", { fontSize: 40, fill: 0xffffff });
        sort.x = 360;
        sort.y = 900;
        this.addChild(sort);
        sort.on('pointertap', () => { Manager.changeScene(new Square) });

        this.addChild(sort);

        this.content();

        this.addChild(frame, header, title, new Back(MainScene));
    }

    public succor() {
        let gold = new Button("增援金砖", { fontSize: 40, fill: 0xffffff }, 0xe56200);
        gold.x = 70;
        gold.y = 770;
        this.addChild(gold);
        gold.on('pointertap', () => { Manager.changeScene(new Play) });

        let silver = new Button("增援银两", { fontSize: 40, fill: 0xffffff }, 0xe56200);
        silver.x = 300;
        silver.y = 770;
        this.addChild(silver);
        silver.on('pointertap', () => { Manager.changeScene(new Square) });
    }

    public content() {
        let data = Square.data;

        let count = data['count'];
        let time = data['time'];
        let txt = `第${count}次赤壁斗进行中,还有${time}秒决出胜负,请求增援! \n魏军使用调虎离山计,吴军中计损兵`;
        this.Votes.text.text = txt;

        let countries = ['魏', '蜀', '吴'][data['last']];
        let last = `上次战事${countries}军胜`
        this.Last.text.text = last
    }

    public play() {
        let txt = [
            "魏军目前军资1000金100000银",
            "蜀军目前军资1000金100000银",
            "吴军目前军资1000金100000银"
        ];
        for (let key in txt) {
            let text = new StyleText(txt[key], {
                fontSize: 36,
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: Manager.width * 0.85,
                breakWords: true
            });
            text.x = 70;
            text.y = 420 + 80 * Number(key);
            this.addChild(text);
        }

    }

    public nav() {
        // 物品类型
        var data = ['猜猜猜', '赤壁斗', '猜拳'];
        var width = 70;
        data.forEach((element) => {
            var button = new Button(element, { fontSize: 42, fill: 0xffffff }, 0x7184ff, (_this) => {
                _this.butWidth *= 1.2;
            });
            button.x = width;
            button.y = 156;

            width += button.width + 10;

            this.addChild(button);

            button.on('pointertap', () => { Manager.changeScene(new Square) });
        });

    }

}


export class Play extends ManageContainer implements IScene {

    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle('娱乐场>赤壁斗');

        // app bakcgroupd
        Manager.backgroundColor(0x360033);

        // 切换栏
        this.nav();

        // 分割线
        let graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(70, 220, Manager.width * 0.8, 6);
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(70, 740, Manager.width * 0.8, 6);
        graphics.endFill();
        this.addChild(graphics);

        this.content();
        this.play();

        // 刷新
        let refresh = new Button("刷新", { fontSize: 40, fill: 0xffffff });
        refresh.x = 70;
        refresh.y = 670;
        this.addChild(refresh);
        refresh.on('pointertap', () => { Manager.changeScene(new Square) });

        // 增援
        this.succor();

        // 已增援
        let txt = "已增援蜀军1000金100000银";
        let text = new StyleText(txt, {
            fontSize: 36, fill: 0xffffff,
            wordWrap: true, wordWrapWidth: Manager.width * 0.85, breakWords: true
        });
        text.x = 70;
        text.y = 850;
        this.addChild(text);

        // 上次胜利
        this.last();

        this.addChild(frame, header, title, new Back(MainScene));
    }

    public last() {
        let txt = "上次战事魏军胜";
        let text = new StyleText(txt, {
            fontSize: 36, fill: 0xf5df38,
            wordWrap: true, wordWrapWidth: Manager.width * 0.82, breakWords: true
        });
        text.x = 70;
        text.y = 910;
        this.addChild(text);

        let sort = new Button("战利品排行", { fontSize: 40, fill: 0xffffff });
        sort.x = 360;
        sort.y = 900;
        this.addChild(sort);
        sort.on('pointertap', () => { Manager.changeScene(new Square) });
    }

    public succor() {
        let gold = new Button("增援金砖", { fontSize: 40, fill: 0xffffff }, 0xe56200);
        gold.x = 70;
        gold.y = 770;
        this.addChild(gold);
        gold.on('pointertap', () => { Manager.changeScene(new Play) });

        let silver = new Button("增援银两", { fontSize: 40, fill: 0xffffff }, 0xe56200);
        silver.x = 300;
        silver.y = 770;
        this.addChild(silver);
        silver.on('pointertap', () => { Manager.changeScene(new Play) });
    }

    public content() {
        let txt = "第100000次赤壁斗进行中,还有10秒决出胜负,请求增援!";
        txt += "\n魏军使用调虎离山计,吴军中计损兵";
        let text = new StyleText(txt, {
            fontSize: 36, fill: 0xf5df38,
            wordWrap: true, wordWrapWidth: Manager.width * 0.82, breakWords: true
        });
        text.x = 70;
        text.y = 260;
        this.addChild(text);
    }

    public play() {
        let txt = ["魏军: 1000", "蜀军: 1000", "吴军: 1000"];

        for (let key in txt) {
            let text = new StyleText(txt[key], {
                fontSize: 36, fill: 0xffffff,
                wordWrap: true, wordWrapWidth: Manager.width * 0.85, breakWords: true
            });
            text.x = 70;
            text.y = 420 + 80 * Number(key);

            let button = new Button("增援");
            button.on("pointertap", () => {
                Ws.send({ "route": ["Square", "play"], "index": key });
                Manager.changeScene(new Square);
            })

            button.x = 500;
            button.y = 420 + 80 * Number(key);
            this.addChild(text, button);
        }

    }

    public nav() {
        // 物品类型
        var data = ['猜猜猜', '赤壁斗', '猜拳'];
        var width = 70;
        data.forEach((element) => {
            var button = new Button(element, { fontSize: 42, fill: 0xffffff }, 0x7184ff, (_this) => {
                _this.butWidth *= 1.2;
            });
            button.x = width;
            button.y = 156;

            width += button.width + 10;

            this.addChild(button);

            button.on('pointertap', () => { Manager.changeScene(new Square) });
        });

    }
}