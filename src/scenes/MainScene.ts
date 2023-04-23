import { Container, Sprite, Texture } from "pixi.js";
import * as PIXI from "pixi.js";

import gsap from "gsap";

import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

import { IScene, ManageContainer, Manager } from "../Manager";
import { SortScene } from "./SortScene";
import { LoginScene } from "./LoginScene";

import { MainScene as MainSceneExa } from "../examples/MainScene"

import { SlaveScene } from "./SlaveScene";
import { UserScene } from "./UserScene";
import { Dialogue, Header, Ready, StyleText } from "../components/component";
import { ws } from "../components/websocket";
import { Location } from "../components/route";
import { ArenaScene } from "./ArenaScene";
import { TaskScene } from "./TaskScene";
import { FriendScene } from "./FriendScene";
import { TreasuryScene } from "./TreasuryScene";
import { PackScene } from "./PackScene";
import { Chat } from "../components/chat";
import { Animation } from "../components/animation";

export class MainScene extends ManageContainer implements IScene {
    /**
     * 当前navPage Container
     */
    public navPageContainer: Container = new Container();

    /**
     * current nav index
     */
    public static currentNavIndex: number = 0;

    public static header: any = null;

    constructor() {
        super();

        // 开启层级
        this.sortableChildren = true;

        this.user();

        this.navigation();

        this.changeNavPage(MainScene.currentNavIndex);

        // app bakcgroupd
        Manager.backgroundColor(0x000);

        // 获取最新地图
        ws.send({ "route": ["Map", "map"], "index": 1 });

        this.addChild(Manager.chat = Chat.getInstance());
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
        if (!MainScene.mapData) return;

        switch (index) {
            case 0:
                this.navPageContainer = this.nav_people();
                break;
            case 1:
                this.navPageContainer = new Container();
                break;
            case 2:
                this.navPageContainer = this.nav_map();
                break;
            case 3:
                this.navPageContainer = this.nav_facilities();
                break;
        }

        this.navPageContainer.zIndex = 0;
        this.addChild(MainScene.header = new Header(MainScene.mapData.name));
        this.addChild(this.navPageContainer);
    }

    public nav_map() {
        var container = new Container();
        container.x = 380;
        container.y = 90;
        if (!MainScene.mapData) return container;

        for (const key in MainScene.mapData.nearby) {
            let item = MainScene.mapData.nearby[key]
            let row = new Container();

            let text = new StyleText(item[1]);
            text.x = 160;
            text.y = 16;

            let map = Sprite.from('map_' + item[2]);
            map.x = 80;
            map.scale.set(0.6);

            let fx = Sprite.from('fx_' + key);
            fx.scale.set(0.8);

            row.addChild(fx, map, text);
            row.y = container.children.length * 70;
            container.addChild(row);

            row.interactive = true;
            row.on("pointertap", () => {
                ws.send({ route: ['Map', 'map'], index: item[0], msg: '移动位置' });
            });
        }


        return container;
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
            { 'name': '物品', 'calllback': () => { Location.to(PackScene, { route: ["Goods", "list"], "type": 0 }) }, },
            { 'name': '副将', 'calllback': () => { Location.to(SlaveScene, { route: ["Slave", "list"] }) }, },
            { 'name': '组队', 'calllback': () => { }, },
            { 'name': '排行', 'calllback': () => { Location.to(SortScene, { route: ["User", "sort"] }) }, },
            { 'name': '好友', 'calllback': () => { Manager.changeScene(new FriendScene) }, },
            { 'name': '邮件', 'calllback': () => { }, },
            { 'name': '任务', 'calllback': () => { Manager.changeScene(new TaskScene) }, },
            { 'name': '擂台', 'calllback': () => { Manager.changeScene(new ArenaScene) }, },
            { 'name': '教派', 'calllback': () => { document.getElementById('stats')!.setAttribute('style', 'display:none') }, },
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
     * 对话框对象
     */

    public dialogue: any;

    /**
     * nav_人物
     */
    public nav_people() {
        console.log('人物NPC');

        var container = new Container();
        if (!MainScene.mapData) return container;

        var data = MainScene.mapData;

        for (const key in data.npc) {

            let text = new StyleText(data.npc[key].name, { fontSize: 36 });
            text.x = 380;
            text.y = 100 + Number(key) * 50;
            container.addChild(text);

            let but_bg = Sprite.from('home_button');
            but_bg.interactive = true;
            but_bg.y = 80 + Number(key) * 50;
            but_bg.x = 580 + (Number(key) % 2 ? 70 : 0);

            var tip = Animation.th();
            tip.y = 38;
            if (data.npc[key].tip) but_bg.addChild(tip);
            container.addChild(but_bg);

            let but_text = new StyleText('', { fontSize: 30 });
            but_text.x = 6;
            but_text.y = 16;
            switch (data.npc[key].type) {
                case 'PLOT':
                    but_text.text.text = '对话';
                    but_text.text.style.stroke = '#0000FF'
                    but_text.text.style.strokeThickness = 10
                    break;
                case 'PVP':
                case 'PVE':
                    but_text.text.text = '战斗';
                    but_text.text.style.stroke = '#FF0000'
                    but_text.text.style.strokeThickness = 10
                    break;
            }
            but_bg.addChild(but_text);

            but_bg.on("pointertap", () => {
                var ready = new Ready();
                ready.zIndex = 10;

                var dialogue = this.dialogue = new Dialogue(MainScene.header.height);
                switch (data.npc[key].type) {
                    case 'PLOT':
                        dialogue.submit({ "route": ["Task", "commit"], "data": { taskId: data.npc[key].taskId } });
                        this.addChild(dialogue);
                        break;
                    case 'PVP':
                        this.addChild(ready);
                        setTimeout(() => {
                            ws.send({ "route": ["User", "joinGame"] });
                        }, 500 + Math.random() * 1000);
                        break;
                    case 'PVE':
                        this.addChild(ready);
                        setTimeout(() => {
                            ws.send({ "route": ["Npc", "join"] });
                        }, 500 + Math.random() * 1000);
                        break;
                }
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
        username.text.anchor.x = 0.5;
        username.x = 215
        username.y = 100;
        this.addChild(username);

        let avatar = Sprite.from('q');
        avatar.x = 44;
        avatar.y = 118;
        avatar.scale.x = avatar.scale.y = 2.5;
        this.addChild(avatar);

        gsap.to(avatar, {
            duration: 0.5, repeat: -1, yoyo: true,
            pixi: { tint: 'red' }
        });

        [home_avatar, username, avatar].forEach((object) => {
            object.interactive = true;
            object.on("pointertap", () => {
                Manager.changeScene(new UserScene);
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
        home_slave.on("pointertap", () => {
            Location.to(SlaveScene, { route: ["Slave", "list"] })
        });

        let home_data = Sprite.from('home_data');
        home_data.x = home_bg.width / 2 - home_data.width / 2;
        home_data.y = 290;
        this.addChild(home_data);

        var occ: any = { 1: '武士', 2: '文人', 3: '异人' }
        let texts = [
            { name: '职业: ' + UserScene.data.lv + occ[UserScene.data.j], style: {} },
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