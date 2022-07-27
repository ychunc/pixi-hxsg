import gsap from "gsap";
import { Container, Sprite, Loader } from "pixi.js";
import { Manager } from "../Manager";
import { ws } from "./websocket";


export class Chat extends Container {

    public currentIndex: number = 0;

    constructor() {
        super();
        this.y = 700;

        this.zIndex = 1000;

        this.sortableChildren = true;

        this.background();

        this.currentChat();

        this.bar();

        this.chatInput();
    }

    public currentChatSprite: Sprite = new Sprite;

    public input: any;

    public inputBg: any;

    public chatInput() {
        var input_bg = Sprite.from('chat_input_bg');
        input_bg.x = 0;
        input_bg.y = Manager.height - this.y - input_bg.height - 60;
        input_bg.scale.set(1.17);

        var input = Sprite.from('chat_input');
        input.y = 6;
        input.scale.set(1.17);

        var send = Sprite.from('chat_send');
        send.scale.set(1.17);
        send.x = input_bg.width / 1.17 - send.width;
        send.y = 6;

        input_bg.addChild(input, send);
        this.addChild(input_bg);
        this.inputBg = input_bg;

        input.interactive = true;
        input.on('pointertap', () => {
            send.interactive = true;

            let text = document.createElement('input');
            text.placeholder = '内容...'
            text.type = 'text'
            text.style.display = 'block'
            text.style.opacity = '0.8'
            text.style.width = '90%'
            text.style.margin = 'auto'
            text.style.marginTop = '50%'
            this.input = text;

            document.body.appendChild(text);
            text.focus();
            text.onkeydown = (event) => {
                if (event.keyCode == 13) {
                    ws.send({ "route": "chat", "msg": text.value });
                    this.removeInput();
                }
            }

            text.onblur = () => {
                this.removeInput();
            };

            send.on('pointertap', () => {
                ws.send({ "route": "chat", "msg": text.value });
                this.removeInput();
            });
        })

    }

    public removeInput() {
        try {
            this.input.interactive = false;
            document.body.removeChild(this.input);
        } catch (error) { }
    }

    public currentChat() {
        var sprite = Sprite.from('chat_current');
        sprite.x = 344 + this.currentIndex * 50;
        sprite.scale.x = 1.17;

        this.currentChatSprite = sprite;
        this.addChild(sprite);
    }

    public bar() {
        var container = new Container;
        container.x = 380;
        container.y = 5;
        let data = Loader.shared.resources['chat_bar'].data.animations.chat_bar;
        console.log(data);
        data.forEach((element: any, index: number) => {
            var sprite = Sprite.from(element);
            sprite.scale.set(0.6);
            sprite.x = index * 102;
            sprite.interactive = true;

            sprite.on('pointertap', () => {
                this.currentIndex = index;
                this.currentChatSprite.x = 344 + this.currentIndex * 100;

                // Manager.currentScene.addChild(new confirmBox('确定开启聊天?', (_this) => {
                // ws.send({ "route": "chat", "msg": "转" })
                //     _this.destroy();
                // }))

            });

            container.addChild(sprite);
        });

        this.addChild(container);
        return container;
    }

    public backgroundSprite: any;
    public background() {
        let home_chat = Sprite.from('home_chat');
        home_chat.scale.x = 1.17;
        this.addChild(home_chat);

        this.backgroundSprite = home_chat;

        home_chat.interactive = true;
        home_chat.on("pointerdown", (event) => this.chatFull(event, 'down'));
        home_chat.on("pointerup", (event) => this.chatFull(event, 'up'));

    }

    public act: any = { 'down': 0, 'up': 0 }
    public chatFull(event: any, act: string) {
        return;
        this.act[act] = event.data.global.y;
        if (act == 'down') return;

        if (this.act['down'] > this.act['up']) {
            gsap.to(this.inputBg, { duration: 0.3, y: this.backgroundSprite.height - this.inputBg.height });
            gsap.to(this, { duration: 0.3, y: Manager.height - this.backgroundSprite.height });
        } else {
            Manager.currentScene.alpha = 1;
            gsap.to(this.inputBg, { duration: 0.3, y: Manager.height - 700 - this.inputBg.height });
            gsap.to(this, { duration: 0.3, y: 700 });
        }
    }
}