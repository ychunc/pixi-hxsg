import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

import { IScene, Manager } from "../Manager";
import { PackScene } from "./PackScene"
import { SortScene } from "./SortScene";
import { LoginScene } from "./LoginScene";

import { MainScene as MainSceneExa } from "../examples/MainScene"

import { SlaveScene } from "./SlaveScene";
import { UserScene } from "./UserScene";
import { Header, StyleText } from "../components/component";
import { ws } from "../components/websocket";
import { Chat } from "../components/chat";
import { Location } from "../components/route";
import { ArenaScene } from "./ArenaScene";
import { TaskScene } from "./TaskScene";
import { FriendScene } from "./FriendScene";
import { TreasuryScene } from "./TreasuryScene";

export class MainScene extends Container implements IScene {
    public static data: any;

    public update() { }

    /**
     * 当前navPage Container
     */
    public navPageContainer: Container = new Container();

    /**
     * current nav index
     */
    public static currentNavIndex: number = 0;

    constructor() {
        super();

        this.user();

        this.navigation();

        this.changeNavPage(MainScene.currentNavIndex);

        // app bakcgroupd
        Manager.backgroundColor(0x000);

        this.addChild(new Header(), new Chat());
    }

    /**
     * 中部导航栏
     */
    public navigation() {
        console.log('渲染 中部导航栏');

        let navs: Sprite[] = [];
        for (let index = 0; index <= 3; index++) {
            let is = ''
            if (index == MainScene.currentNavIndex) {
                is = '_on'
            }
            let nav = Sprite.from('home_nav' + String(index) + is)

            nav.scale.x = 1.172;
            nav.scale.y = 1.2;
            nav.x = index * 187;
            nav.y = 526;

            navs.push(nav);
            nav.interactive = true;
            nav.on("pointertap", () => {
                // 全局index
                MainScene.currentNavIndex = index;
                // 重置图标
                navs.forEach((element, n) => {
                    element.texture = Texture.from('home_nav' + String(n));
                });
                // 当前选中
                navs[index].texture = Texture.from('home_nav' + String(index) + '_on');
                // nav column 栏&文字
                this.navColumnContainer.destroy();
                this.addChild(this.nav_column(index));
                // 切换navPage
                this.changeNavPage(index);
            });
        }

        this.addChild(this.nav_column(MainScene.currentNavIndex));
        this.addChild(new Container, ...navs);
    }

    /**
     * 切换navPage
     * @param index 当前选择的navPage
     */
    public changeNavPage(index: number = 0) {
        this.navPageContainer.destroy();

        switch (index) {
            case 0:
                this.navPageContainer = this.nav_people();
                break;
            case 3:
                this.navPageContainer = this.nav_facilities();
                break;
            default:
                this.navPageContainer = new Container();
                break;
        }
        this.addChild(this.navPageContainer);
    }

    /**
     * 设施
     */
    public nav_facilities() {
        var container = new Container();
        container.x = 400 - 10;
        container.y = 110 - 10;

        var datas = [
            { 'name': '状态', 'calllback': () => { Manager.changeScene(new UserScene) }, },
            { 'name': '物品', 'calllback': () => { Location.to(PackScene, { route: 'goods', uri: 'list', 'type': 3 }) }, },
            { 'name': '副将', 'calllback': () => { Location.to(SlaveScene, { route: "slave", uri: 'list' }) }, },
            { 'name': '组队', 'calllback': () => { }, },
            { 'name': '排行', 'calllback': () => { Location.to(SortScene, { route: 'user', uri: 'sort' }) }, },
            { 'name': '好友', 'calllback': () => { Manager.changeScene(new FriendScene) }, },
            { 'name': '邮件', 'calllback': () => { }, },
            { 'name': '任务', 'calllback': () => { Manager.changeScene(new TaskScene) }, },
            { 'name': '擂台', 'calllback': () => { Manager.changeScene(new ArenaScene) }, },
            { 'name': '教派', 'calllback': () => { }, },
            { 'name': '训练', 'calllback': () => { }, },
            { 'name': '宝库', 'calllback': () => { Manager.changeScene(new TreasuryScene) }, },
            { 'name': '公告', 'calllback': () => { ws.close(); }, },
            { 'name': 'VIP', 'calllback': () => { Manager.changeScene(new MainSceneExa) }, },
            {
                'name': '登出', 'calllback': () => {
                    MainScene.currentNavIndex = 0;
                    ws.action = 'ACTIVE';
                    Manager.changeScene(new LoginScene);
                },
            },
        ];

        let obj: StyleText[] = []

        datas.forEach((element, index) => {
            obj[index] = new StyleText(datas[index].name, {});
            obj[index].x = index % 3 * 120;
            obj[index].y = Math.floor(index / 3) * 70;

            let bg = Sprite.from('button_yun');
            bg.x = index % 3 * 114 + 10;
            bg.y = Math.floor(index / 3) * 70 - 10;
            bg.scale.set(0.7, 0.7);

            obj[index].on("pointertap", () => element.calllback(), this);

            container.addChild(bg, obj[index]);
        });

        return container;
    }

    /**
     * current map data
     */
    public static mapData: any;

