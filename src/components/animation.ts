import { AnimatedSprite, Texture, Loader, Container, Sprite, SCALE_MODES } from "pixi.js";
import { gsap } from "gsap"

export class Animation {

    constructor() { }

    public static fg() {
        let data = Loader.shared.resources['fg'].data.animations.fg;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);
        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }
        return anim;
    }

    public static th() {
        let data = Loader.shared.resources['th'].data.animations.th;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);
        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        anim.scale.set(0.8);
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.1;
        anim.loop = true;
        anim.play();

        return anim;
    }

    public static npc_jt() {
        let data = Loader.shared.resources['npc_jt'].data.animations.npc_jt;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);
        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        anim.scale.set(0.8);
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.1;
        anim.loop = true;
        anim.play();

        return anim;
    }

    public static blood() {
        let data = Loader.shared.resources['blood'].data.animations.blood;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);
        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        anim.scale.x = anim.scale.y = 1.3;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.23;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }

        return anim;
    }

    public static bloodNumAnimation(P: string = 'P1', num: number = -1) {
        var nums = num.toString()

        const container = new Container;
        if (num > 0) {
            var PMAX: any = { 'P2': { 'max': -30, 'min': -15 }, 'P1': { 'max': -5, 'min': -4 } };
        } else {
            var PMAX: any = { 'P2': { 'max': -35, 'min': -15 }, 'P1': { 'max': -10, 'min': -4 } };
        }

        container.x = PMAX[P].min + -Math.abs(PMAX[P].max - PMAX[P].min) / 6 * nums.length
        container.y = -6;

        for (let n = 0; n < nums.length; n++) {

            let spine = Sprite.from((num > 0 ? '+' : '-') + nums[n])
            spine.scale.x = spine.scale.y = 0.2;
            spine.x = 7.5 * n;
            spine.y = 0
            let tl = gsap.timeline();
            tl.to(spine, { y: -8, duration: 0.05 * n });
            tl.to(spine, { y: -4, duration: 0.05 * n });
            tl.to({}, { duration: 0.45 }).eventCallback('onComplete', () => {
                container.destroy();
            });
            container.addChild(spine)
        }

        return container;
    }

    public static wlhd() {
        let data = Loader.shared.resources['skill_wlhd'].data.animations.skill_wlhd;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = anim.scale.y = 0.8;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.2;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }

        return anim;
    }

    public static hfhy() {
        let data = Loader.shared.resources['skill_hfhy'].data.animations.skill_hfhy;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = anim.scale.y = 2;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.2;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }

        return anim;
    }

    public static psdh() {
        let data = Loader.shared.resources['skill_psdh'].data.animations.psdh;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);
        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = 3;
        anim.scale.y = 3.5;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }
        return anim;
    }

    public static lphs() {
        let data = Loader.shared.resources['skill_pi'].data.animations.pi;

        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = anim.scale.y = 1;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.2;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }

        return anim;
    }

    public static map_zz() {
        let data = Loader.shared.resources['map_zz'].data.animations.map_zz;
        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }

        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.set(1)

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.2;
        anim.loop = true;
        anim.play();
        anim.x = 26;
        anim.y = 26;

        return anim;
    }

    public static dead(P: string = 'P1') {
        let data = Loader.shared.resources['dead_fl'].data.animations.dead_fl;
        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = anim.scale.y = 1;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.33333;
        anim.loop = false;
        anim.play();
        anim.x = P == 'P1' ? 10 : -10;
        anim.y = 20;
        anim.onComplete = function () {
            anim.destroy();
        }
        return anim;
    }

    public static dead_all(P: string = 'P1') {
        let data = Loader.shared.resources['dead_all'].data.animations.dead_all;
        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = anim.scale.y = 0.85;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.5;
        anim.loop = false;
        anim.play();
        anim.x = P == 'P1' ? 10 : -10;
        anim.y = 20;
        anim.onComplete = function () {
            anim.destroy();
        }
        return anim;
    }

    public static fg_3() {
        let data = Loader.shared.resources['fg_3'].data.animations.fg_3;
        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = anim.scale.y = 1;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }
        return anim;
    }

    public static fg_2() {
        let data = Loader.shared.resources['fg_2'].data.animations.fg_2;
        const frames = [];
        for (let i = 0; i < data.length; i++) {
            frames.push(Texture.from(data[i]));
        }
        const anim = new AnimatedSprite(frames);

        anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        anim.scale.x = anim.scale.y = 1;

        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.play();
        anim.onComplete = function () {
            anim.destroy();
        }
        return anim;
    }

}