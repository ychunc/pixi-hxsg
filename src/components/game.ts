import { Container, Sprite, SCALE_MODES, DisplayObject, Graphics } from "pixi.js";
import { gsap } from "gsap"

import { Manager } from "../Manager";
import { GameScene } from "../scenes/GameScene";


export interface IST {
    sex: number;
    scale: number;
    T: string,
    n: number,
    pe: {
        body: string;
        foot: string;
        header: string;
    }
}

// type Callback = (...args: any[]) => void | null;


export class People extends Container {
    // 需要创建什么额外的配饰,可以继续添加子Container,然后set/get

    public data: IST;
    public struct: any = {
        body: Sprite,
        header: Sprite,
        foot: Sprite,
        bloodBg: Sprite,
        hp: Sprite,
        mp: Sprite,
    };
    public blood: any;

    public zoom: number = 3.5;

    public run: boolean = false;

    public alive: boolean = true;

    /**
     * buff 容器
     */
    public buff: Container = new Container;

    constructor(data: IST, GameScene: GameScene | any = {}) {
        super();

        this.data = data;

        this.struct = [];
        for (const [key, val] of Object.entries(this.data.pe)) {
            this.struct[key] = this.from(val, data.scale);
            this.addChild(this.struct[key]);
        }

        // 定死规则 [body.y]
        this.struct.body.y = this.struct.header.height;

        // 血条
        this.addChild(this.bloodContainer(data.scale));

        // buff
        this.addChild(this.buffContainer());

        this.scale.x *= this.zoom;
        this.scale.y *= this.zoom;

        // 可点范围
        const graphics = new Graphics();
        graphics.beginFill(0x00FFFF);
        graphics.drawRect(0, 0, 30, 40);
        graphics.endFill();
        graphics.alpha = 0;
        graphics.x = this.data.T == 'P1' ? -4 : -26;
        this.addChild(graphics);

        // 开启互动
        graphics.interactive = true;
        // graphics.on("pointertap",()=>callback(this))

        graphics.on("pointertap", () => GameScene.onSelected(this.data), this);
    }

    public from(name: string, scale: any): Sprite {
        let sprite = Sprite.from(name);
        sprite.scale.x *= scale;
        sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        return sprite;
    }

    public bloodContainer(scale: any) {
        let blood = new Container;
        blood.addChild(this.bloodBg());
        blood.addChild(this.hp());
        blood.addChild(this.mp());

        blood.scale.x *= scale;
        blood.x = -8 * scale;
        blood.y = -12;
        this.blood = blood;
        return blood;
    }

    public buffContainer() {
        this.buff.scale.set(0.8);
        gsap.to(this.buff, { duration: 0.25, y: this.buff.y + 3, ease: 'none', repeat: 100000, yoyo: true });
        return this.buff;
    }

    public bloodBg() {
        let bg = Sprite.from('hpmp_bg');
        bg.scale.x = 0.4;
        bg.scale.y = 0.5;
        bg.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        this.struct.bloodBg = bg;
        return bg;
    }

    public HMPLEN: number = 150;

    public HPMask: any;
    public hp(): DisplayObject {
        let hp = Sprite.from('home_hp');
        hp.scale.x = 0.216;
        hp.scale.y = 0.28;
        hp.y = 3;
        hp.x = 0.3;
        hp.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        hp.mask = this.HPMask = this.getHPMask(1);
        hp.addChild(hp.mask);
        this.struct.hp = hp;
        return hp;
    }

    public setHPMask(rate: number) {
        this.HPMask.destroy();
        this.struct.hp.mask = this.HPMask = this.getHPMask(rate);
        this.struct.hp.addChild(this.struct.hp.mask);
    }

    public getHPMask(rate: number) {
        let mask = new Graphics();
        mask.beginFill(0xFF0000);
        mask.drawRect(0, 0, this.HMPLEN * rate, 12.5);
        mask.endFill();
        mask.y = 1.1;
        return mask;
    }

