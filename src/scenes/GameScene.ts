import { Container, Sprite, AnimatedSprite, SCALE_MODES } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Back } from "../components/back";
import { LoginScene as BackScene } from "./LoginScene";

import { Animation } from "../components/animation"
import { Skill } from "../components/skill";

import { gsap } from "gsap"
import { StyleText, Button } from "../components/component";

import { ws } from "../components/websocket"
import { MainScene } from "./MainScene";
import { Team } from "../components/game";
import { Chat } from "../components/chat";
// import { Particles } from "../examples/particles";

interface ISkill {
    index: number;
    sikll: number;
}

/**
 * Game
 */
export class GameScene extends Container implements IScene {
    public team_data: any = {};

    public Time: number = 0;

    /**
     * 游戏状态 run / end
     */
    public static status: string;

    /**
     * 操作步骤 0: 选择功能 1: 选择技能 3: 选择对手
     */
    public actionStep: number = 0;

    /**
     * 游戏类型 NPC PVP PVE
     */
    public static game_type: string = '';

    /**
     * 回合数据
     */
    public static round: any = {};

    public update(): void {
        // To be a scene we must have the update method even if we don't use it.
    }
    // public update() {
    //     var timeNow = (new Date()).getTime();
    //     var timeDiff = timeNow - this.Time;
    //     this.Time = timeNow;
    //     var zhenlv = 1000 / timeDiff;
    //     // Manager.FPS.text = String(Math.round(zhenlv * 100) / 100);
    //     this.but5.text.text = String(parseInt((zhenlv).toString()));
    // }

    public but5: any;

    /**
     * 当前操作的角色
     */
    public current_select_action_index = 0;

    public static T: Team;

    constructor() {
        super();

        // GAME 背景
        this.addChild(this.background());

        // GAME 头部
        this.addChild(this.header());

        // GAME 菜单
        this.addChild(this.menu());

        // 聊天框
        this.addChild(new Chat());

        // 返回
        this.addChild(new Back(BackScene));

        // 粒子
        // this.addChild(new Particles());

        // 敌方光标
        GameScene.map_zz = Animation.map_zz();
        GameScene.map_zz.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        console.log(GameScene.map_zz);

        let T = new Team(this, { 'P1': ['r1n', 'n1', 'n1', 'n2'], 'P2': ['r1n', 'n1', 'n1', 'n2'] });
        GameScene.T = T;

        // 必须让人物入场完成后再
        gsap.to({}, { duration: 0.2 }).eventCallback('onComplete', () => {
            // ws.send({ "route": "npc", "uri": "row", "data": ["0", "0", "0", "0"], "skill": [0, 0, 0, 0] })
            // ws.send({ "route": "npc", "uri": "row", "data": ["0", "0", "0", "0"], "skill": ["9", "8", "2", "2"] })
            // ws.send({ "route": "npc", "uri": "row", "data": ["0", "0", "0", "0"], "skill": ["-1", "-1", "-1", "-1"] })
        })


        T.y = 200;
        this.addChild(T);

        // 我方指针
        GameScene.f_jt = Sprite.from('f_jt');
        GameScene.f_jt.position.x = 0 - GameScene.f_jt.width / 2;
        GameScene.f_jt.scale.x *= -0.2;
        GameScene.f_jt.scale.y *= 0.2;
        GameScene.f_jt.y = 10;

        // 初始人物选择
        GameScene.T.PP['P2'][this.current_select_action_index].addChild(GameScene.f_jt)

        let c, n, y;

        // P2 移动到 P1[n]
        c = 1;
        n = 1;
        y = 90;

        console.log(T.PP['P2'][c]);
        console.log(c, n, y);

        // P1 移动到 P2[n]
        c = 0;
        n = 2;
        y = 90;

        console.log(c, n, y);

        let buP2 = new Button('血条更新');
        buP2.x = 50;
        buP2.y = Manager.height * 0.7;
        this.addChild(buP2);
        buP2.on("pointertap", () => {
        }, this);

        let but3 = new Button('血条');
        but3.x = 300;
        but3.y = Manager.height * 0.7;
        this.addChild(but3);
        but3.on("pointertap", () => {
            this.bloodBarAll(false)
        }, this);

        let but10 = new Button('test');
        but10.x = 50;
        but10.y = Manager.height * 0.85;
        this.addChild(but10);
        but10.on("pointertap", () => {

            GameScene.T.PP['P1'][0].setHPMask(0.2);

        }, this);

        let but11 = new Button('震');
        but11.x = 200;
        but11.y = Manager.height * 0.85;
        this.addChild(but11);
        but11.on("pointertap", () => {
            Skill.shock();
        }, this);

        let but7 = new Button('skill');
        but7.x = 350;
        but7.y = Manager.height * 0.78;
        this.addChild(but7);
        but7.on("pointertap", () => {
            let T = GameScene.T;
            T.x = 0;
            console.log(T);
            var anim = Animation.dead();

            anim.scale.x = 2
            anim.scale.y = 2
            but7.addChild(anim)
        }, this);

        let but9 = new Button('TL');
        but9.x = 500;
        but9.y = Manager.height * 0.78;
        this.addChild(but9);
        but9.on("pointertap", () => {
            this.playGame();
        }, this);

        let but12 = new Button('血动画');
        but12.x = 50;
        but12.y = Manager.height * 0.92;
        this.addChild(but12);
        but12.on("pointertap", () => {
            for (let index = 0; index < 4; index++) {
                T.PP['P2'][index].addChild(Animation.bloodNumAnimation('P2', -1234567890 * (index + 1)));
                T.PP['P1'][index].addChild(Animation.bloodNumAnimation('P1', -1234567890 * (index + 1)));
            }
        }, this);


        this.but5 = new Button('00', { fontFamily: 'auto' });
        this.but5.x = 50;
        this.but5.y = Manager.height * 0.78;
        this.addChild(this.but5);
    }

