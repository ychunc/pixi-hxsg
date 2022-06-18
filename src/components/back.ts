import { Container, Sprite } from "pixi.js";
import { Button } from "./component";
import { Manager } from "../Manager";
import gsap from "gsap";

type Callback = (...args: any[]) => void | null;

export class Back extends Container {

    public button: Button;
    public backgroup: Sprite;
    public scene: any;
    public callback: any;

    /**
     * 返回按钮
     * @param scene 返回的界面对象
     * @param beforeCallback 前置回调
     * @param afterCallback 后置回调
     */
    constructor(scene: any, beforeCallback: Callback = () => { }, afterCallback: Callback = () => { }) {
        super();

        this.alpha = 0.3;

        this.button = new Button('返回');

        this.backgroup = Sprite.from("leg");

        this.addChild(this.backgroup, this.button);

        this.backgroup.height = Manager.width / this.backgroup.width * 2.2 * this.backgroup.height;
        this.backgroup.width = Manager.width * 2.2;

        this.button.x = Manager.width - this.button.width - 20;
        this.button.y = this.height / 2 - this.button.height / 2;

        this.scene = scene;
        this.callback = beforeCallback;

        this.button.on("pointertap", this.doBack, this);

        this.y = Manager.height;

        gsap.to(this, { duration: 0.3, y: Manager.height - this.height, alpha: 1 }).eventCallback('onComplete', () => {
            if (afterCallback) afterCallback(this)
        })
    }

    // 点击返回
    public doBack() {
        // 返回之前做点什么
        if (this.callback) this.callback();
        // 切换场景
        Manager.changeScene(new this.scene);
    }
}