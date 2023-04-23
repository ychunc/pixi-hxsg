import { Container, Graphics, Text, TextStyle, Sprite, ITextStyle, Texture } from "pixi.js";

import gsap from "gsap";

import { Scrollbox as PIXIScrollbox } from "pixi-scrollbox";

import { Manager } from "../Manager";
import { MainScene } from "../scenes/MainScene";
import { Animation } from "./animation";
import { ws } from "./websocket";

type Callback = (...args: any[]) => void | null;

var fontFamily = '9pxDemo'
var fontFamily = 'inherit'

export class Dialogue extends Container {

    private data: any;

    public graphics: Graphics;

    public setData(data: any) {
        this.data = data;
        this.task = data.Task;
    }

    /**
     * 剧情对话
     */
    constructor(edgeY: number = 0) {
        super();

        this.zIndex = 2000;

        this.sortableChildren = true;

        // 上背景
        var container = this.getBackgroup(-1);
        gsap.to(container, { duration: 0.5, y: container.height + edgeY })

        // 下背景
        var container = this.getBackgroup();
        container.y = Manager.height;
        gsap.to(container, { duration: 0.5, y: Manager.height - container.height - 150 })

        // 中间图形
        const graphics = this.graphics = new Graphics();
        // 底层背景
        graphics.beginFill(0x00052e);
        graphics.drawRect(0, 0, Manager.width, 566);
        graphics.endFill();
        // 黑背景
        graphics.lineStyle(4, 0xA0A0A0, 1);
        graphics.beginFill(0x000000);
        graphics.drawRect(Manager.width * 0.03 / 2, 6, Manager.width * 0.97, 550);
        graphics.endFill();

        graphics.pivot.x = graphics.width / 2;
        graphics.pivot.y = graphics.height / 2;
        graphics.x = graphics.width / 2;
        graphics.y = edgeY + graphics.height / 2 + container.height;

        graphics.scale.y = 0;
        gsap.to(graphics.scale, { duration: 0.5, y: 1 }).eventCallback('onComplete', () => {
            graphics.lineStyle(4, 0xA0A0A0, 0.8);
            graphics.beginFill(0x00052e);
            graphics.drawRect(Manager.width * 0.03 / 2, 550 - 100 + 10, Manager.width * 0.97, 100);
            graphics.endFill();

            this.avatar();
        });

        this.interactive = true;
        this.on('pointertap', () => {
            this.textPlot();
        });

        this.addChild(graphics);
    }

    submit(data: any) {
        setTimeout(() => {
            ws.send(data);
        }, 500);
    }

    public avatar() {
        this.addChild(new Avatar({ avatar: 'npc_1', y: 152 }, (_this) => {
            _this.x = -130;
            _this.toX = 50;
        }));

        let npcNick = new StyleText('跑环使者', Object.assign({
            fontSize: 36,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        }));
        npcNick.x = 200;
        npcNick.y = 150;
        this.addChild(npcNick);

        this.addChild(new Avatar({ avatar: '5', y: 152 }, (_this) => {
            _this.toX = Manager.width - 170;
        }));

        let userNick = new StyleText('三国新人', Object.assign({
            fontSize: 36,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        }));
        userNick.x = Manager.width - 340;
        userNick.y = 240;
        this.addChild(userNick);
    }

    /**
     * 任务内容
     */
    public task: any = [];

    /**
     * 对话步骤
     */
    public textPlot() {
        if (this.task.plot.length == 0) {
            // 请求最新位置
            Manager.changeScene(new MainScene);
            // 任务完成
            if (!this.task.next && this.data.Complete) {
                Manager.currentScene.addChild(new confirmBox(`恭喜您完成${this.task.name}`, (_this) => {
                    _this.destroy();
                }))
            }
            return;
        }

        let row = this.task.plot.shift();
        this.updateText(row);
    }

    public content: StyleText | any;

    public updateText(txt: string) {
        this.content.text.text = txt;
    }

