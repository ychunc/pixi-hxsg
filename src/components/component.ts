import { Container, Graphics, Text, TextStyle, Sprite, ITextStyle, Texture } from "pixi.js";
import { Scrollbox as PIXIScrollbox } from "pixi-scrollbox";
import gsap from "gsap";

import { Manager } from "../Manager";
import { MainScene } from "../scenes/MainScene";

type Callback = (...args: any[]) => void | null;

export class Scrollbox extends PIXIScrollbox {

    /**
     * 滑动容器
     */
    constructor() {
        super();
        this.boxWidth = Manager.width * 0.85;
        this.boxHeight = Manager.height;

        const sprite = this.content.addChild(new Sprite(Texture.WHITE))
        sprite.width = Manager.width * 0.85;
        sprite.height = Manager.height + 1000;
        sprite.tint = 0x360033;

        // force an update of the scrollbox's calculations after updating the children
        this.update();
    }

}

export class Avatar extends Container {

    /**
     * 头像
     */
    constructor(item: { avatar: number, y: number }) {
        super();

        this.y = item.y;
        this.x = Manager.width;
        this.alpha = 0.5;

        var avatar = Sprite.from(`./avatar/${item.avatar}.png`);
        var avatars = Sprite.from('avatar');
        avatars.scale.set(0.57);
        this.addChild(avatars, avatar);
        gsap.to(this, { duration: 0.3, alpha: 1, x: 500 });
    }
}


export class SceneTite extends Container {

    /**
     * 标题
     * @param text 
     */
    constructor(text: string) {
        super();

        let title = new StyleText(text, {
            fontSize: 40,
            fill: '#F7EDCA',
            stroke: '#d3393c',
            strokeThickness: 10,
            lineJoin: "round",
        })
        title.y = 100;
        title.x = Manager.width / 2 - title.width / 2;
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

    /**
     * 左上角小地图
     * @param ISanim 是否动画
     */
    constructor(ISanim: boolean = true) {
        super();

        let title = Sprite.from("home_title");
        title.scale.x = 1.2;
        title.scale.y = 1.2;
        this.addChild(title);

        let text = new StyleText('许昌', { fill: '#FFF', fontSize: 32 });
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
            // fontFamily: '9pxDemo',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: 40,
            fill: '#ffffeb',
            lineJoin: "round",
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
            // fontFamily: '9pxDemo',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: 38,
            // fill: '#FFF',
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
            // fontFamily: '9pxDemo',
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

    /**
     * 闪动 (需要优化)
     * @returns 
     */
    public flicker() {
        if (this.action == 'up') {
            return;
        }
        gsap.to({}, { duration: 0.035 }).eventCallback("onComplete", () => {
            var color = this.text.style.fill == '#ffffff' ? '#ae87a0' : '#ffffff'
            this.text.style.fill = color;
            this.flicker();
        });
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
        return this
    }

}