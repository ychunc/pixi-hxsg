import { Loader, Text } from "pixi.js";
import { Spine as pixiSpine, ISkeletonData } from 'pixi-spine';
import { ManageContainer, Manager, } from "../Manager";

export class SpineTest extends ManageContainer {

    public spine: pixiSpine;
    public animationIndex: number = 0 + 1;
    public animations: string[] = [];
    public skinIndex: number = 0;
    public skins: string[] = [];

    public isSkins: boolean = false;

    constructor() {
        super();

        let spineName = String('spine' + (Math.floor(Math.random() * 13) + 1));
        // spineName = 'spine14'
        let resources = Loader.shared.resources;


        for (const key in resources[spineName].data.animations) {
            this.animations.push(key);
        }

        for (const key in resources[spineName].data.skins) {
            this.skins.push(key);
        }


        let spineData = <ISkeletonData>resources[spineName].spineData;

        this.spine = new pixiSpine(spineData);

        this.spine.update(0)

        this.spine.scale.set(0.4);
        // this.spine.scale.set(2); 

        this.spine.position.x -= this.spine.width / 2;
        this.spine.position.y -= this.spine.height / 2;

        this.spine.interactive = true;
        this.spine.buttonMode = true;
        this.spine.on("pointertap", this.animation, this);

        // 速度
        this.spine.state.timeScale = 1;

        // 动作
        this.spine.state.setAnimation(0, this.animations[this.animationIndex], true);

        // Skin
        if (this.isSkins) {
            this.spine.skeleton.setSkinByName(this.skins[this.skinIndex + 1]);
            this.spine.skeleton.setSlotsToSetupPose();
        }

        this.addChild(this.spine);

        // text
        let t = spineName
        let text = new Text(t + Manager.height + ',' + parseInt(String(this.spine.height)), { fill: [0xffffff] });
        text.y = Manager.height - text.height;
        text.interactive = true;
        this.addChild(text);
        text.on("pointertap", () => Manager.changeScene(new SpineTest));


        Manager.app.stage.interactive = true;
        Manager.app.stage.on('mousemove', pointerMove);
        Manager.app.stage.on('pointermove', pointerMove);

        let _this = this;


        function pointerMove(event: { data: { global: { x: number; y: number; }; }; }) {
            _this.spine.position.x = event.data.global.x //- _this.spine.width / 2;
            _this.spine.position.y = event.data.global.y + _this.spine.height / 2 - 100;
        }

    }

    public animation() {
        this.animationIndex += 1;
        this.skinIndex += 1;

        if (this.animationIndex >= this.animations.length) {
            this.animationIndex = 0;
            this.animationIndex = 1;

            Manager.changeScene(new SpineTest)
        }
        this.spine.state.setAnimation(0, this.animations[this.animationIndex], true);

        if (this.skinIndex >= this.skins.length) {
            this.skinIndex = 1;
        }
        if (this.isSkins) {
            this.spine.skeleton.setSkinByName(this.skins[this.skinIndex]);
            this.spine.skeleton.setSlotsToSetupPose();
        }
    }


}