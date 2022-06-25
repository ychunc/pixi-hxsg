import { Container, Sprite, Loader } from "pixi.js";
import { Manager } from "../Manager";
import { confirmBox } from "./component";

export class Chat extends Container {

    public currentIndex: number = 0;

    constructor() {
        super();

        this.y = 700;

        this.background();

        this.currentChat();

        this.bar();
    }

    public currentChatSprite: Sprite = new Sprite;

    public currentChat() {
        var sprite = Sprite.from('chat_bg');
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

                Manager.currentScene.addChild(new confirmBox('确定开启聊天?', () => {
                }))

            });

            container.addChild(sprite);
        });

        this.addChild(container);
        return container;
    }

    public background() {
        let home_chat = Sprite.from('home_chat');
        home_chat.scale.x = 1.17;
        this.addChild(home_chat)
    }

}