    /**
     * 加载对话动画
     */
    public textAction() {
        var text = this.content = new StyleText('', {
            wordWrap: true, wordWrapWidth: Manager.width * 0.96, breakWords: true
        });
        text.x = 16; text.y = 10;

        var back = new StyleText('继续', { fill: '#e8dd13' });
        back.x = Manager.width / 2 - back.width / 2;
        back.y = 550 - 100 / 2 - 10;
        this.graphics.addChild(text, back);

        var npc_jt = Animation.npc_jt();
        npc_jt.x = -26;
        npc_jt.y = 18;
        back.addChild(npc_jt);
    }

    public getBackgroup(up: number = 1) {
        var container = new Container();
        var bgR = Sprite.from('chat_bg');
        bgR.x = Manager.width;
        bgR.scale.x = 0.7 * -1;
        bgR.scale.y = 0.7 * up;

        var bgL = Sprite.from('chat_bg');
        bgL.scale.x = 0.7;
        bgL.scale.y = 0.7 * up;
        container.addChild(bgL, bgR);
        this.addChild(container);

        return container;
    }

}

export class Ready extends Container {

    /**
     * 准备动画
     */
    constructor() {
        super();

        // 透明背景
        let bgAll = new Graphics();
        bgAll.beginFill(0x000, 0.00001).drawRect(0, 0, Manager.width, Manager.height);
        bgAll.endFill();
        bgAll.interactive = true;
        bgAll.zIndex = 1;
        this.addChild(bgAll);

        var container = new Container();
        container.y = 340;
        this.addChild(container);

        // 黑色栏背景
        var alpha = 0.2;
        let graphics = new Graphics();
        graphics.beginFill(0x0b0908, alpha).drawRect(0, 0, Manager.width, 180);
        graphics.beginFill(0xffffff, 0.6).drawRect(0, + 6, Manager.width, 4);
        graphics.beginFill(0xffffff, 0.6).drawRect(0, 180 - 6, Manager.width, 4);
        graphics.endFill();

        let tween = gsap.to({}, { duration: 0.1, repeat: 30000 }).eventCallback('onRepeat', () => {
            if (alpha >= 1) {
                tween.pause();
            }
            graphics.clear();
            graphics.beginFill(0x0b0908, alpha).drawRect(0, 0, Manager.width, 180);
            graphics.beginFill(0xffffff, 0.6).drawRect(0, + 6, Manager.width, 4);
            graphics.beginFill(0xffffff, 0.6).drawRect(0, 180 - 6, Manager.width, 4);
            graphics.endFill();
            alpha += 0.2;
        })
        container.addChild(graphics);

        // 文字
        let text = new StyleText('准备中,请稍后...', {
            fontSize: 32,
            stroke: '#FFF',
            lineJoin: "round",
        })
        text.y = 20;
        text.x = Manager.width / 2 - text.width / 2;
        container.addChild(text);

        // 动画条
        var duration = 0.8;

        var redLine1 = this.getGrd();
        redLine1.y = 100;
        var redLine2 = this.getGrd();
        redLine2.y = 112;

        gsap.to(redLine1, { duration: duration, x: Manager.width - redLine1.width, ease: 'none', repeat: 3000 })
        gsap.to(redLine2, { duration: duration, x: Manager.width - redLine2.width, ease: 'none', repeat: 3000 })

        container.addChild(redLine1, redLine2);

        var redLine3 = this.getGrd();
        redLine3.y = 100;
        redLine3.scale.x = -1
        redLine3.x = Manager.width;
        var redLine4 = this.getGrd();
        redLine4.y = 112;
        redLine4.scale.x = -1
        redLine4.x = Manager.width;

        gsap.to(redLine3, { duration: duration, x: 0 + redLine3.width, ease: 'none', repeat: 3000 })
        gsap.to(redLine4, { duration: duration, x: 0 + redLine4.width, ease: 'none', repeat: 3000 })

        container.addChild(redLine3, redLine4);
    }

    public getGrd(): Sprite {
        var texture = new Sprite();

        const quality = 100;
        const canvas = document.createElement('canvas');
        canvas.width = quality;
        canvas.height = 8;

        var ctx = canvas.getContext('2d');
        if (ctx) {
            const grd = ctx.createLinearGradient(0, 0, quality, 0);
            grd.addColorStop(0, 'rgba(255, 100, 100, 0)');
            grd.addColorStop(0.6, 'rgba(255, 50, 50, 1.0)');
            grd.addColorStop(1, 'rgba(255, 0, 0, 1.0)');

            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, quality, 100);

            var texture = Sprite.from(Texture.from(canvas));
        }
        return texture;
    }

}

