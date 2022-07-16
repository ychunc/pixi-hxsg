import { Container, Graphics, Loader, Sprite, Texture, Text } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { assets } from "../assets";
import gsap from "gsap";
import { LoginScene } from "./LoginScene";

export class LoaderScene extends Container implements IScene {
    public data: any;

    private loaderBar: Container;
    private loaderBarBoder: Graphics;
    private loaderBarFill: Graphics;

    private text: Text;
    constructor() {
        super();

        const loaderBarWidth = Manager.width * 1;

        this.loaderBarFill = new Graphics();
        this.loaderBarFill.beginFill(0xfb7299, 1)
        this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50);
        this.loaderBarFill.endFill();
        this.loaderBarFill.scale.x = 0;

        this.loaderBarBoder = new Graphics();
        this.loaderBarBoder.lineStyle(10, 0x0, 1);
        this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50);

        this.loaderBar = new Container();
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBoder);
        this.loaderBar.position.x = (Manager.width - this.loaderBar.width) / 2;
        // this.loaderBar.position.y = (Manager.height - this.loaderBar.height) / 2;
        this.loaderBar.position.y = (Manager.height - this.loaderBar.height);

        this.text = new Text('资源加载中...' + 0, { fill: ['#ffffff'] });
        this.text.y = this.loaderBar.height / 2 - this.text.height / 2;
        this.text.x = this.loaderBar.width / 2 - this.text.width / 2;
        this.loaderBar.addChild(this.text);

        this.addChild(this.loaderBar);

        Loader.shared.add(assets);

        Loader.shared.onProgress.add(this.downloadProgress, this);
        Loader.shared.onComplete.once(this.gameLoaded, this);

        Loader.shared.load();


        // Get the texture for rope.
        const starTexture = Texture.from('/images/star.png');
        // Create the stars
        // const stars = [];
        for (let i = 0; i < this.starAmount; i++) {
            const star = {
                sprite: new Sprite(starTexture),
                z: 0,
                x: 0,
                y: 0,
            };
            star.sprite.anchor.x = 0.5;
            star.sprite.anchor.y = 0.7;

            this.randomizeStar(star, true);
            this.addChild(star.sprite);
            this.stars.push(star);
        }
    }

    public stars: any = [];
    public starAmount = 1000;
    public cameraZ = 0;
    public fov = 20;
    public baseSpeed = 0.025;
    public speed = 0;
    public warpSpeed = 0;
    public starStretch = 5;
    public starBaseSize = 0.05;

    private downloadProgress(loader: Loader): void {
        const progressRatio = loader.progress / 100;
        this.loaderBarFill.scale.x = progressRatio;
        this.text.text = '资源加载中...' + (progressRatio * 100).toFixed(0) + '%';
        this.warpSpeed = progressRatio;
    }

    private gameLoaded(): void {
        this.loaderBar.visible = false;
        gsap.to(this, { duration: 0.25, warpSpeed: 2, /**y: -500**/ }).eventCallback('onComplete', () => {
            Manager.changeScene(new LoginScene());
        });
    }

    public randomizeStar(star: any, initial: any = null) {
        star.z = initial ? Math.random() * 2000 : this.cameraZ + Math.random() * 1000 + 2000;

        // Calculate star positions with radial random coordinate so no star hits the camera.
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }


    public update(delta: any): void {
        // To be a scene we must have the update method even if we don't use it.

        // Simple easing. This should be changed to proper easing function when used for real.
        this.speed += (this.warpSpeed - this.speed) / 20;
        this.cameraZ += delta * 10 * (this.speed + this.baseSpeed);
        for (let i = 0; i < this.starAmount; i++) {
            const star = this.stars[i];
            if (star.z < this.cameraZ) this.randomizeStar(star);

            // Map star 3d position to 2d with really simple projection
            const z = star.z - this.cameraZ;
            star.sprite.x = star.x * (this.fov / z) * Manager.width + Manager.width / 2;
            star.sprite.y = star.y * (this.fov / z) * Manager.width + Manager.height / 2;

            // Calculate star scale & rotation.
            const dxCenter = star.sprite.x - Manager.width / 2;
            const dyCenter = star.sprite.y - Manager.height / 2;
            const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
            const distanceScale = Math.max(0, (2000 - z) / 2000);
            star.sprite.scale.x = distanceScale * this.starBaseSize;
            // Star is looking towards center so that y axis is towards center.
            // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
            star.sprite.scale.y = distanceScale * this.starBaseSize + distanceScale * this.speed * this.starStretch * distanceCenter / Manager.width;
            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
        }
    }
}