import { Container, Sprite, AnimatedSprite, SCALE_MODES, Texture, Rectangle } from "pixi.js";
import { gsap } from "gsap"
import { IScene, Manager, ManageContainer } from "../Manager";
import { StyleText, Button, Frame, Header, SceneTite } from "../components/component";
import { Animation } from "../components/animation"
import { Skill } from "../components/skill";
import { ws } from "../components/websocket"
import { Team } from "../components/game";
import { MainScene } from "./MainScene";

/**
 * 技能数据
 */
interface ISkill {
    index: number;
    sikll: number;
}

/**
 * 游戏状态
 */
type GameStatus = 'run' | 'end'

/**
 * 游戏模式
 */
type gameType = 'NPC' | 'PVP' | 'PVE'


/**
 * Game
 */
export class GameScene extends ManageContainer implements IScene {
    /**
     * 游戏人物数据
     */
    public team_data: any = {};

    /**
    * 游戏结果
    */
    public static isWin: boolean | number | string;

    /**
     * 游戏状态 run end
     */
    public static GameOver: GameStatus;

    /**
     * 是否游戏播放中
     */
    public static Playing: boolean;

    /**
     * 是否已选择功能 0:功能,1技能
     */
    public static selectedFunctionIndex: number | null = null;

    /**
     * 游戏类型 NPC PVP PVE
     */
    public static gameType: gameType;

    /**
    * 游戏用户
    */
    public static gameUser: any;

    /**
     * 回合数据
     */
    public static round: any = {};

    /**
     * 当前操作的角色
     */
    public current_select_action_index = 0;

    public static T: Team;

