import { Container, Sprite, InteractionEvent } from "pixi.js";

export class Scene extends Container {
    // private readonly screenWidth: number;
    // private readonly screenHeight: number;

    // We promoted clampy to a member of the class
    private clampy: Sprite;
    private clampy2: Sprite;
    // private data: any;
    constructor() {
        super(); // Mandatory! This calls the superclass constructor.

        this.clampy = Sprite.from("ht.png");
        this.clampy.width = 782 / 2;
        this.clampy.height = 414 / 2;
        this.clampy.x = 750 - this.clampy.width;
        this.clampy.y = this.clampy.height / 2;
        this.clampy.anchor.set(0.5);
        this.addChild(this.clampy);

        this.clampy2 = Sprite.from("ht.png");
        this.clampy2.width = 750;
        this.clampy2.height = 500;
        this.clampy2.x = this.clampy2.width / 2;
        this.clampy2.y = 1334 - this.clampy2.height / 2;
        this.clampy2.anchor.set(0.5);
        this.addChild(this.clampy2);

        this.clampy.interactive = true;
        this.clampy.on("pointertap", this.onClicky, this);
        this.clampy.on("pointerdown", this.onDragStart, this);
        this.clampy.on("pointermove", this.onDragMove);
    }

    private onDragStart() {
    }

    private onDragMove() {//event: any) {
        // this.x = event.data.global.x;
        // this.y = event.data.global.y;
    }


    private onClicky(e: InteractionEvent): void {
        console.log("click!", e)
    }
}