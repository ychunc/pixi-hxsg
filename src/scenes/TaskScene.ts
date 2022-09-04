import { IScene, Manager, ManageContainer } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "./MainScene";
import { Header, Frame, SceneTite } from "../components/component";
import { ws } from "../components/websocket";

export class TaskScene extends ManageContainer implements IScene {

    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTite('剧情任务');

        // app bakcgroupd
        Manager.backgroundColor(0x360033);

        ws.send({ route: 'task', 'id': 3 });

        this.interactive = true;
        this.on('pointertap', () => {
            console.log('ok');
        })

        this.addChild(frame, header, title, new Back(MainScene));
    }

}