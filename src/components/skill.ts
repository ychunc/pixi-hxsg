import { Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap"

import { GameScene } from "../scenes/GameScene";
import { Animation } from "./animation";
import { Manager } from "../Manager";

export class Skill {

    public tl: any;

    public data: any;

    constructor(data: any) {
        this.tl = gsap.timeline();;

        console.log('技能=>', data.sk);


        this.data = data;
        switch (parseInt(data.sk)) {
            case 0:
                this.ptgj();
                break;
            case 1:
                this.psdh();
                break;
            case 2:
                this.smyj();
                break;
            case 3:
            case 4:
            case 5:
                this.fg3();
                break;
            case 6:
                this.wlhd();
                break;
            case 7:
            case 71:
                this.wgjd();
                break;
            case 8:
                this.hfhy();
                break;
            case 9:
                this.lphs();
                break;
            case 10:
            case 11:
            case 12:
            case 13:
                this.fg2();
                break;
        }

        // 镜头恢复
        this.resetStage();

        return this;
    }

    public timeline(): any {
        return this.tl;
    }

    /**
     * 获取起手X
     * @param item 
     * @returns startX
     */
    public static getStartX(item: any): number {
        let PG = item.pk_g.p.toLocaleUpperCase();
        var startX = 0;

        if ([0, 71].indexOf(parseInt(item.sk)) == -1) {
            startX = (Manager.width / 2 - 100) * (PG == 'P1' ? 1 : -1)
        }
        return startX;
    }

    /**
     * 还原镜头
     */
    public resetStage() {
        let T = GameScene.T;

        this.tl.add(gsap.to(T, { duration: 0.00001, x: 0 }).eventCallback('onComplete', () => {
            // 背景恢复
            GameScene.GameBg.display(true);
            // 扣血数字
            this.bloodAnimation(this.data['pk_s']);
            this.bloodAnimation(this.data['pk_g']);
        }));

        this.tl.add(gsap.to({}, { duration: 0.35 }));
    }

    /**
     * 技能图标
     * @param sk 
     * @returns 
     */
    public static skillBuff(sk: number): number {
        var buffs: any = {
            3: 0,
            4: 3,
            5: 1,
            7: 4,
            10: 7,
            11: 6,
        }
        if (sk in buffs) return buffs[sk];
        return 0;
    }

    /**
     * 伤害动画
     * @param pk_row 
     */
    public bloodAnimation(pk_row: any) {
        let T = GameScene.T;

        for (const key in pk_row['ps']) {
            // 扣血动画
            var row = pk_row['ps'][key];
            let PS = pk_row['p'].toLocaleUpperCase();

            if (row.blood_hurt != 0) {
                T.PP[PS][row['n']].addChild(Animation.bloodNumAnimation(PS, row.blood_hurt));
            }

            // 是否死亡
            if (row.blood_end <= 0) {
                // 人物死亡
                T.PP[PS][row['n']].setVisible(false);
                // 死亡动画
                T.PP[PS][row['n']].addChild(Animation.dead_all(PS));
                // 显示凉席 || 坟墓
                if (GameScene.gameType == 'NPC' && PS == 'P1') {
                    var dead = Sprite.from('dead_2');
                } else {
                    var dead = Sprite.from('dead_' + (row['n'] == 0 ? '1' : '2'));
                }
                if (PS == 'P1') {
                    dead.position.x = 0 - dead.width / 2;
                    dead.scale.x *= -1;
                }
                dead.x = 24 * (PS == 'P1' ? 1 : -1);
                dead.y = 25;
                dead.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
                T.PP[PS][row['n']].addChild(dead);
            }
        }

    }

    public static shock(tl = gsap.timeline(), t = 0.04) {
        tl.add(gsap.to({}, { duration: t }).eventCallback('onComplete', () => {
            Manager.currentScene.y += 6;
        }));
        tl.add(gsap.to({}, { duration: t }).eventCallback('onComplete', () => {
            Manager.currentScene.y -= 6;
        }));
    }

    public static bgShock(tl = gsap.timeline(), t = 0.06) {
        tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            GameScene.GameBg.display(true, 'bg');
        }));
        tl.add(gsap.to({}, { duration: t }).eventCallback('onComplete', () => {
            GameScene.GameBg.display(false, 'bg');
        }));
    }

    /**
     * 技能移动到敌方镜头速度 
     * undefined,0 瞬间打对面
     * number 时间
     * nnull 不过去
     */
    public static skillSpend: any = {
        6: 0.55, // 雷
        8: 0.4, // 雨
        10: null, // 疗
        11: null, // 疗
        12: null, // 疗
    }

    /**
     * 技能起手速度
     */
    public static sikllWait: any = {
        6: 0.0,
        8: 0.0,
    }

    /**
     * 技能起手动画
     * @param startX 
     * @param item 
     * @returns 
     */
    public static skillStart(startX: number, item: any) {
        let PG = item.pk_g.p.toLocaleUpperCase();
        let n = item.pk_g.n;

        var T = GameScene.T;
        var tl = gsap.timeline();

        tl.add(gsap.to({}, { duration: 0.00001 }).eventCallback('onComplete', () => {
            // 镜头运动
            gsap.to(T, { duration: 0.4, ease: "none", x: startX });
            // 起手动画 [等待时间]
            gsap.to({}, { delay: item.sk in Skill.sikllWait ? 0.3 : 0.4, duration: 0.00001 }).eventCallback('onComplete', () => {
                let anim = Animation.fg();
                anim.y = 18;
                anim.x = PG == 'P1' ? 10 : -10;
                anim.zIndex = 10;
                T.PP[PG][n].addChild(anim);
                // 背景闪动
                Skill.bgShock();
            })
        }));

        // 起手等待时间 [普通技能] +0.4(镜头运动) +  +0.5(技能起手动画) [雷雨] +0.4(镜头运动) +  +0.5(技能起手动画)
        tl.add(gsap.to({}, { duration: item.sk in Skill.sikllWait ? 0.5 : 0.9 }));
        return tl;
    }

    public ptgj() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        let PG = T.PP[row['pk_g']['p'].toLocaleUpperCase()][row['pk_g']['n']];
        let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][row['pk_s']['n']];

        let PGX = PG.x;
        let PGY = PG.y;

        // 攻击前
        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 攻击方人物变化
            PG.struct.foot.texture = Texture.from(PG.data.pe.foot + '_run');
        }));

        // 人物移动
        this.tl.add(gsap.to(PG, { duration: Math.abs(PS.x + 125 - PS.x) / 600, x: PS.x + 125 * -XB, y: PS.y, ease: 'none' },).eventCallback('onComplete', () => {
            // 攻击方人物变化
            PG.struct.body.texture = Texture.from(PG.data.pe.body + '_run');
            // 防守方人物变化
            PS.struct.header.x += 2 * XB;
        }));

        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 血动画
            let animPS = Animation.blood();
            animPS.y = 18;
            animPS.scale.x = XB;
            PS.addChild(animPS);
        }));

        // 攻击后
        this.tl.add(gsap.to({}, { duration: 0.25 }).eventCallback('onComplete', () => {
            // 攻击方人物变化
            PG.struct.body.texture = Texture.from(PG.data.pe.body);
            // 防守方人物复位
            PS.struct.header.x -= 2 * XB;
        }));

        // 人物复位
        this.tl.add(gsap.to(PG, { duration: 0.00001 }).eventCallback('onComplete', () => {
            // 攻击方人物复位
            gsap.to(PG, { duration: 0.25, x: PGX, y: PGY, ease: 'none' });
            // 攻击方人物复位
            gsap.to(PG, { duration: 0.2 }).eventCallback('onComplete', () => {
                PG.struct.foot.texture = Texture.from(PG.data.pe.foot);
            })
        }));
    }

    public wgjd() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        GameScene.GameBg.display(false, 'bg');

        if (parseInt(row.sk) == 7) {
            // 绿~红白绿~
            this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
                Manager.backgroundColor(0x005300); // 绿~
            }));
            this.tl.add(gsap.to({}, { duration: 0.5 }).eventCallback('onComplete', () => {
                Manager.backgroundColor(0xff1700); // 红
            }));
            this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
                Manager.backgroundColor(0xdedcdf); // 白
            }));
        }


        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            if (parseInt(row.sk) == 7) {
                Manager.backgroundColor(0x005300); // 绿~
            }

            // 防守方人物变化
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                PS.struct.header.x += 2 * -XB;
                PS.struct.body.x -= 2 * -XB;
            }
        }));

        // 等待时间
        this.tl.add(gsap.to({}, { duration: 0.5 }).eventCallback('onComplete', () => {
            Manager.backgroundColor(0x000);
        }));

        // 人物复位
        this.tl.add(gsap.to({}, { duration: 0 }).eventCallback('onComplete', () => {
            // 防守方人物复位
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                PS.struct.header.x -= 2 * -XB;
                PS.struct.body.x += 2 * -XB;
            }
        }));
    }

    public hfhy() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        // 背景闪动
        this.tl.add(gsap.to({}, { duration: 0.1 }).eventCallback('onComplete', () => { }));

        this.tl.add(gsap.to({}, { duration: 0 },).eventCallback('onComplete', () => {
            // 雨动画
            let anim = Animation.hfhy();
            anim.x = XB == 1 ? 300 : 380;
            anim.scale.x *= -XB;
            anim.y = 400;
            Manager.currentScene.addChild(anim);
            // 防守方 人物变化
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                PS.struct.header.x += 2 * XB;
            }
        }));

        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 血动画
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                let anim = Animation.blood();
                anim.y = 14;
                anim.x = 20 * -XB;
                anim.scale.x = -XB;
                PS.addChild(anim);
            }
        }));

        // 等待时间
        this.tl.add(gsap.to({}, { duration: 0.68 }));

        // 人物复位
        this.tl.add(gsap.to({}, { duration: 0 }).eventCallback('onComplete', () => {
            // 防守方人物复位
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                PS.struct.header.x -= 2 * XB;
            }
        }));
    }

    public fg2() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 技能动画
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                let anim = Animation.fg_2();
                anim.x = 10 * XB;
                anim.y = 30;
                PS.addChild(anim);
            }
        }));

        // 等待时间
        this.tl.add(gsap.to({}, { duration: 0.5 }));
    }

    public fg3() {
        let T = GameScene.T;

        let row = this.data;

        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 技能动画
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                let anim = Animation.fg_3();
                anim.x = 10;
                anim.y = 30;
                PS.addChild(anim);
            }
        }));

        // 等待时间
        this.tl.add(gsap.to({}, { duration: 0.6 }));

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
            GameScene.GameBg.display(true, 'bg');
        }));

        this.tl.add(gsap.to(line, { alpha: 0.4, duration: 0.05 }).eventCallback('onComplete', () => {
            line.destroy();
        }, [line]));

        this.tl.add(gsap.to({}, { duration: 0.06 }).eventCallback('onComplete', () => {
            GameScene.GameBg.display(false, 'bg');
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
            let animPS = Animation.blood(); // 防守方
            animPS.y = 18;
            animPS.scale.x = XB;
            PS.addChild(animPS);

            let animPG = Animation.blood(); // 进攻方
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
            anim.x = XB == 1 ? 16 : 40;
            anim.y = 25;
            PS.addChild(anim);

            // 攻击人物隐藏
            PG.visible = false;

            // 震动
            Skill.shock(gsap.timeline(), 0.08);

            // 背景闪动
            Skill.bgShock(gsap.timeline())
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
        this.tl.add(gsap.to(PG, { duration: 0.5, x: PS.x - 500 * XB, ease: "none" }));

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

    public psdh() {
        let T = GameScene.T;

        let row = this.data;

        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)

        // 背景闪动
        this.tl.add(gsap.to({}, { duration: 0.1 }).eventCallback('onComplete', () => { }));

        this.tl.add(gsap.to({}, { duration: 0 },).eventCallback('onComplete', () => {
            // 排动画
            let anim = Animation.psdh();
            anim.x = XB == 1 ? 300 : 380;
            anim.scale.x *= -XB;
            anim.y = 500;
            Manager.currentScene.addChild(anim);
            // 防守方 人物变化
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];

                PS.struct.header.x += 2 * XB;
                gsap.to(PS.struct.header, { duration: 0.05, x: PS.struct.header.x - 4 * XB, ease: "none", repeat: 5, yoyo: true }).eventCallback('onComplete', () => {
                    PS.struct.header.x -= 2 * XB;
                });
            }
        }));

        this.tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
            // 血动画
            for (const key in this.data['pk_s']['ps']) {
                var item = this.data['pk_s']['ps'][key];
                let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][item['n']];
                let anim = Animation.blood();
                anim.y = 14;
                anim.x = 20 * -XB;
                anim.scale.x = -XB;
                PS.addChild(anim);
            }
        }));

        // 等待时间
        this.tl.add(gsap.to({}, { duration: 0.68 }));
    }

    public wlhd() {
        let T = GameScene.T;

        let row = this.data;
        let XB = (row['pk_g']['p'].toLocaleUpperCase() == 'P1' ? 1 : -1)
        let PS = T.PP[row['pk_s']['p'].toLocaleUpperCase()][row['pk_s']['n']];

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


}