// export class ClickEffect {

//     /**
//      * 点击效果
//      * @param event 
//      */
//     constructor(event: InteractionEvent) {
//         let scale = 0.3;

//         var c1 = Sprite.from('c1');
//         var c2 = Sprite.from('c2');
//         var c3 = Sprite.from('c3');
//         Manager.app.stage.addChild(c1, c2, c3);

//         c1.tint = 0xFFFFFF;
//         c2.tint = 0xFF3399;
//         c3.tint = 0xFFFFFF;

//         [c1, c2, c3].forEach((obj) => {
//             obj.zIndex = 500;
//             obj.scale.set(0.1);
//             obj.anchor.set(0.5);
//             obj.x = event.data.global.x;
//             obj.y = event.data.global.y;
//         });

//         gsap.to(c1.scale, { duration: 0.3, x: scale, y: scale });
//         gsap.to(c2.scale, { duration: 0.3, x: scale, y: scale });
//         gsap.to(c3.scale, { delay: 0.1, duration: 0.3, x: scale, y: scale });

//         gsap.to(c1, { delay: 0.2, duration: 0.3, tint: 0xFF3399, alpha: 0 });
//         gsap.to(c2, { delay: 0.1, duration: 0.3, alpha: 0 });
//         gsap.to(c3, { delay: 0.3, duration: 0.3, alpha: 0 });


//         sound.play('sound1');
//         console.log('click');

//     }
// }

export class Scrollbox extends PIXIScrollbox {

    public sprite: Sprite;

    /**
     * 滑动容器
     */
    constructor() {
        super();
        this.boxWidth = Manager.width * 0.85;
        this.boxHeight = Manager.height;

        this.sprite = this.content.addChild(new Sprite(Texture.WHITE))
        this.sprite.width = Manager.width * 0.85;
        this.sprite.height = Manager.height + 1000;
        this.sprite.tint = 0x360033;

        // force an update of the scrollbox's calculations after updating the children
        this.update();
    }

    public setWidth(width: number) {
        this.boxWidth = width;
        this.sprite.width = width;
    }

    public setHeight(hieght: number) {
        this.boxHeight = hieght;
    }

    public setbackgroud(color: number) {
        this.sprite.tint = color;
    }

}

export class Avatar extends Container {

    public avatar: Sprite;
    public toX: number;

    /**
     * 头像
     */
    constructor(item: { avatar: any, y: number }, callback = (_this: Avatar) => { }) {
        super();
        var avatars = Sprite.from('avatar');
        avatars.scale.set(0.57);

        var avatar = this.avatar = Sprite.from(`./avatar/${item.avatar}.png`);

        this.y = item.y;
        this.x = Manager.width;
        this.alpha = 0.5;
        this.toX = 500;

        callback(this);

        this.addChild(avatars, avatar);
        gsap.to(this, { duration: 0.3, alpha: 1, x: this.toX });
    }
}


export class SceneTitle extends Container {

    public text: StyleText;
    /**
     * 标题
     * @param text 
     */
    constructor(text: string, style?: {} | ITextStyle) {
        super();

        let title = new StyleText(text, Object.assign({
            fontSize: 40,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        }, style));

        title.y = 100;
        title.x = Manager.width / 2 - title.width / 2;
        this.text = title;
        this.addChild(title);
    }
}


export class SplitLine extends Graphics {

    /**
     * 分割线
     */
    constructor() {
        super();
        this.beginFill(0xFFFFFF, 0.8).drawRect(0, 0, Manager.width * 0.8, 6);
        this.endFill();
        this.y = 200;
    }
}


export class Header extends Container {

    public text: StyleText;

    /**
     * 左上角小地图
     * @param ISanim 是否动画
     */
    constructor(txt: string = '许昌', ISanim: boolean = true) {
        super();

        this.zIndex = 3000;

        this.sortableChildren = true;

        let title = Sprite.from("home_title");
        title.scale.x = 1.2;
        title.scale.y = 1.2;
        this.addChild(title);

        let text = this.text = new StyleText(txt, { fill: '#FFF', fontSize: 32 });
        text.x = Manager.width / 2 - text.width / 2;
        text.y = title.height / 2 - text.height / 2 - 5;
        this.addChild(text);

        let map = Sprite.from("home_map");
        map.scale.x = 0.8;
        map.scale.y = 0.8;
        map.x = ISanim ? -map.width : 0;
        this.addChild(map);
        gsap.to(map, { duration: 0.5, x: 0 })

        map.interactive = true;
        map.on("pointertap", () => Manager.changeScene(new MainScene), this);
    }
}

