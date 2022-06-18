import { Container, Sprite, Texture } from "pixi.js";
import { Scrollbox } from 'pixi-scrollbox'
import { IScene, Manager } from "../Manager";
import { MainScene } from "../scenes/MainScene";
import { Back } from "../components/back";


export class Scroll extends Container implements IScene {

    constructor() {
        super();

        // create the scrollbox
        const scrollbox = new Scrollbox({
            boxWidth: Manager.width,
            boxHeight: Manager.height,
        })

        const sprite = scrollbox.content.addChild(new Sprite(Texture.WHITE))
        sprite.width = Manager.width;
        sprite.height = Manager.height + 300;
        sprite.tint = 0x000000;

        for (let index = 0; index < 10; index++) {

            const clampy = Sprite.from("leg");

            clampy.height = clampy.height * Manager.width / clampy.width;
            clampy.width = Manager.width;
            clampy.y = index * 500;
            scrollbox.content.addChild(clampy);
        }

        // force an update of the scrollbox's calculations after updating the children
        scrollbox.update();

        this.addChild(scrollbox)

        this.addChild(new Back(MainScene))
    }

    public update() { }

}