    /**
     * 当前选择的技能索引
     */
    public current_select_skill_index: number = 0;

    /**
     * 当前选择的技能序号
     */
    public current_select_skill_no: number = 0;

    /**
     * 当前选择的敌方索引
     */
    public current_select_enemy_index: number = 0;

    public selectedContainer: Container = new Container;

    /**
     * 目标指针 [动画]
     */
    public static map_zz: AnimatedSprite;

    /**
     * 待选方指针,我方  
     */
    public static f_jt: Sprite;

    /**
     * 选择技能后
     * @param skill 技能详情
     */
    public selected(skill: any): any {
        console.log('selected', skill);

        this.skillContainer.visible = false;

        this.selectedContainer.visible = false;

        this.selectedContainer = new Container;

        // 当前选择的技能
        this.current_select_skill_no = skill.sk;

        // 按技能选择p
        var _p = 'P1';
        switch (parseInt(skill.sk)) {
            // 增益技能
            case 10:
            case 11:
            case 12:
            case 13:
                _p = 'P2'; // p2增益
                this.current_select_enemy_index = 0; // 选择P2主角
                break;
        }

        // 当前选择的敌人
        var d = this.team_data[_p.toLocaleLowerCase()][this.current_select_enemy_index].d;

        let bg = Sprite.from('row_skill');
        bg.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        bg.scale.x = bg.scale.y = 1.1;
        this.selectedContainer.addChild(bg);

        // rows
        var text = new StyleText(skill.skill_name, { fontSize: 32, fill: 0xFFFF00 });
        text.x = this.selectedContainer.width / 2 - text.width / 2;
        text.y = 30;
        this.selectedContainer.addChild(text)

        var text = new StyleText('独孤求败', { fontSize: 32, fill: 0xFFFFFF });
        text.x = this.selectedContainer.width / 2 - text.width / 2;
        text.y = 70;
        this.selectedContainer.addChild(text)

        // attrs
        var text = new StyleText('血: ' + d.x, { fontSize: 32, fill: 0xFF0000 });
        text.x = 25;
        text.y = 130 + 46 * 0;
        this.selectedContainer.addChild(text)

        var text = new StyleText('精: ' + d.j, { fontSize: 32, fill: 0x017ebf });
        text.x = 25;
        text.y = 130 + 46 * 1;
        this.selectedContainer.addChild(text)

        var text = new StyleText('速度: ' + d.s, { fontSize: 32, fill: 0x8a2be2 });
        text.x = 25;
        text.y = 130 + 46 * 2;
        this.selectedContainer.addChild(text)

        // 选择的对手图表
        GameScene.map_zz.visible = true;
        GameScene.T.PP[_p][this.current_select_enemy_index].addChild(GameScene.map_zz);

        // 显示血条
        this.bloodBarOne(_p, this.current_select_enemy_index);

        this.selectedContainer.x = Manager.width / 2 - this.selectedContainer.width / 2;
        this.selectedContainer.y = 270;
        this.addChild(this.selectedContainer);

        this.selectedContainer.interactive = true;
        this.selectedContainer.on('pointertap', () => this.ConfirmSelection())
    }

