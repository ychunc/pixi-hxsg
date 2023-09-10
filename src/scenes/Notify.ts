import { IScene, ManageContainer, Manager } from "../Manager";
import { Frame, Header, Back } from "../components/component";
import { MainScene } from "./MainScene";

export class Notify extends ManageContainer implements IScene {

    constructor() {
        super();

        // app bakcgroupd
        Manager.backgroundColor(0x360033);

        let header = new Header();
        let frame = new Frame();

        this.addChild(frame, header, new Back(MainScene));
    }

}