    constructor(team_data: any) {
        super();

        // GAME 背景
        this.addChild(this.background());

        // GAME 头部
        this.addChild(this.header());

        // GAME 返回按钮
        this.addChild(this.back());

        // GAME 菜单
        this.addChild(this.menu());

        // 聊天框
        this.addChild(Manager.chat);

        // 目标光标
        GameScene.map_zz = Animation.map_zz();

        // 我方指针
        GameScene.f_jt = Sprite.from('f_jt');
        GameScene.f_jt.position.x = 0 - GameScene.f_jt.width / 2;
        GameScene.f_jt.scale.x *= -0.2;
        GameScene.f_jt.scale.y *= 0.2;
        GameScene.f_jt.y = 10;

        // Team
        this.team_data = team_data;
        console.log('T = ', this.team_data);

        var markTeam: any = { P1: [], P2: [] }


        for (const p in this.team_data) {
            var roles: any = []
            for (let index = 0; index < this.team_data[p].length; index++) {
                var item = this.team_data[p][index]

                if (item.z) item.lv = ''
                roles.push(item.c + item.j + item.sex + item.z + item.lv);
            }
            markTeam[p.toLocaleUpperCase()] = roles;
        }

        console.log('markTeam', markTeam);

        // let T = new Team(this, { 'P1': ['n1', 'n1', 'n1', 'n1'], 'P2': ['r1n', 'n1', 'n1', 'n1'] });
        let T = new Team(this, markTeam);
        GameScene.T = T;

        T.y = 200;
        this.addChild(T);

        // 初始人物选择
        GameScene.T.PP['P2'][this.current_select_action_index].addChild(GameScene.f_jt);

        // 必须让人物入场完成后再
        gsap.to({}, { duration: 0.2 }).eventCallback('onComplete', () => {
            // ws.send({ "route": "npc", "uri": "row", "data": ["0", "0", "0", "0"], "skill": [0, 0, 0, 0] })
            // ws.send({ "route": "npc", "uri": "row", "data": ["0", "0", "0", "0"], "skill": ["9", "8", "2", "2"] })
            // ws.send({ "route": "npc", "uri": "row", "data": ["0", "0", "0", "0"], "skill": ["-1", "-1", "-1", "-1"] })
        })


        // TEST
        let but10 = new Button('test');
        but10.x = 50;
        but10.y = Manager.height * 0.92;
        // this.addChild(but10);
        var run = true;
        but10.on("pointertap", () => {
            var T = GameScene.T
            console.log('p2====', T.PP['P2']);
            for (let index = 0; index < T.PP['P2'].length; index++) {
                var P = T.PP['P2'][index]
                P.struct.foot.texture = Texture.from(P.data.pe.foot + (run ? '_run' : ''));
                P.struct.body.texture = Texture.from(P.data.pe.body + (run ? '_run' : ''));

                P.struct.header.x += 5 * (run ? -1 : 1);
            }
            run = run ? false : true;
        }, this);

        let but9 = new Button('TL');
        but9.x = 280;
        but9.y = Manager.height * 0.92;
        // this.addChild(but9);
        but9.on("pointertap", () => {
            this.playGame();
        }, this);
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

        let leftName = new StyleText(GameScene.gameUser[0].nick, { fontSize: 30 });
        leftName.text.anchor.x = 0.5;
        leftName.x = 90;
        leftName.y = 52;
        container.addChild(leftName);

        let rightName = new StyleText(GameScene.gameUser[1].nick, { fontSize: 30 });
        rightName.text.anchor.x = 0.5;
        rightName.x = Manager.width - 90;
        rightName.y = 52;
        container.addChild(rightName);

        rightName.interactive = true;
        rightName.on("pointertap", () => Manager.changeScene(new MainScene));

        return container;
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
     * 当前选择的人物索引 index
     */
    public current_select_person_index: number = 0;

    /**
     * 当前选择的人物 P
     */
    public current_select_person_p: string = 'P1';

    /**
     * 选择容器
     */
    public selectedPersonContainer: Container = new Container;

    /**
     * 目标指针 [动画]
     */
    public static map_zz: AnimatedSprite;

    /**
     * 待选方指针,我方  
     */
    public static f_jt: Sprite;

    /**
     * 当前选择的技能
     */
    public current_select_skill: { sk?: any, skill_name?: any } = {};

    /**
     * 按技能返回P
     * @param sk sk index
     */
    public getSkillP(sk: number): string {
        var _p = 'P1';
        switch (sk) {
            // 增益技能
            case 10:
            case 11:
            case 12:
            case 13:
                _p = 'P2'; // p2增益
                break;
        }
        return _p;
    }

    /**
     * 选择人物
     */
    public selectPeople() {
        // 技能
        var skill = this.current_select_skill;
        console.log('selected', skill);

        this.skillContainer.visible = false;

        this.selectedPersonContainer.destroy();

        this.selectedPersonContainer = new Container;
        this.selectedPersonContainer.interactive = true;

        // 确认选择技能
        this.selectedPersonContainer.on('pointertap', () => this.ConfirmSelection());

        // 当前选择的技能
        this.current_select_skill_no = skill.sk;

        // 当前选择的人物
        console.log('当前选择的人物 =====', this.team_data, this.current_select_person_p, this.current_select_person_index);

        var d = this.team_data[this.current_select_person_p.toLocaleLowerCase()][this.current_select_person_index].d;

        let bg = Sprite.from('row_skill');
        bg.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        bg.scale.x = bg.scale.y = 1.1;
        this.selectedPersonContainer.addChild(bg);

        // rows
        var text = new StyleText(skill.skill_name, { fontSize: 36, fill: 0xFFFF00 });
        text.x = this.selectedPersonContainer.width / 2 - text.width / 2;
        text.y = 30;
        this.selectedPersonContainer.addChild(text)

        var text = new StyleText('独孤求败', { fontSize: 36, fill: 0xFFFFFF });
        text.x = this.selectedPersonContainer.width / 2 - text.width / 2;
        text.y = 70;
        this.selectedPersonContainer.addChild(text)

        // attrs
        var text = new StyleText('血: ' + d.x, { fontSize: 36, fill: 0xFF0000 });
        text.x = 25;
        text.y = 130 + 46 * 0;
        this.selectedPersonContainer.addChild(text)

        var text = new StyleText('精: ' + d.j, { fontSize: 36, fill: 0x017ebf });
        text.x = 25;
        text.y = 130 + 46 * 1;
        this.selectedPersonContainer.addChild(text)

        var text = new StyleText('速度: ' + d.s, { fontSize: 36, fill: 0x8a2be2 });
        text.x = 25;
        text.y = 130 + 46 * 2;
        this.selectedPersonContainer.addChild(text)

        // 选择的对手图表
        GameScene.map_zz.visible = true;
        GameScene.map_zz.x = (this.current_select_person_p == 'P1' ? 26 : -30);
        GameScene.map_zz.scale.x = (this.current_select_person_p == 'P1' ? 1 : -1);

        GameScene.T.PP[this.current_select_person_p][this.current_select_person_index].addChild(GameScene.map_zz);

        // 显示血条
        this.bloodBarOne(this.current_select_person_p, this.current_select_person_index);

        this.selectedPersonContainer.x = Manager.width / 2 - this.selectedPersonContainer.width / 2;
        this.selectedPersonContainer.y = 270;
        this.addChild(this.selectedPersonContainer);
    }

    /**
     * 已经选择的人物
     * @param item 人物详情
     */
    public onSelected(item: any) {
        // 播放中 [不能操作]
        if (GameScene.Playing == true) return console.log('播放中');
        // 还没选择功能 [不能操作]
        if (GameScene.selectedFunctionIndex == null) return console.log('还没选择功能');

        console.log('确认选择index', item.n, this.current_select_person_index, item);

        // 二次确认选择同一对手
        if (item.n == this.current_select_person_index) {
            // 确认选择
            this.ConfirmSelection();
        } else {
            // 更新对手名称
            this.current_select_person_index = item.n;

            // 选择更新信息
            this.selectPeople();
        }
    }

    /**
     * 获取可攻击的目标 P1/P2
     * @param P 
     * @returns index
     */
    public getAliveIndex(P: string): number {
        // P2默认0
        if (P.toLocaleUpperCase() == 'P2') return 0
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

    /**
     * 确认选择
     */
    public ConfirmSelection() {
        // 保存选择的技能/目标
        this.select_skills.push({
            'index': this.current_select_person_index,
            'sikll': this.current_select_skill_no,
        })

        // 销毁已选择功能
        GameScene.selectedFunctionIndex = null;

        // 隐藏返回按钮
        this.backButton.visible = false;

        // 选择完毕
        if (this.select_skills.length >= this.team_data['p2'].length) {
            // 选择容器隐藏
            this.selectedPersonContainer.visible = false;

            let data = []
            let skill = []
            for (let index = 0; index < this.select_skills.length; index++) {
                let row = this.select_skills[index]
                data.push(row['index'].toString());
                skill.push(row['sikll'].toString());
            }

            ws.send({ route: GameScene.gameType == 'NPC' ? 'npc' : 'game', uri: "row", "data": data, "skill": skill });
            return;
        }

        // 操作下个人物
        this.current_select_action_index++;

        if (this.team_data['p2'][this.current_select_action_index].d.x <= 0) {
            this.ConfirmSelection();
        } else {
            // P2选择图标
            GameScene.T.PP['P2'][this.current_select_action_index].addChild(GameScene.f_jt)

            // 显示全部血条
            this.bloodBarAll(true);

            // 隐藏技能选择
            this.selectedPersonContainer.visible = false;
            this.selectedPersonContainer.destroy();

            // 显示技能菜单
            this.menuContainer.visible = true;

            // 敌方光标隐藏
            GameScene.map_zz.visible = false;
        }
    }

    /**
 * 返回按钮
 */
    public backButton: Sprite = Sprite.from('but');

    /**
     * 返回按钮
     */
    public back() {
        this.backButton.x = 20;
        this.backButton.y = 630;
        this.backButton.scale.set(1.2);
        this.backButton.visible = false;
        let text = new StyleText('返回', { 'fill': [0x000], fontSize: 34 });
        text.x = 10;
        text.y = 8;
        this.backButton.addChild(text);

        this.backButton.interactive = true;
        this.backButton.on('pointertap', () => {
            // P2选择图标
            GameScene.T.PP['P2'][this.current_select_action_index].addChild(GameScene.f_jt)

            // 显示全部血条
            this.bloodBarAll(true);

            // 隐藏技能选择
            this.selectedPersonContainer.visible = false;
            this.selectedPersonContainer.destroy();

            // 显示技能菜单
            this.menuContainer.visible = true;

            // 敌方光标隐藏
            GameScene.map_zz.visible = false;

            // 技能菜单隐藏
            this.skillContainer.visible = false;

            // 返回隐藏
            this.backButton.visible = false;
        });

        return this.backButton;
    }


    /**
     * 技能选择容器
     */
    public skillContainer: Container = new Container;

    /**
     * 选择技能
     */
    public skill() {
        // 功能菜单隐藏
        this.menuContainer.visible = false;
        // 血条隐藏
        this.bloodBarAll(false)

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
            let text_skill = new StyleText(item.skill_name, { fontSize: 42, fill: 0xFFFF00 });
            text_skill.x = skill_bg.width / 2 - text_skill.width / 2;
            text_skill.y = 70 + i * 60;

            text_skill.on("pointertap", () => {
                // 已选择技能
                GameScene.selectedFunctionIndex = 1;
                console.log('select sikll index', i);
                // 开始选择人物
                this.current_select_skill_index = i;
                this.current_select_skill = item;
                // 当前技能选择的 P
                this.current_select_person_p = this.getSkillP(item.sk);
                // 当前技能 P 选择的 index
                this.current_select_person_index = this.getAliveIndex(this.current_select_person_p);
                console.log('当前默认p index', this.current_select_person_index);
                // 人物选择
                this.selectPeople();
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


        var butText = ['攻击', '技能', '招降', '物品', '招将', '逃跑', '防御'];
        for (let index = 0; index < butText.length; index++) {
            let ContainerRow = new Container();
            ContainerRow.interactive = true;

            ContainerRow.x = index % 2 == 0 ? -10 : 78;
            ContainerRow.y = index * 46;

            let but_bg = Sprite.from('home_button');
            but_bg.scale.x = 1.2
            but_bg.scale.y = 1.2
            let text = new StyleText(butText[index], { fontSize: 35 });
            text.x = 10;
            text.y = 24;

            ContainerRow.addChild(but_bg, text);
            ContainerRow.on("pointertap", () => {
                // 选择的功能
                console.log('func index====', index);
                // 显示返回按钮
                this.backButton.visible = true;
                console.log('显示返回按钮');
                // skill index
                switch (index) {
                    case 0: // 普通攻击
                        // 功能菜单隐藏
                        this.menuContainer.visible = false;
                        // 已选择功能
                        GameScene.selectedFunctionIndex = 0;
                        // 当前技能选择的 P
                        this.current_select_person_p = this.getSkillP(-1);
                        // 当前技能 P 选择的 index
                        this.current_select_person_index = this.getAliveIndex(this.current_select_person_p);
                        // 开始选择人物
                        this.current_select_skill = { sk: 0, skill_name: '普通攻击' }
                        this.selectPeople();
                        break;
                    case 1: // 技能
                        this.skill();
                        break;
                    case 6: // 防御
                        this.current_select_skill_no = -1;
                        this.ConfirmSelection();
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
     * 游戏背景容器
     */
    public static GameBg: Sprite;

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
            for (let n = 0; n < GameScene.T.PP[P].length; n++) {
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
     * 显示增益/控制图标, 开始运行隐藏,结束运行显示buff
     * @param show 
     */
    public buff(show: boolean = true) {
        for (const P in this.team_data) {
            for (let n = 0; n < this.team_data[P].length; n++) {
                let PS = this.team_data[P][n];

                // 移除 Buff
                gsap.killTweensOf(GameScene.T.PP[P.toLocaleUpperCase()][n].buff);
                GameScene.T.PP[P.toLocaleUpperCase()][n].buff.destroy();

                // 是否显示
                if (show == false) {
                    continue;
                }

                // 添加 Buff
                GameScene.T.PP[P.toLocaleUpperCase()][n].setBuffContainer();
                for (const index in PS.buff) {
                    let buff = Sprite.from('buff' + Skill.skillBuff(PS.buff[index].sk));
                    if (P == 'p2') {
                        buff.scale.x = -1;
                        buff.x = 5 + 12 * Number(index);
                    } else {
                        buff.scale.x = 1;
                        buff.x = -8 - 12 * Number(index);
                    }

                    GameScene.T.PP[P.toLocaleUpperCase()][n].buff.addChild(buff);
                }
            }
        }
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
        // 开始播放
        GameScene.Playing = true;

        let T = GameScene.T

        var tl = gsap.timeline();
        // 操作菜单
        this.menuContainer.visible = false;
        // 血条隐藏
        this.bloodBarAll(false);

        for (let index = 0; index < GameScene.round.length; index++) {
            // 每回合数据
            let item = GameScene.round[index];

            tl.add(gsap.to({}, { duration: 0.00001 }).eventCallback('onComplete', () => {
                // 背景黑色
                if (item.sk > 0) GameScene.GameBg.visible = false;
            }));

            // 镜头开始X
            this.runData.startX = Skill.getStartX(item);

            // 起手动画
            if (item.sk > 0) tl.add(Skill.skillStart(this.runData.startX, item));

            // 镜头进攻X
            var duration = Skill.skillSpend[item.sk];
            if (duration !== null) {
                tl.add(gsap.to(T, { duration: duration, ease: 'none', x: this.runData.startX * -1 }));
            }

            // 技能播放 [tl 追加skill 的 timeline]
            tl.add(new Skill(item).timeline());

        }

        // 回合战斗播放完
        tl.add(gsap.to({}, { duration: 0.1 }).eventCallback('onComplete', () => {
            // 结束播放
            GameScene.Playing = false;
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

        // 隐藏选择动画
        GameScene.f_jt.visible = false;
        GameScene.map_zz.visible = false;

        // 隐藏buff
        this.buff(false);

        // 清空上次选择数据
        this.select_skills = [];
    }

    /**
     * 下回合准备
     */
    public readyNextRound() {
        console.log('下回合准备');

        // 当前队员指标
        GameScene.f_jt.visible = true;
        GameScene.T.PP['P2'][this.current_select_action_index].addChild(GameScene.f_jt)

        // 显示战斗菜单
        this.menuContainer.visible = true;

        // 显示血量
        this.bloodBarAll(true);

        // 显示控制/增益图标 
        this.buff();

        // 倒计时重置
        // game_timer = 60;
        // 自动战斗
        // _this.autoPk();

        // 游戏结束
        if (GameScene.GameOver == 'end') Manager.changeScene(new GameOver);
    }

}


export class GameOver extends ManageContainer implements IScene {
    constructor() {
        super();

        let header = new Header();
        let frame = new Frame();
        let title = new SceneTite('按任意键返回');
        title.y = Manager.height * 0.70;

        let status = { color: 0x5e5f5e, image: 'game_fail' };
        if (GameScene.isWin > 0) {
            status = { color: 0xdeb973, image: 'game_win' };
        }
        Manager.backgroundColor(status.color);

        let image = Sprite.from(status.image);
        image.anchor.set(0.5);
        image.scale.set(0.3);
        image.alpha = 0.5;
        image.y = 250;
        image.x = Manager.width / 2;
        gsap.to(image, { duration: 0.35, pixi: { scaleX: 0.7, scaleY: 0.7, alpha: 1 }, ease: "back.out(1.7)" })

        console.log(status, GameScene.isWin);
        console.log(GameScene.T);

        let container = new Container();
        let P = GameScene.T.PP['P2']
        for (let index = 0; index < P.length; index++) {
            let rowContainer = new Container();
            rowContainer.y = index * 135;

            let rowBg = Sprite.from('game_row');
            let PN = P[index];
            PN.x = 0;

            // rowBg.addChild(PN);
            rowContainer.addChild(rowBg);
            container.addChild(rowContainer)
        }
        container.y = 420;
        container.x = Manager.width / 2 - container.width / 2;

        this.interactive = true;
        this.hitArea = new Rectangle(0, 0, Manager.width, Manager.height);
        this.on("pointertap", () => Manager.changeScene(new MainScene));

        this.addChild(frame, header, title, image, container);
    }
}