    /**
     * nav_人物
     */
    public nav_people() {
        var container = new Container();
        if (!MainScene.mapData) return container;

        var data = MainScene.mapData;

        for (const key in data.npc) {

            let text = new StyleText(data.npc[key].name, { fontSize: 36 });
            text.x = 380;
            text.y = 100 + Number(key) * 50;
            container.addChild(text);

            let but_bg = Sprite.from('home_button');
            but_bg.x = 600 + (Number(key) % 2 ? 50 : 0);
            but_bg.y = 80 + Number(key) * 50;
            container.addChild(but_bg);

            let but_text = new StyleText('', { fontSize: 30 });
            switch (data.npc[key].type) {
                case 'plot':
                    but_text.text.text = '对话';
                    but_text.text.style.stroke = '#0000FF'
                    but_text.text.style.strokeThickness = 10
                    break;
                case 'game':
                case 'npc':
                    but_text.text.text = '战斗';
                    but_text.text.style.stroke = '#FF0000'
                    but_text.text.style.strokeThickness = 10
                    break;
            }
            but_text.x = 606 + (Number(key) % 2 ? 50 : 0);
            but_text.x = 606 + (Number(key) % 2 ? 50 : 0);
            but_text.y = 96 + Number(key) * 50;
            but_text.y = 96 + Number(key) * 50;
            container.addChild(but_text);

            [but_bg, but_text].forEach((object) => {
                object.interactive = true;
                object.on("pointertap", () => {
                    switch (data.npc[key].type) {
                        case 'plot':
                            console.log('message...');
                            break;
                        case 'game':
                            ws.send({ "route": "game", "uri": "join" })
                            break;
                        case 'npc':
                            ws.send({ "route": "npc", "uri": "join" })
                            break;
                    }
                });
            });
        }
        return container;
    }

    /**
     * 管理选项栏容器
     */
    public navColumnContainer: Container = new Container;

    /**
     * 管理选项栏
     * @param index 当前选择的功能
     * @returns 
     */
    public nav_column(index: number) {
        var container = new Container();
        container.x = 354;
        container.y = 80;

        let column = Sprite.from('home_' + (index == 0 ? 'columns' : 'column'));
        column.scale.x = 1.1;
        column.scale.y = 1.12;
        container.x = 354;
        container.y = 80;

        var nav_text = Sprite.from('home_nav' + index + '_txt');
        nav_text.y = 370;
        gsap.to(nav_text, { duration: 0.3, x: 140 })

        container.addChild(column, nav_text);
        this.navColumnContainer = container;
        return container;
    }

    /**
     * 用户简介
     */
    public user() {
        let home_bg = Sprite.from('home_bg');
        home_bg.x = 0;
        home_bg.y = 80;
        this.addChild(home_bg);

        let home_avatar = Sprite.from('home_avatar');
        home_avatar.x = home_bg.width / 2 - home_avatar.width / 2;
        home_avatar.y = 120;
        this.addChild(home_avatar);

        let username = new StyleText(UserScene.data.nick, { fontSize: 38 });
        username.x = 120;
        username.y = 100;
        this.addChild(username);

        let avatar = Sprite.from('q');
        avatar.x = 44;
        avatar.y = 118;
        avatar.scale.x = avatar.scale.y = 2.5;
        this.addChild(avatar);

        [home_avatar, username, avatar].forEach((object) => {
            object.interactive = true;
            object.on("pointertap", () => {
                Manager.changeScene(new UserScene)
            });
        });

        let home_hp = Sprite.from('home_hp');
        home_hp.x = 118;
        home_hp.y = 144;
        home_hp.scale.x = 1.31;
        home_hp.scale.y = 1;
        this.addChild(home_hp);

        let home_mp = Sprite.from('home_mp');
        home_mp.x = 118;
        home_mp.y = 167;
        home_mp.scale.x = 1.31;
        home_mp.scale.y = 1;
        this.addChild(home_mp);

        let home_slave = Sprite.from('home_slave');
        home_slave.scale.x = 1.1;
        home_slave.scale.y = 1.1;
        home_slave.x = home_bg.width / 2 - home_slave.width / 2;
        home_slave.y = 210;
        home_slave.interactive = true;
        this.addChild(home_slave);
        home_slave.on("pointertap", () => Location.to(SlaveScene, { route: "slave", uri: "list" }));

        let home_data = Sprite.from('home_data');
        home_data.x = home_bg.width / 2 - home_data.width / 2;
        home_data.y = 290;
        this.addChild(home_data);

        let texts = [
            { name: '职业: ' + UserScene.data.lv + '武士', style: {} },
            { name: '金: ' + UserScene.data.gold, style: { fill: '#FFFF00' } },
            { name: '银: ' + UserScene.data.silver, style: {} },
            { name: '升级还需经验: ', style: {} },
            { name: String(UserScene.data.exp), style: {} },
        ];

        for (const key in texts) {

            let style = Object.assign({
                fontSize: 30,
            }, texts[key].style);

            let text = new StyleText(texts[key].name, style);
            text.x = Number(key) == 4 ? 100 : 60;
            text.y = 310 + Number(key) * 36;
            this.addChild(text);
        }
    }

}