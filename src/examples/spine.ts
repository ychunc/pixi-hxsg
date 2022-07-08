import { Container, filters, Graphics, Loader, Rectangle, SCALE_MODES, Sprite } from "pixi.js";
import { Spine, ISkeletonData } from 'pixi-spine';
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "../scenes/MainScene";
import gsap from "gsap";

export class SpineScene extends Container implements IScene {

    public spine: Spine;
    public n: number = 0;
    public animations: string[];

    constructor() {
        super();

        // Spine
        let resources = Loader.shared.resources;

        console.log(resources.spine);
        // this.animations = resources.spine.data.animations

        this.animations = [];
        for (const key in resources.spine.data.animations) {
            this.animations.push(key);
        }

        // let spineData = <ISkeletonData>resources.girl06_card.spineData;
        let spineData = <ISkeletonData>resources.spine.spineData;

        this.spine = new Spine(spineData);


        this.spine.x = Manager.width / 2;
        this.spine.y = Manager.height / 2;

        this.spine.scale.x = Manager.ratio;
        this.spine.scale.y = Manager.ratio;

        this.addChild(this.spine);

        this.spine.interactive = true;
        this.spine.buttonMode = true;

        this.spine.on("pointertap", this.animation, this);

        // 运行动作
        // if (this.spine.state.hasAnimation('idle')) {
        //     this.spine.state.setAnimation(0, 'idle', true);
        //     this.spine.state.timeScale = 1;
        // }

        this.spine.state.setAnimation(0, this.animations[this.n], true);

        gsap.to(this.spine, { duration: 1.5, yoyo: true, repeat: 600, ease: "power4.out", alpha: 0.1 });
        gsap.to(this.spine.scale, { duration: 1.5, yoyo: true, repeat: 600, ease: "power4.out", x: Manager.ratio * 1.5, y: Manager.ratio * 1.5 });

        let back = new Back(MainScene, () => { }, (_this: any) => {
            gsap.to(_this, { alpha: 0, duration: 1 });
        });
        back.alpha = 0.1;
        this.addChild(back)

        this.setup()
    }

    public animation() {
        this.spine.state.setAnimation(0, this.animations[this.n], true);
        this.n += 1;
        if (this.n >= this.animations.length) {
            this.n = 0;
        }
    }

    public update() { }

    setup() {
        // Inner radius of the circle
        const radius = 150;

        // The blur amount
        const blurSize = 100;
        const circle = new Graphics()
            .beginFill(0xFF0000)
            .drawCircle(radius + blurSize, radius + blurSize, radius)
            .endFill();
        circle.filters = [new filters.BlurFilter(blurSize)];

        const bounds = new Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
        const texture = Manager.app.renderer.generateTexture(circle, SCALE_MODES.NEAREST, 1, bounds);
        const focus = new Sprite(texture);

        Manager.app.stage.addChild(focus);
        this.spine.mask = focus;

        Manager.app.stage.interactive = true;
        Manager.app.stage.on('mousemove', pointerMove);
        Manager.app.stage.on('pointermove', pointerMove);

        function pointerMove(event: { data: { global: { x: number; y: number; }; }; }) {
            focus.position.x = event.data.global.x - focus.width / 2;
            focus.position.y = event.data.global.y - focus.height / 2;
        }
    }


}