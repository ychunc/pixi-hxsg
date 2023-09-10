import gsap from "gsap";
import { Container, Sprite, Loader, DisplayObject } from "pixi.js";
import { Manager } from "../Manager";
import { Scrollbox, StyleText } from "./component";
import { Ws } from "./websocket";


export class Chat extends Container {

    private static instance: Chat;

    public currentIndex: number = 0;
    public scrollbox: Scrollbox;

    public static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Chat();
        return this.instance;
    }

    private constructor() {
        super();
        this.y = 700;

        this.zIndex = 1000;

        this.sortableChildren = true;

        this.background();

        this.currentChat();

        this.bar();

        this.chatInput();

        // Scrollbox
        this.scrollbox = new Scrollbox();
        this.setScrollbox();
    }

    public messageContainer: Container = new Container;

    public messageList: any = [];

    public message(t: number, txt: string, n: string = '') {
        let container = new Container();

        let time = new StyleText(String(t));
        let nick = new StyleText(' ' + String(n) + ' ', { fill: ['#FFFF33'] });
        nick.x = time.width;
        let text = new StyleText(txt);
        text.x = time.width + nick.width;

        container.addChild(time, nick, text)
        this.push(container);
    }

    public push(child: DisplayObject) {
        child.y = -50;
        this.messageList.push(child);
        this.scrollbox.content.addChild(child);

        for (let index = 0; index < this.messageList.length; index++) {
            gsap.to(this.messageList[index], { duration: 0.5, y: (this.messageList.length - index - 1) * 50 }).eventCallback('onComplete', () => {
                if (index > 100) {
                    try {
                        this.messageList.shift().visible = false;
                    } catch (error) { }
                }
            });
        }
    }

    public setScrollbox() {
        this.scrollbox.overflow = 'hidden'; // 隐藏滚动条
        this.scrollbox.y = 52; // 内容的 Y
        this.scrollbox.setHeight(436); // 内容的 height
        this.scrollbox.setWidth(Manager.width);
        this.scrollbox.sprite.alpha = 0;
        this.scrollbox.sprite.height = 0;
        this.addChild(this.scrollbox);
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
            text.style.marginTop = '200px'
            this.input = text;

            document.body.appendChild(text);
            text.focus();
            text.onkeydown = (event) => {
                if (event.keyCode == 13) {
                    Ws.send({ "route": ["Chat", "chat"], "msg": text.value });
                    this.removeInput();
                }
            }

            text.onblur = () => {
                this.removeInput();
            };

            send.on('pointertap', () => {
                Ws.send({ "route": ["Chat", "chat"], "msg": text.value });
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
    }

    public act: any = { 'down': 0, 'up': 0, 'full': false }
    public chatFull(event: any, act: string) {
        this.act[act] = event.data.global.y;

        if (this.act['full']) {
            Manager.currentScene.alpha = 1;
            gsap.to(this.inputBg, { duration: 0.3, y: Manager.height - 700 - this.inputBg.height });
            gsap.to(this, { duration: 0.3, y: 700 });

            this.scrollbox.setHeight(436); // 内容的 height
        } else {
            gsap.to(this.inputBg, { duration: 0.3, y: this.backgroundSprite.height - this.inputBg.height });
            gsap.to(this, { duration: 0.3, y: Manager.height - this.backgroundSprite.height });

            this.scrollbox.setHeight(this.backgroundSprite.height - this.inputBg.height); // 内容的 height
        }
        this.act['full'] = !this.act['full'];
    }
}