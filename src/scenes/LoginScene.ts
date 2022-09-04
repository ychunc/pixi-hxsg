import { TextStyle, Text } from "pixi.js";
import gsap from "gsap";
import { ws } from "../components/websocket"
import { IScene, ManageContainer, Manager } from "../Manager";
import { Spine } from "../components/spine";
import { Button } from "../components/component";
import { MainScene } from "./MainScene";

export class LoginScene extends ManageContainer implements IScene {
    public static username: HTMLInputElement
    public static password: HTMLInputElement
    public button: Button
    public socket: any;

    constructor() {
        super();

        // app bakcgroupd
        Manager.backgroundColor(0x66CCFF);

        let spine = new Spine();
        spine.x = -spine.width;
        spine.y = 200;
        spine.scale.x = 1;
        spine.scale.y = 1;
        this.addChild(spine);

        gsap.to(spine, { duration: 0.5, ease: "power2.out", x: Manager.width * 0.1 })

        const skewStyle = new TextStyle({
            // fontFamily: 'Arial',
            fontFamily: '9pxDemo',
            dropShadow: true,
            dropShadowAlpha: 0.8,
            dropShadowAngle: 2.1,
            dropShadowBlur: 4,
            dropShadowColor: '0xdc8fc2',
            dropShadowDistance: 10,
            fill: ['#ffffff'],
            stroke: '#fb7299',
            fontSize: 80,
            fontWeight: 'lighter',
            lineJoin: 'round',
            strokeThickness: 12,
        });

        const skewText = new Text('PixiGame', skewStyle);
        skewText.alpha = 0.8;
        skewText.anchor.set(0.5, 0.5);
        skewText.x = Manager.width / 2;
        skewText.y = Manager.height * 0.12;
        this.addChild(skewText);

        LoginScene.username = document.createElement('input');
        LoginScene.username.placeholder = '账号...'
        LoginScene.username.value = '744783'
        LoginScene.username.type = 'tel'
        LoginScene.username.style.position = 'fixed'
        LoginScene.username.style.display = 'block'
        LoginScene.username.style.opacity = '0.5'
        LoginScene.username.style.left = '50%'
        LoginScene.username.style.width = '230px'
        LoginScene.username.style.marginLeft = '-126px'
        LoginScene.username.style.marginTop = '380px'
        LoginScene.username.autocapitalize = 'on'

        LoginScene.password = document.createElement('input');
        LoginScene.password.placeholder = '密码...'
        LoginScene.password.value = '123456'
        LoginScene.password.style.position = 'fixed'
        LoginScene.password.type = 'password'
        LoginScene.password.style.display = 'block'
        LoginScene.password.style.opacity = '0.5'
        LoginScene.password.style.left = '50%'
        LoginScene.password.style.width = '230px'
        LoginScene.password.style.marginLeft = '-126px'
        LoginScene.password.style.marginTop = '440px'

        document.body.appendChild(LoginScene.username)
        document.body.appendChild(LoginScene.password)

        this.button = new Button('登录游戏');
        this.button.x = Manager.width / 2 - this.button.width / 2
        this.button.y = Manager.height * 0.76;
        this.addChild(this.button)
        this.button.on("pointertap", this.login, this);

        let button = new Button('游客登录');

        button.x = Manager.width / 2 - this.button.width / 2
        button.y = Manager.height * 0.82;
        this.addChild(button)
        button.on("pointertap", () => {
            LoginScene.removeInput();
            Manager.changeScene(new MainScene);
        });

        if (ws.action == 'AUTO') {
            this.login();
        }

    }

    public login() {
        ws.action = 'ACTIVE';
        ws.connect();
    }

    public static removeInput() {
        try {
            document.body.removeChild(LoginScene.username)
            document.body.removeChild(LoginScene.password)
        } catch (error) {
        }
    }

}