    public mp(): DisplayObject {
        let mp = Sprite.from('home_mp');
        mp.scale.x = 0.216;
        mp.scale.y = 0.32;
        mp.y = 6.86;
        mp.x = 3.1;
        mp.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        let mask = new Graphics();
        mask.beginFill(0x0000FF);
        mask.drawRect(0, 0, this.HMPLEN, 12.05);
        mask.endFill();
        mask.y = 1.5;
        mp.mask = mask;
        mp.addChild(mask);
        this.struct.mp = mp;
        return mp;
    }

    public setVisible(visible: boolean) {
        this.alive = visible;
        for (const key in this.struct) {
            this.struct[key].visible = visible;
        }
    }
}


/**
 * 队伍生成类
 * @extends Container
 */
export class Team extends Container {
    public GameScene: GameScene;

    public PP: any = { 'P1': [], 'P2': [] };

    /**
     * 边缘距离
     */
    public static edgeX = 30;

    constructor(GameScene: GameScene, data: { P1: any; P2: any; }) {
        super();

        // 主对象
        this.GameScene = GameScene

        // 开启层级
        this.sortableChildren = true;

        let y = 80;
        let offset = 120;
        let animX = 200;

        let P1X = Team.edgeX + 10;
        var pos1 = [
            { 'x': P1X, 'y': y * 0 },
            { 'x': P1X + offset, 'y': y * 1 },
            { 'x': P1X, 'y': y * 2 },
            { 'x': P1X + offset, 'y': y * 3 },
        ];

        for (const key in data.P1) {
            let name = data.P1[key]
            let people = new People({
                sex: 1,
                n: Number(key),
                T: 'P1',
                scale: 1,
                pe: {
                    header: name + '_h',
                    foot: name + '_f',
                    body: name + '_b',
                }
            }, GameScene);

            people.x = pos1[Number(key)]['x'] - animX;
            people.y = Number(key) * 80 + 50;

            this.PP['P1'][key] = people;
            this.addChild(people);

            // 入场动画
            setTimeout(() => {
                gsap.to(people, { duration: 0.25, ease: "back.out(1.7)", x: pos1[Number(key)]['x'] });
            }, 10);

            // 呼吸
            gsap.to(people.struct.body.scale,
                { duration: 0.25, y: people.struct.body.scale.y * 1.2, ease: 'none', repeat: 100000, yoyo: true }
            );
        }

        let P2X = Manager.width - Team.edgeX;;
        var pos2 = [
            { 'x': P2X - offset, 'y': y * 0 },
            { 'x': P2X, 'y': y * 1 },
            { 'x': P2X - offset, 'y': y * 2 },
            { 'x': P2X, 'y': y * 3 },
        ];

        for (const key in data.P2) {
            let name = data.P2[key]
            let people = new People({
                sex: 1,
                n: Number(key),
                T: 'P2',
                scale: -1,
                pe: {
                    header: name + '_h',
                    foot: name + '_f',
                    body: name + '_b',
                }
            }, GameScene);

            people.x = pos2[Number(key)]['x'] + animX;
            people.y = Number(key) * 80 + 50;

            this.PP['P2'][key] = people;
            this.addChild(people);

            // 入场动画
            setTimeout(() => {
                gsap.to(people, { duration: 0.25, ease: "back.out(1.7)", x: pos2[Number(key)]['x'] });
            }, 10);

            // 呼吸
            gsap.to(people.struct.body.scale,
                { duration: 0.25, y: people.struct.body.scale.y * 1.2, ease: 'none', repeat: 100000, yoyo: true }
            );
        }

        // 查看战场容器大小 [TEST]
        const graphics = new Graphics();
        graphics.beginFill(0xDE3249);
        graphics.drawRect(0, 0, this.width, this.height);
        graphics.endFill();
        graphics.alpha = 0.5;
        // this.addChild(graphics);
    }

}
