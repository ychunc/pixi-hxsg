import { Container, Loader } from "pixi.js";
import { Spine as pixiSpine, ISkeletonData } from 'pixi-spine';
import { Manager } from "../Manager";

export class Spine extends Container {

    public spine: pixiSpine;
    public n: number = 0;
    public animations: string[];

    constructor() {
        super();

        let resources = Loader.shared.resources;

        this.animations = [];

        for (const key in resources.spine.data.animations) {
            this.animations.push(key);
        }

        let spineData = <ISkeletonData>resources.spine.spineData;

        this.spine = new pixiSpine(spineData);

        this.spine.x = Manager.width / 2;
        this.spine.y = Manager.height / 2;
        this.spine.scale.set(2);

        this.addChild(this.spine);

        this.spine.interactive = true;
        this.spine.buttonMode = true;
        this.spine.on("pointertap", this.animation, this);

        if (this.spine.state.hasAnimation(this.animations[this.n])) {
            this.spine.state.setAnimation(0, this.animations[this.n], true);
            this.spine.state.timeScale = 1;
        }
    }

    public animation() {
        this.spine.state.setAnimation(0, this.animations[this.n], true);
        this.n += 1;
        if (this.n >= this.animations.length) {
            this.n = 0;
        }
    }
}