export class Frame extends Container {
    public left: Sprite;
    public right: Sprite;

    /**
     * 双边框
     */
    constructor() {
        super();

        this.left = Sprite.from("edge");
        this.left.scale.y = 24;
        this.left.x = -this.left.width;
        this.addChild(this.left);
        gsap.to(this.left, { duration: 0.5, x: 0 });

        this.right = Sprite.from("edge");
        this.right.scale.y = 26;
        this.right.scale.x = -1;
        this.right.x = Manager.width + this.right.width;
        this.addChild(this.right);

        this.zIndex = 900;

        gsap.to(this.right, { duration: 0.5, x: this.right.x - this.right.width });
    }
}

export class StyleText extends Container {

    public text: Text;

    /**
     * 创建文本
     * @param txt 文本
     * @param style 样式
     */
    constructor(txt: string = '', style?: {} | ITextStyle) {
        super();

        style = Object.assign({
            fontFamily: fontFamily,
            fontWeight: 'bold',
            fontSize: 40,
            fill: '#ffffeb',
            lineJoin: "round",
            breakWords: true,
        }, style);
        this.text = new Text(txt, style)

        // 开启互动
        this.interactive = true;

        this.addChild(this.text);
    }
}

export class confirmBox extends Container {

    public text: Text;

    /**
     * 确认弹框
     * @param txt 文本
     * @param style 
     * @param confirmCallback callback
     */
    constructor(txt: string = '', confirmCallback: Callback = () => { }, cancelCallback: Callback = () => { }, style?: {} | ITextStyle) {
        super();

        // 黑色背景
        let graphics = new Graphics();
        graphics.beginFill(0x000, 0.8).drawRect(0, 0, Manager.width, Manager.height);
        graphics.endFill();
        graphics.interactive = true;
        graphics.zIndex = 1;
        graphics.on('pointertap', () => this.destroy());

        // 背景图
        let background = Sprite.from('confirm_box');
        background.y = 500;
        background.zIndex = 2;
        background.x = Manager.width / 2;
        background.interactive = true;

        // 提示文本
        let color = ['d3393c']; color;
        style = Object.assign({
            fontFamily: fontFamily,
            fontWeight: 'bold',
            fontSize: 38,
            fill: '#ffffeb',

        }, style);
        this.text = new Text(txt, style);
        this.text.y = -70;
        this.text.x = -this.text.width / 2;

        // 按钮
        var cancel = new Button('取消', { fontSize: 46 }, 0xdea500);
        cancel.x = -background.width / 2 + cancel.width;
        cancel.y = background.height / 2 - 80;
        cancel.on('pointertap', () => {
            this.destroy();
            cancelCallback(this);
        });

        var confirm = new Button('确定', { fontSize: 46 }, 0xdea500);
        confirm.x = background.width / 2 - confirm.width * 2;
        confirm.y = background.height / 2 - 80;
        confirm.on('pointertap', () => confirmCallback(this));

        // 设置层次
        this.zIndex = 2000;

        this.addChild(graphics, background);

        background.addChild(this.text);
        background.addChild(cancel, confirm);

        background.alpha = 0.5;
        background.anchor.set(0.5);
        background.scale.set(0.8);

        gsap.to(background, { duration: 0.3, alpha: 1, ease: "back.out(2)" });
        gsap.to(background.scale, { duration: 0.3, x: 1, y: 1, ease: "back.out(2)" });
    }
}


/**
 * EventTypes
 * @param pointertap click
 * @param pointerdown mousedown
 * @param pointerup mouseup
 * @param pointermove mousemove
 * @param pointerupoutside 弹起指针在外
 */
type EventTypes = 'pointertap' | 'mousedown' | 'pointerup' | 'pointerdown' | 'pointerupoutside'

