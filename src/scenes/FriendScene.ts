import { IScene, Manager, ManageContainer } from "../Manager";
import { MainScene } from "./MainScene";
import { Header, Frame, SceneTitle, Button, Back } from "../components/component";
import { Container, Graphics } from "pixi.js";

export class FriendScene extends ManageContainer implements IScene {

    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle('好友(56/100)')

        // app bakcgroupd
        Manager.backgroundColor(0x360033);


        // 物品类型
        var data = ['好友', '最近', '亲人', '仇人'];
        var width = 20;
        var container = new Container;
        container.x = 50;
        container.y = 100;
        data.forEach((element) => {
            var button = new Button(element, { fontSize: 46 }, 0xdea500)
            button.x = width;
            button.y = 120;

            width += button.width + 10;
            container.addChild(button);

            button.on('pointertap', () => Manager.changeScene(new FriendScene));
        });
        this.addChild(container);

        // 分割线
        let graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 0.8).drawRect(20, 0, Manager.width * 0.8, 6);
        graphics.endFill();
        graphics.y = 300;
        graphics.x = 50;
        this.addChild(graphics);

        this.addChild(frame, header, title, new Back(MainScene));
    }

}

export class SlaveDetailScene extends ManageContainer implements IScene {
    public static selectedIndex: number = 0;

    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();

        var item = SlaveDetailScene.data

        let title = new SceneTitle('副将:' + item.slave.name);

        this.addChild(frame, header, title, new Back(MainScene));
    }

}

export class SkillScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle('技能')

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
    }
}


export class AttributeScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        var item = SlaveDetailScene.data

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle(item.slave.name + '属性点')

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
    }
}


export class AbilityScene extends ManageContainer implements IScene {
    public data: any;
    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTitle('战斗能力')

        this.addChild(frame, header, title, new Back(SlaveDetailScene));
    }
}