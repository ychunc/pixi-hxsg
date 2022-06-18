import { Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap"

import { GameScene } from "../scenes/GameScene";
import { Animation } from "./animation";
import { Manager } from "../Manager";

export class Skill {

    public tl: any;

    public data: any;

    // 技能镜头移动速度
    public static skillSpend: any = {
        2: 0,
        6: 0.5,
    }

    constructor(data: any) {

        this.tl = gsap.timeline();;

        this.data = data;
        switch (parseInt(data.sk)) {
            case 0:
                // this.ptgj();
                break;
            case 1:
                // this.psdh();
                break;
            case 2:
                this.smyj();
                break;
            case 3:
            case 4:
            case 5:
                // this.hdwl();
                break;
            case 6:
                this.wlhd();
                break;
            case 8:
                // this.hfhy();
                break;
            case 9:
                this.lphs();
                break;
            case 10:
                // this.grjt();
                break;
            case 11:
                // this.lbwb();
                break;
            case 12:
                // this.mshc();
                break;
                defautl:
                console.log("技能:" + data.sk);
                break;
        }

        // 镜头恢复
        this.resetStage();

        return this;
    }

    public timeline(): any {
        return this.tl;
    }

    // 还原镜头
    public resetStage() {
        let T = GameScene.T;

        this.tl.add(gsap.to(T, { duration: 0.00001, x: 0 }).eventCallback('onComplete', () => {
            // 背景恢复
            GameScene.GameBg.visible = true;
            // 扣血数字
            this.bloodAnimation();
        }));

        this.tl.add(gsap.to({}, { duration: 0.35 }));
    }

    // 伤害动画
    public bloodAnimation() {
        let T = GameScene.T;

        for (const key in this.data['pk_s']['ps']) {
            // 扣血动画
            var row = this.data['pk_s']['ps'][key];
            let PS = this.data['pk_s']['p'].toLocaleUpperCase();
            T.PP[PS][row['n']].addChild(Animation.bloodNumAnimation(PS, row.blood_hurt));

            // 是否死亡
            if (row.blood_end <= 0) {
                // 人物死亡
                T.PP[PS][row['n']].setVisible(false);
                // 死亡动画
                T.PP[PS][row['n']].addChild(Animation.dead(PS));
                // 显示凉席 || 坟墓
                if (GameScene.game_type == 'npc' && PS == 'P1') {
                    var dead = Sprite.from('dead_2');
                } else {
                    var dead = Sprite.from('dead_' + (row['n'] == 0 ? '1' : '2'));
                }
                dead.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
                if (PS == 'P1') {
                    dead.position.x = 0 - dead.width / 2;
                    dead.scale.x *= -1;
                }
                dead.x = 24 * (PS == 'P1' ? 1 : -1);
                dead.y = 25;
                T.PP[PS][row['n']].addChild(dead);
            }
        }

    }

    public smyj() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        let PG = T.PP[row['pk_g']['p'].toLocaleUpperCase()][row['pk_g']['n']];
        let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][row['pk_s']['n']];

        let lineX = PS.x;
        let lineY = PS.y;

        // 路径线
        var line = new Graphics()
        line.beginFill(0xaeacae);
        line.drawRect(0, 0, 200, 6);
        line.endFill();

        line.scale.x = -0.2 * XB;
        line.scale.y = -0.2 * XB;
        line.x = -30 * XB;
        line.y = 19;

        this.tl.add(gsap.to({}, { duration: 0.001 }).eventCallback('onComplete', () => {
            PS.addChild(line);
        }));

        // 舍线
        this.tl.add(gsap.to(line, { x: 74 * XB, ease: "power4.in", alpha: 0.8, duration: 0.1 }));

        // 背景闪动
        this.tl.add(gsap.to({}, { duration: 0.03 }).eventCallback('onComplete', () => {
            GameScene.GameBg.visible = true;
        }));

        this.tl.add(gsap.to(line, { alpha: 0.4, duration: 0.05 }).eventCallback('onComplete', () => {
            line.destroy();
        }, [line]));

        this.tl.add(gsap.to({}, { duration: 0.06 }).eventCallback('onComplete', () => {
            GameScene.GameBg.visible = false;
        }));

        let PGX = PG.x;
        let PGY = PG.y;
        // 人物移动
        this.tl.add(gsap.to({}, { duration: 0 },).eventCallback('onComplete', () => {
            // 攻击方移动
            PG.x = lineX + 180 * XB;
            PG.y = lineY;

            // 攻击方人物变化
            PG.struct.body.texture = Texture.from(PG.data.pe.body + '_run');
            PG.struct.foot.texture = Texture.from(PG.data.pe.foot + '_run');

            // 防守方人物变化
            PS.struct.header.x -= 5 * XB;
        }));

        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 血动画
            let animPS = Animation.blood();
            animPS.y = 18;
            animPS.scale.x = XB;
            PS.addChild(animPS);

            let animPG = Animation.blood();
            animPG.y = 18;
            animPG.scale.x = XB * -1;
            PG.addChild(animPG);
        }));

        // 等待时间
        this.tl.add(gsap.to({}, { duration: 0.68 }));

        // 人物复位
        this.tl.add(gsap.to({}, { duration: 0 }).eventCallback('onComplete', () => {
            PG.x = PGX;
            PG.y = PGY;

            // 攻击方人物复位
            PG.struct.body.texture = Texture.from(PG.data.pe.body);
            PG.struct.foot.texture = Texture.from(PG.data.pe.foot);

            // 防守方人物复位
            PS.struct.header.x += 5 * XB;
        }));

    }

    public lphs() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        let PG = T.PP[row['pk_g']['p'].toLocaleUpperCase()][row['pk_g']['n']];
        let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][row['pk_s']['n']];

        // 人物移动
        let PGX = PG.x;
        let PGY = PG.y;

        this.tl.add(gsap.to({}, { duration: 0.1 }));
        this.tl.add(gsap.to({}, { duration: 0 },).eventCallback('onComplete', () => {
            // 劈动画
            let anim = Animation.lphs();
            anim.x = XB == 1 ? 16 : 38;
            anim.y = 20;
            PS.addChild(anim);

            // 攻击人物隐藏
            PG.visible = false;

            // 震动
            Skill.shock();
        }));

        // 人物进攻
        this.tl.add(gsap.to({}, { duration: 0.1 }).eventCallback('onComplete', () => {
            // 攻击人物隐藏
            PG.visible = true;
            // 攻击方移动
            PG.x = PS.x - 100 * XB;
            PG.y = PS.y;
            // 攻击方人物变化
            PG.struct.foot.texture = Texture.from(PG.data.pe.foot + '_run');
            PG.struct.foot.x += 8 * XB;
        }));

        // 回退运动
        this.tl.add(gsap.to(PG, { duration: 0.8, x: PG.x }));

        // 人物复位
        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 攻击方移动
            PG.x = PGX;
            PG.y = PGY;
            // 攻击方人物变化
            PG.struct.foot.texture = Texture.from(PG.data.pe.foot);
            PG.struct.foot.x -= 8 * XB;
        }));

    }

    public ptgj() {
        console.log('ptgj');
    }

    public wlhd() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        let PG = T.PP[row['pk_g']['p'].toLocaleUpperCase()][row['pk_g']['n']];
        let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][row['pk_s']['n']];
        console.log(XB, PG, PS);
        console.log(PS.struct.header.x);

        let an = [
            { t: 0.0001, x: 10 * XB * -1, y: 10 }, // 正中间
            { t: 0.2, x: 28 * XB * -1, y: -15 }, // 前上
            { t: 0.16, x: 28 * XB * -1, y: 10 }, // 后上
            { t: 0.3, x: -8 * XB * -1, y: 15 }, // 后下
            { t: 0.18, x: 28 * XB * -1, y: 10 }, // 前下
        ];

        for (let index = 0; index < an.length; index++) {
            this.tl.add(gsap.to({}, { duration: an[index].t }).eventCallback('onComplete', () => {
                // 雷动画
                let anim = Animation.wlhd();
                anim.x = an[index].x;
                anim.y = an[index].y;
                PS.addChild(anim);
                if (index % 2 == 0) {
                    PS.struct.header.x = 2;
                } else {
                    PS.struct.header.x = -2;
                }

                if (index == 0) {
                    let tl = gsap.timeline();
                    for (let n = 0; n < 3; n++) {
                        Skill.shock(tl);
                    }
                }
            }));

        }
        this.tl.add(gsap.to(PS.struct.header, { duration: 0.00001, x: 0 }));
        this.tl.add(gsap.to({}, { duration: 0.3 }));
    }

    public static shock(tl = gsap.timeline()) {
        tl.add(gsap.to({}, { duration: 0.04 }).eventCallback('onComplete', () => {
            Manager.currentScene.y += 6;
        }));
        tl.add(gsap.to({}, { duration: 0.04 }).eventCallback('onComplete', () => {
            Manager.currentScene.y -= 6;
        }));
    }

}