export class Button extends Container {
    public graphics: Graphics;
    /**
     * 按钮颜色
     */
    public butColor: number = 0xC600C3;

    /**
     * 按钮宽度
     */
    public butWidth: number = 110;

    /**
     * 按钮高度
     */
    public butHeight: number = 60;

    /**
     * 按钮边框
     */
    public butBorder: number = 4;

    /**
     * 按钮Alpha
     */
    public butAlpha: number = 0.55;
    public action: string = '';
    public text: Text;

    /**
     * 创建按钮
     * @param text 文本 | 对象
     * @param style
     */
    constructor(text: any, style?: {} | ITextStyle, butColor: number = 0xC600C3, callback: Callback = () => { }, flicker: boolean = true) {
        super();

        // 文字
        let Textstyle = new TextStyle({
            fontFamily: fontFamily,
            fontSize: 50,
            fill: ['#ffffff'],
            lineJoin: 'round',
        });

        if (typeof text != 'string') {
            this.text = text
        } else {
            this.text = new Text(text, Object.assign(Textstyle, style));

            this.butWidth = this.text.width + 26;
            this.butHeight = this.text.height + 6;

            this.text.x = this.butWidth / 2 - this.text.width / 2;
            this.text.y = this.butHeight / 2 - this.text.height / 2;
        }

        // but color
        this.butColor = butColor;

        // callback
        callback(this);

        // 按钮
        this.graphics = new Graphics();

        // 背景
        this.up();
        this.addChild(this.graphics, this.text);

        // 开启互动
        this.interactive = true;

        this.on("pointerdown", this.down, this);
        this.on("pointerupoutside", this.up, this);
        this.on("pointerup", flicker ? this.flicker : this.up, this);
    }

    public isFlicker: boolean = false;

    /**
     * 闪动 (需要优化)
     * @returns 
     */
    public flicker() {
        if (this.action == 'up' || this.isFlicker) {
            return;
        }
        this.isFlicker = true;
        gsap.to({}, { duration: 0.035, repeat: 100000 }).eventCallback('onRepeat', () => {
            var color = this.text.style.fill == '#ffffff' ? '#ae87a0' : '#ffffff'
            this.text.style.fill = color;
        })
    }

    public up() {
        if (this.action == 'up') {
            return;
        }
        this.action = 'up'

        let width = this.butWidth,
            height = this.butHeight,
            border = this.butBorder,
            alpha = this.butAlpha;
        // 背景色
        this.graphics.beginFill(this.butColor).drawRect(0, 0, width, height);
        // 上边框
        this.graphics.beginFill(0xFFFFFF, alpha).drawRect(0, 0, width, border);
        // 左边框
        this.graphics.beginFill(0xFFFFFF, alpha).drawRect(0, border, border, height - border);
        // 右边框
        this.graphics.beginFill(0x000000, alpha).drawRect(width - border, border, border, height - border - border);
        // 下边框
        this.graphics.beginFill(0x000000, alpha).drawRect(border, height - border, width - border, border);
    }

    public down() {
        if (this.action == 'down') {
            return;
        }
        this.action = 'down'

        let width = this.butWidth,
            height = this.butHeight,
            border = this.butBorder,
            alpha = this.butAlpha;
        // 背景色
        this.graphics.beginFill(0x000000, alpha).drawRect(0, 0, width, height);
        // 上边框
        this.graphics.beginFill(0x000000, alpha).drawRect(0, 0, width, border);
        // 左边框
        this.graphics.beginFill(0x000000, alpha).drawRect(0, border, border, height - border);
        // 右边框
        this.graphics.beginFill(0xffffff, alpha).drawRect(width - border, border, border, height - border - border);
        // 下边框
        this.graphics.beginFill(0xffffff, alpha).drawRect(border, height - border, width - border, border);
    }


    /**
     * on
     * @param event 
     * Event
     * @text pointertap click(点击)
     * @text pointerdown mousedown(按下)
     * @text pointerup mouseup(弹起)
     * @text pointermove mousemove(弹起在外)
     * @text pointerupoutside(弹起指针在外)
     * @param fn 
     * @param context 
     * @returns 
    */
    public override on(event: EventTypes, fn: Callback, context?: any) {
        super.on(event, fn, context);
        return this;
    }

}