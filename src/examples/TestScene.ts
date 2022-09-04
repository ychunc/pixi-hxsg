import { Texture } from "pixi.js";
import gsap from "gsap";
import { IScene, ManageContainer, Manager } from "../Manager";
import { Back } from "../components/back";
import { Button, Frame, Header, StyleText } from "../components/component";
import { People } from "../components/game";
import { LoginScene } from "../scenes/LoginScene";
import { Animation } from "../components/animation";


export class TestScene extends ManageContainer implements IScene {

    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();

        // app backgroundColor
        Manager.backgroundColor(0xFFFFFF);
        Manager.backgroundColor(0x000);

        // title
        let title = new StyleText('人物调试', {
            fontSize: 40,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        })
        title.y = header.height;
        title.x = Manager.width / 2 - title.width / 2;
        this.addChild(title);


        var name = 'r3nz'
        // var name = 'r1nz'
        // var name = 'n1n'
        var P1 = new People({
            sex: 1,
            n: Number(1),
            T: 'P1',
            scale: 1,
            pe: {
                header: name + '_h',
                foot: name + '_f',
                body: name + '_b',
            }
        })

        P1.scale.set(10);
        P1.x = Manager.width / 2 - P1.width / 2;
        P1.y = Manager.height / 5;

        console.log('p', P1, P1.width,
            'h', P1.struct.header.width,
            'b', P1.struct.body,
            'f', P1.struct.foot.width
        );

        // 呼吸
        // P1.struct.body.pivot.y = P1.struct.body.height;
        P1.struct.body.y = P1.struct.header.height;
        // P1.struct.body.scale.y *= 1.5;
        gsap.to(P1.struct.body.scale, { duration: 0.25, y: P1.struct.body.scale.y * 1.2, ease: 'none', repeat: 100000, yoyo: true });

        P1.x = Manager.width / 2 - P1.width / 2;
        this.addChild(P1);

        var P2 = new People({
            sex: 1,
            n: Number(1),
            T: 'P1',
            scale: 1,
            pe: {
                header: name + '_h',
                foot: name + '_f',
                body: name + '_b',
            }
        })
        P2.scale.set(2)
        P2.x = Manager.width - 250;
        P2.y = Manager.height / 3 + 100;
        console.log('p', P2, P2.width,
            'h', P2.struct.header.width,
            'b', P2.struct.body.width,
            'f', P2.struct.foot.width
        );

        // 呼吸
        // P2.struct.body.pivot.y = P2.struct.body.height;
        P2.struct.body.y = P2.struct.header.height;
        gsap.to(P2.struct.body.scale, { duration: 0.25, y: P2.struct.body.scale.y * 1.2, ease: 'none', repeat: 100000, yoyo: true });

        this.addChild(P2);

        var but = new Button('run')
        var run = true;
        but.on('pointertap', () => {
            P1.struct.foot.texture = Texture.from(P1.data.pe.foot + (run ? '_run' : ''));
            P1.struct.body.texture = Texture.from(P1.data.pe.body + (run ? '_run' : ''));

            P2.struct.foot.texture = Texture.from(P2.data.pe.foot + (run ? '_run' : ''));
            P2.struct.body.texture = Texture.from(P2.data.pe.body + (run ? '_run' : ''));
            run = run ? false : true;
        })
        but.x = Manager.width * 0.7
        but.y = Manager.height * 0.6
        this.addChild(but)


        let but7 = new Button('skill');
        but7.x = 165;
        but7.y = Manager.height * 0.92;
        this.addChild(but7);
        but7.on("pointertap", () => {
            var anim = Animation.fg_2();
            anim.scale.x = 2;
            anim.scale.y = 2;
            anim.y -= 100;
            but7.addChild(anim);
        }, this);


        this.addChild(frame, header, new Back(LoginScene));
    }


}