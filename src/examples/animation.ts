import { Container, AnimatedSprite, Texture } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "../scenes/MainScene";

export class AnimationScene extends Container implements IScene {

    public anim: AnimatedSprite;

    constructor() {
        super();

        const frames = [];

        for (let i = 0; i <= 9; i++) {
            const val = i < 10 ? `${i}` : i;
            frames.push(Texture.from(`${val}.png`));
        }

        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        console.log(frames);

        this.anim = new AnimatedSprite(frames);

        this.anim.x = Manager.app.screen.width / 2;
        this.anim.y = Manager.app.screen.height / 2;
        this.anim.anchor.set(0.5);
        this.anim.animationSpeed = 0.5;
        this.anim.play();

        this.addChild(this.anim);

        this.addChild(new Back(MainScene))
    }

    public update() {
        // this.anim.rotation += 0.01;
    }

}