    /**
     * 已经选择的人物
     * @param item 人物详情
     */
    public onSelected(item: any) {
        // 二次确认选择同一对手
        if (item.n == this.current_select_enemy_index) {

            // 确认选择
            this.ConfirmSelection();

            // 为下个角色获取第一个活的敌人,默认是0
            this.current_select_enemy_index = this.getAliveIndex('P1');

        } else {
            // 更新对手名称
            this.current_select_enemy_index = item.n
            console.log('选择的对手index', item);

            // 当前操作的只有p2
            let skill = this.team_data['p2'][this.current_select_action_index]['skill'][this.current_select_skill_index];

            // 选择更新信息
            this.selected(skill);
        }
    }

    /**
     * 获取可攻击的目标
     * @param P 
     */
    public getAliveIndex(P: string): number {
        // P2默认0
        if (P == 'P2') return 0
        // P1 选择活的目标
        for (var n in this.team_data['p1']) {
            if (this.team_data['p1'][n].d.x > 0) {
                return Number(n);
            }
        }
        return 0; // 默认值
    }

    /**
     * 已选择的技能
     * @type Array
     */
    public select_skills: Array<ISkill> = [];

    // 确认选择
    public ConfirmSelection() {
        // 显示全部血条
        this.bloodBarAll(true);

        // 保存选择的技能/目标
        this.select_skills.push({
            'index': this.current_select_enemy_index,
            'sikll': this.current_select_skill_no,
        })

        console.log('skill alls', this.select_skills, this.select_skills.length);

        if (this.select_skills.length >= this.team_data['p2'].length) {

            this.selectedContainer.visible = false;

            let data = []
            let skill = []
            for (let index = 0; index < this.select_skills.length; index++) {
                let row = this.select_skills[index]
                data.push(row['index'].toString());
                skill.push(row['sikll'].toString());
            }

            ws.send({ "route": "npc", "uri": "row", "data": data, "skill": skill })
            return;
        }

        // 操作下个人物
        this.current_select_action_index++;

        if (this.team_data['p2'][this.current_select_action_index].d.x <= 0) {
            this.ConfirmSelection();
        } else {
            GameScene.T.PP['P2'][this.current_select_action_index].addChild(GameScene.f_jt)

            // 隐藏技能选择
            this.selectedContainer.visible = false;
            this.selectedContainer.destroy();

            // 显示技能菜单
            this.menuContainer.visible = true;

            // 敌方光标隐藏
            console.log(GameScene.map_zz);

            GameScene.map_zz.visible = false;
        }
    }

