import { Container } from "pixi.js";
import { IScene, Manager, } from "../Manager";
import { Back } from "../components/back";
import { MainScene } from "../scenes/MainScene";
import * as particles from '@pixi/particle-emitter'

export class Particles extends Container implements IScene {

    public elapsed: number;
    public emitter: any;

    constructor() {
        super();

        let container = new Container;

        let data = {
            "lifetime": {
                "min": 4,
                "max": 4
            },
            "ease": [
                {
                    "s": 0,
                    "cp": 0.379,
                    "e": 0.548
                },
                {
                    "s": 0.548,
                    "cp": 0.717,
                    "e": 0.676
                },
                {
                    "s": 0.676,
                    "cp": 0.635,
                    "e": 1
                }
            ],
            "frequency": 0.05, // 间隔
            "emitterLifetime": 0,
            "maxParticles": 100, // 粒子数量
            "addAtBack": false,
            "pos": {
                "x": 0,
                "y": 0
            },
            "behaviors": [
                {
                    "type": "alpha", // 透明度
                    "config": {
                        "alpha": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": 0.73
                                },
                                {
                                    "time": 1,
                                    "value": 0.46
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "moveSpeedStatic", // 移动速度
                    "config": {
                        "min": 50,
                        "max": 200
                    }
                },
                {
                    "type": "scale", // 尺寸
                    "config": {
                        "scale": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": 0.5
                                },
                                {
                                    "time": 1,
                                    "value": 0.2
                                }
                            ]
                        },
                        "minMult": 0.5
                    }
                },
                {
                    "type": "rotation", // 角度
                    "config": {
                        "accel": 0,
                        "minSpeed": 0,
                        "maxSpeed": 1000,
                        "minStart": 180,
                        "maxStart": 100
                    }
                },
                {
                    "type": "textureRandom", // 资源
                    "config": {
                        "textures": [
                            "images/pp.png"
                        ]
                    }
                },
                {
                    "type": "spawnShape", // 位置
                    "config": {
                        "type": "rect",
                        "data": {
                            "x": Manager.width / 2,
                            "y": -200,
                            "w": 900,
                            "h": 500
                        }
                    }
                },
                {
                    "type": "color",
                    "config": {
                        "color": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": "ffffff"
                                },
                                {
                                    "time": 1,
                                    "value": "FF1493"
                                }
                            ]
                        }
                    }
                },
            ]
        }

        // container.addChild(Sprite.from("./animation/huo/0.png"));
        this.addChild(container)


        this.emitter = new particles.Emitter(

            // The PIXI.Container to put the emitter in
            // if using blend modes, it's important to put this
            // on top of a bitmap, and not use the root stage Container
            container,
            // Emitter configuration, edit this to change the look
            // of the emitter
            data
        );


        console.log(data);

        // Calculate the current time
        this.elapsed = Date.now();

        // Update function every frame
        let _this = this
        var update = function () {

            // Update the next frame
            requestAnimationFrame(update);

            var now = Date.now();

            // The emitter requires the elapsed
            // number of seconds since the last update
            _this.emitter.update((now - _this.elapsed) * 0.001);
            _this.elapsed = now;
        };

        // Start emitting
        this.emitter.emit = true;

        // Start the update
        // this.update();

        // requestAnimationFrame(update);
        // console.log(this.emitter);
        // console.log(container.addChild(this.emitter));



        this.addChild(new Back(MainScene));
    }

    public update() {

        // this.anim.rotation += 0.01;

        // Update the next frame

        var now = Date.now();

        // The emitter requires the elapsed
        // number of seconds since the last update
        this.emitter.update((now - this.elapsed) * 0.001);
        this.elapsed = now;
    }

}