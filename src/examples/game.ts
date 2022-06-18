// import { Container, Texture } from "pixi.js";
// import { IScene, Manager } from "../Manager";
// import { Back } from "../components/back";
// import { MainScene } from "../scenes/MainScene";
// import { ws } from "../components/websocket"
// import { Button } from "../components/button";

// import { People } from "../components/game";

// export class GameScene extends Container implements IScene {

//     constructor() {
//         super();

//         ws.send({ "route": "npc", "uri": "join" });

//         let name = 'r1n'
//         let people = new People({
//             sex: 1,
//             n: Number(0),
//             T: 'T2',
//             scale: -1,
//             pe: {
//                 head: name + '_h',
//                 foot: name + '_f',
//                 body: name + '_b',
//             }
//         });
//         people.scale.x = 20;
//         people.scale.y = 20;
//         people.x = Manager.width * 0.7;
//         people.y = 100;

//         this.addChild(people);

//         let but = new Button('runExa');
//         this.addChild(but);

//         but.on("pointertap", () => {
//             let sfx = ''
//             if (people.run) {
//                 sfx = '_run'
//             }
//             people.run = people.run ? false : true;
//             people.struct.body.texture = Texture.from(name + '_b' + sfx);
//             people.struct.foot.texture = Texture.from(name + '_f' + sfx);
//         }, this);


//         this.addChild(new Back(MainScene));
//     }

//     public update(): void { }
// }
