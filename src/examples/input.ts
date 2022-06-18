import { Container } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "../scenes/MainScene";
import { Button } from "../components/component";
import { SpineScene } from "./spine";

export class Input extends Container implements IScene {

    public username: HTMLInputElement
    public password: HTMLInputElement
    public button: Button

    constructor() {
        super();

        let spine = new SpineScene();
        spine.x = -spine.width;
        this.addChild(spine);

        // new Tween(spine)
        //     .to({ x: Manager.width * 0.99 }, 500)
        //     .easing(Easing.Sinusoidal.Out)
        //     .start();

        this.username = document.createElement('input');
        this.username.style.position = 'fixed'
        this.username.type = 'tel'
        this.username.style.display = 'block'
        this.username.style.top = '32%'
        this.username.style.left = '50%'
        this.username.style.width = '230px'
        this.username.style.marginLeft = '-126px'
        this.username.autocapitalize = 'on'

        this.password = document.createElement('input');
        this.password.style.position = 'fixed'
        this.password.type = 'password'
        this.password.style.display = 'block'
        this.password.style.top = '40%'
        this.password.style.left = '50%'
        this.password.style.width = '230px'
        this.password.style.marginLeft = '-126px'

        document.body.appendChild(this.username)
        document.body.appendChild(this.password)

        this.button = new Button('登录游戏');
        this.button.x = Manager.width / 2 - this.button.width / 2
        this.button.y = Manager.height / 2;
        this.addChild(this.button)

        this.button.on("pointertap", this.login, this);

        let back = new Back(MainScene, () => this.back(this));
        this.addChild(back);
    }

    public login() {
        console.log('login', this.username.value, this.password.value);
    }

    public back(_this: this) {
        document.body.removeChild(_this.username)
        document.body.removeChild(_this.password)
    }

    public update(): void {
    }

}