    /**
     * 技能选择容器
     */
    public skillContainer: Container = new Container;
    /**
     * 技能选择
     */
    public skill() {
        this.menuContainer.visible = false;
        this.bloodBarAll(false)

        // 重置选择敌人index
        this.current_select_enemy_index = this.getAliveIndex('P1');

        this.skillContainer = new Container;

        let skill_bg = Sprite.from('select_skill');
        skill_bg.scale.x = 1.7;
        skill_bg.scale.y = 2.2;
        skill_bg.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        this.skillContainer.addChild(skill_bg);

        var team_data = this.team_data
        console.log('team_data:', this.team_data);

        let title = new StyleText('选择技能', { fontSize: 32, fill: 0xFF9933 });
        title.x = skill_bg.width / 2 - title.width / 2;
        title.y = 24;

        // 可选技能列表
        var skills = []
        for (let i = 0; i < team_data['p2'][this.current_select_action_index]['skill'].length; i++) {
            let item = team_data['p2'][this.current_select_action_index]['skill'][i];
            // 可选技能
            let text_skill = new StyleText(item.skill_name, { fontSize: 36, fill: 0xFFFF00 });
            text_skill.x = skill_bg.width / 2 - text_skill.width / 2;
            text_skill.y = 70 + i * 60;

            text_skill.on("pointertap", () => {
                console.log('select sikll index', i);
                this.current_select_skill_index = i;
                this.selected(item);
            });
            skills.push(text_skill)
        }
        this.skillContainer.addChild(title, ...skills);

        this.skillContainer.x = Manager.width / 2 - this.skillContainer.width / 2 - 10;
        this.skillContainer.y = 240;
        this.addChild(this.skillContainer);
    }


    /**
     * 功能菜单容器
     */
    public menuContainer: Container = new Container;

    /**
     * 功能菜单
     */
    public menu() {

        this.actionStep = 0;

        var butText = ['攻击', '技能', '招降', '物品', '招将', '逃跑', '防御'];
        for (let index = 0; index < butText.length; index++) {
            let ContainerRow = new Container();
            ContainerRow.interactive = true;

            ContainerRow.x = index % 2 == 0 ? -10 : 78;
            ContainerRow.y = index * 46;

            let but_bg = Sprite.from('home_button');
            but_bg.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
            but_bg.scale.x = 1.2
            but_bg.scale.y = 1.2
            let text = new StyleText(butText[index], { fontSize: 35 });
            text.x = 10;
            text.y = 24;

            ContainerRow.addChild(but_bg, text);
            ContainerRow.on("pointertap", () => {
                console.log('click skill', index);
                switch (index) {
                    case 0:
                        break;
                    case 1:
                        this.skill();
                        break;
                    default:
                        break;
                }
            });

            this.menuContainer.addChild(ContainerRow);
        }

        this.menuContainer.x = 300;
        this.menuContainer.y = 230;
        return this.menuContainer;
    }

    /**
     * 头部
     */
    public header() {
        let container = new Container();

        let game_title = Sprite.from('game_title');
        game_title.scale.x = 1.18;
        game_title.scale.y = 1.18;
        container.addChild(game_title);

        let addressName = new StyleText('许昌', { fontSize: 30 });
        addressName.x = Manager.width / 2 - addressName.width / 2;
        addressName.y = 8;
        container.addChild(addressName);

        let titleNameBg = Sprite.from('title_name');
        titleNameBg.scale.y = 1.6;
        titleNameBg.x = Manager.width / 2 - titleNameBg.width / 2;
        titleNameBg.y = 45;
        container.addChild(titleNameBg);

        let TitleName = new StyleText('东方不败-出招(60)', { fontSize: 28 });
        TitleName.x = Manager.width / 2 - TitleName.width / 2;
        TitleName.y = 48;
        container.addChild(TitleName);

        let leftName = new StyleText('士兵群', { fontSize: 30 });
        leftName.x = 20;
        leftName.y = 50;
        container.addChild(leftName);

        let rightName = new StyleText('三国新人', { fontSize: 30 });
        rightName.x = Manager.width - 170;
        rightName.y = 50;
        container.addChild(rightName);
        return container;
    }

    /**
     * 游戏背景容器
     */
    public static GameBg: Sprite = new Sprite;

    /**
     * 显示游戏背景
     * @returns any
     */
    public background() {
        var bg = Sprite.from('bg10');
        bg.y = 92;
        bg.scale.x = 3.2;
        bg.scale.y = 2.94;
        bg.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST
        GameScene.GameBg = bg;
        return bg;
    }

    /**
     * 控制血条百分比
     */
    public static bloodRate() {
        let team_data = Manager.currentScene.team_data;
        for (const P in team_data) {
            for (var n = 0; n < team_data[P].length; n++) {
                let ps = team_data[P][n];
                // 更新血蓝条

                console.log(GameScene.T.PP, P, n);

                GameScene.T.PP[P.toLocaleUpperCase()][n].setHPMask(ps.d.x / ps.d.x_)
            }
        }
    }

