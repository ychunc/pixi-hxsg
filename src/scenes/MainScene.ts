import { Container, Sprite, Texture, Text, TextStyle } from "pixi.js";
import gsap from "gsap";

import { Button } from "../components/component";
import { IScene, Manager } from "../Manager";
import { GameScene } from "./GameScene";
import { EquipScene } from "./EquipScene"
import { SortScene } from "./SortScene";
import { AnimationScene } from "../examples/animation";
import { Particles as ParticlesCene } from "../examples/particles";
import { SpineScene } from "../examples/spine";
import { Scroll } from "../examples/scroll";
import { Input } from "../examples/input";
import { LoginScene } from "./LoginScene";

import { SlaveScene } from "./SlaveScene";
import { UserScene } from "./UserScene";
import { Header, StyleText } from "../components/component";
import { ws } from "../components/websocket";
import { Chat } from "../components/chat";

export class MainScene extends Container implements IScene {

    public Time: number = 0;
    public update() {
        var timeNow = (new Date()).getTime();
        var timeDiff = timeNow - this.Time;
        this.Time = timeNow;
        var zhenlv = 1000 / timeDiff;
        Manager.FPS.text = String(Math.round(zhenlv * 100) / 100);
    }

    /**
     * 当前navPage Container
     */
    public navPageContainer: Container = new Container();

    constructor() {
        super();

        this.user();

        this.navigation();

        this.addChild(new Chat());

        this.addChild(new Header());

        this.changeNavPage(Manager.currentNavIndex);

        const skewStyle = new TextStyle({
            fontFamily: '9pxDemo',
            fontSize: 50,
        });
        Manager.FPS = new Text('60.00', skewStyle);
        Manager.FPS.x = Manager.width - Manager.FPS.width;
        this.addChild(Manager.FPS)

        let data = [
            { 'text': '状态', 'scene': UserScene, ease: "expo.out" },
            { 'text': '副将', 'scene': SlaveScene, ease: "expo.out" },
            { 'text': '排行', 'scene': SortScene, ease: "expo.out" },
            { 'text': '匹配', 'scene': GameScene, ease: "expo.out" },
            { 'text': '物品', 'scene': EquipScene, ease: "expo.out" },
            { 'text': 'Spine', 'scene': SpineScene, ease: "expo.out" },
            { 'text': 'Animation', 'scene': AnimationScene, ease: "expo.out" },
            { 'text': '粒子', 'scene': ParticlesCene, ease: "expo.out" },
            { 'text': 'Scroll', 'scene': Scroll, ease: "expo.out" },
            { 'text': 'TextInput', 'scene': Input, ease: "expo.out" },
            { 'text': '退出登录', 'scene': LoginScene, ease: "expo.out" },
        ]
        let obj: Button[] = []
        let x: number = 0;
        let y: number = 500;

        data.forEach((element, index) => {
            obj[index] = new Button(element.text);
            if (x + obj[index].getBounds().width > Manager.width) {
                y += 100;
                x = 0;
            }
            obj[index].x = x;
            obj[index].y = y;
            obj[index].alpha = 0;

            x += obj[index].getBounds().width + 20;

            this.addChild(obj[index])
            obj[index].on("pointertap", () => Manager.changeScene(new element.scene), this);

            gsap.to(obj[index], {
                duration: 0.5,
                y: Manager.height / 3 + y,
                alpha: 1,
            }).delay(index * 0.02);
        });
    }


    /**
     * 中部导航栏
     */
    public navigation() {
        console.log('渲染 中部导航栏');

        let navs: Sprite[] = [];
        for (let index = 0; index <= 3; index++) {
            let is = ''
            if (index == Manager.currentNavIndex) {
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
                Manager.currentNavIndex = index;
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

        this.addChild(this.nav_column(Manager.currentNavIndex));
        this.addChild(new Container, ...navs);
    }

    public header(ISanim: boolean = true) {

        let title = Sprite.from("home_title");
        title.scale.x = 1.2;
        title.scale.y = 1.2;
        this.addChild(title);

        let map = Sprite.from("home_map");
        map.scale.x = 0.8;
        map.scale.y = 0.8;
        map.x = ISanim ? -map.width : 0;
        this.addChild(map);
        gsap.to(map, { duration: 0.5, x: 0 })

        map.interactive = true;
        map.on("pointertap", () => Manager.changeScene(new MainScene), this);
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
            { 'name': '物品', 'calllback': () => { }, },
            { 'name': '副将', 'calllback': () => { ws.send({ route: "slave", uri: "list" }) }, },
            { 'name': '组队', 'calllback': () => { }, },
            { 'name': '排行', 'calllback': () => { ws.send({ route: "user", uri: "sort" }) }, },
            { 'name': '好友', 'calllback': () => { }, },
            { 'name': '邮件', 'calllback': () => { }, },
            { 'name': '任务', 'calllback': () => { }, },
            { 'name': '擂台', 'calllback': () => { }, },
            { 'name': '教派', 'calllback': () => { }, },
            { 'name': '训练', 'calllback': () => { }, },
            { 'name': '宝库', 'calllback': () => { }, },
            { 'name': '公告', 'calllback': () => { }, },
            { 'name': 'VIP', 'calllback': () => { }, },
            { 'name': '登出', 'calllback': () => { Manager.currentNavIndex = 0; Manager.changeScene(new LoginScene) }, },
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
     * nav_人物
     */
    public nav_people() {
        var container = new Container();
        if (!Manager.mapData) return container;

        var data = Manager.mapData;

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
        home_slave.on("pointertap", () =>
            ws.send({ route: "slave", uri: "list" })
        );

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