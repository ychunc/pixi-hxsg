import { Container } from "pixi.js";
import { IScene } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";

export class EquipScene extends Container implements IScene {
    public data: any;

    constructor() {
        super();

        this.addChild(new Back(MainScene));
    }
    public update(framesPassed: number): void {
        framesPassed
    }
}