    /**
     * 控制全部血条显示
     * @param visible 
     */
    public bloodBarAll(visible: boolean = false) {
        for (const P in GameScene.T.PP) {
            for (let n = 0; n < GameScene.T.PP.P1.length; n++) {
                GameScene.T.PP[P][n].blood.visible = visible;
            }
        }
    }

    /**
     * 显示指定P,N 血条
     */
    public bloodBarOne(P: string, n: number = 0, visible: boolean = true) {
        this.bloodBarAll();
        GameScene.T.PP[P][n].blood.visible = visible;
    }

    /**
     * 运行数据
     * @param startX 开始x
     * @param startDuration 开始持续时间
     */
    public runData = {
        'startX': 0,
        'startDuration': 0,
    }

    /**
     * 运行战斗
     */
    public playGame() {
        let T = GameScene.T

        var tl = gsap.timeline();
        // 操作菜单
        this.menuContainer.visible = false;
        // 血条隐藏
        this.bloodBarAll(false);

        for (let index = 0; index < GameScene.round.length; index++) {
            let item = GameScene.round[index]
            let PG = item.pk_g.p.toLocaleUpperCase();

            tl.add(gsap.to({}, { duration: 0.00001 }).eventCallback('onComplete', () => {
                // 背景黑色
                GameScene.GameBg.visible = false;
                // 血条隐藏
                this.bloodBarAll(false);
            }));

            // 镜头X
            this.runData.startX = (Manager.width / 2 - 100) * (PG == 'P1' ? 1 : -1)

            // 起手方
            tl.add(gsap.to(T, { duration: 0.45, ease: "none", x: this.runData.startX }).eventCallback('onComplete', () => {
                let anim = Animation.fg();
                anim.y = 18;
                anim.x = PG == 'P1' ? 10 : -10;
                T.PP[PG][item.pk_g.n].addChild(anim)

                // 背景闪动
                var tl = gsap.timeline();
                tl.add(gsap.to({}, { duration: 0.02 }).eventCallback('onComplete', () => {
                    GameScene.GameBg.visible = true;
                }));
                tl.add(gsap.to({}, { duration: 0.06 }).eventCallback('onComplete', () => {
                    GameScene.GameBg.visible = false;
                }));
            }));

            // 等待时间
            tl.add(gsap.to({}, { duration: 0.45 }));

            // item.sk = 6
            // 开始攻击 技能到敌方速度
            var duration = Skill.skillSpend[item.sk];

            tl.add(gsap.to(T, { duration: duration, ease: 'none', x: this.runData.startX * -1 }));

            // 技能播放 [tl 追加skill 的 timeline]
            tl.add(new Skill(item).timeline())

        }

        tl.add(gsap.to({}, { duration: 0.0001 }).eventCallback('onComplete', () => {
            // 下回合准备
            this.readyNextRound();
        }));

    }

    /**
     * 运行前准备
     */
    public readyRunGame() {
        // 清空当前队员指针
        this.current_select_action_index = 0;
        GameScene.f_jt.visible = false;

        GameScene.map_zz.visible = false;

        // 清空上次选择数据
        this.select_skills = [];
    }

    /**
     * 下回合准备
     */
    public readyNextRound() {
        console.log('下回合准备...', Date.now().toString());

        // 退出游戏
        if (GameScene.status == 'end') {
            Manager.changeScene(new MainScene);
        }

        // 当前队员指标
        GameScene.f_jt.visible = true;
        GameScene.T.PP['P2'][this.current_select_action_index].addChild(GameScene.f_jt)

        // 显示战斗菜单
        this.menuContainer.visible = true;

        // 显示血量
        this.bloodBarAll(true);

        // // 显示战斗菜单
        // _this.menu();
        // // 显示全部血条
        // _this.bloodBarAll_hide_all(true);
        // // 显示控制/增益图标 [准备前显示]
        // _this.buff();
        // // 倒计时重置
        // game_timer = 60;
        // // 自动战斗
        // _this.autoPk();
    }

}
