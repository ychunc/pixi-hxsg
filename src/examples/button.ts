import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class Button extends Container {

    public graphics: Graphics;
    public butColor: number = 0xC600C3;
    public butWidth: number = 110;
    public butHeight: number = 60;
    public butBorder: number = 2.4;
    public action: string = '';
    public text: Text;

    constructor(txt: string = '', style: any = {}) {
        super();

        // 文字
        let Textstyle = new TextStyle({
            fontFamily: '9pxDemo',
            fontSize: 50,
            fill: ['#ffffff'],
            lineJoin: 'round',
        });
        this.text = new Text(txt, Object.assign(Textstyle, style));

        this.butWidth = this.text.width + 26;
        this.butHeight = this.text.height + 6;

        this.text.x = this.butWidth / 2 - this.text.width / 2;
        this.text.y = this.butHeight / 2 - this.text.height / 2;

        // 按钮
        this.graphics = new Graphics();
        // 背景

        this.up();
        this.addChild(this.graphics, this.text);

        // 开启互动
        this.interactive = true;

        this.on("pointerdown", this.down, this);
        this.on("pointerupoutside", this.up, this);
        this.on("pointerup", this.flicker, this);
    }

    public flicker() {
        if (this.action == 'up') {
            return;
        }
        let color = '#A9A9A9'
        let _this = this;
        _this.text.style.fill = color

        // new Tween(this.text.style)
        //     .to({}, 35)
        //     .repeat(Infinity)
        //     .onRepeat(() => {
        //         color = color == '#ffffff' ? '#ae87a0' : '#ffffff'
        //         _this.text.style.fill = color
        //     })
        //     .start()
    }

    // public flicker() {
    //     debugger
    //     console.log('11111');

    // let color = '#A9A9A9'
    // let _this = this;
    // _this.text.style.fill = color

    // console.log('111');


    // gsap.to({}, { duration: 1 }).eventCallback("onComplete", () => {
    //     console.log('11');
    // });
    // new Tween(this.text.style)
    //     .to({}, 35)
    //     .repeat(Infinity)
    //     .onRepeat(() => {
    //         color = color == '#ffffff' ? '#ae87a0' : '#ffffff'
    //         _this.text.style.fill = color
    //     })
    //     .start()
    // }

    public up(): void {
        if (this.action == 'up') {
            return;
        }
        this.action = 'up'

        let width = this.butWidth, height = this.butHeight, border = this.butBorder;
        // 背景色
        this.graphics.beginFill(this.butColor).drawRect(0, 0, width, height);
        // 上边框
        this.graphics.beginFill(0xFFFFFF, 0.5).drawRect(0, 0, width, border);
        // 左边框
        this.graphics.beginFill(0xFFFFFF, 0.5).drawRect(0, border, border, height - border);
        // 右边框
        this.graphics.beginFill(0x000000, 0.5).drawRect(width - border, border, border, height - border - border);
        // 下边框
        this.graphics.beginFill(0x000000, 0.5).drawRect(border, height - border, width - border, border);
    }

    public down(): void {
        if (this.action == 'down') {
            return;
        }
        this.action = 'down'

        let width = this.butWidth, height = this.butHeight, border = this.butBorder;
        // 背景色
        this.graphics.beginFill(0x000000, 0.5).drawRect(0, 0, width, height);
        // 上边框
        this.graphics.beginFill(0x000000, 0.5).drawRect(0, 0, width, border);
        // 左边框
        this.graphics.beginFill(0x000000, 0.5).drawRect(0, border, border, height - border);
        // 右边框
        this.graphics.beginFill(0xffffff, 0.5).drawRect(width - border, border, border, height - border - border);
        // 下边框
        this.graphics.beginFill(0xffffff, 0.5).drawRect(border, height - border, width - border, border);
    }

}