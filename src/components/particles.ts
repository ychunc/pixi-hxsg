import { Container } from "pixi.js";
import { IScene, Manager } from "../Manager";
import * as particles from '@pixi/particle-emitter'

export class Particles extends Container implements IScene {

    public elapsed: number;
    public emitter: any;

    constructor() {
        super();

        let container = new Container;

        var data = {
            "lifetime": { // 寿命
                "min": 4,
                "max": 10
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
            "frequency": 0.01, // 间隔
            "emitterLifetime": 0,
            "maxParticles": 60, // 粒子数量
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
                                    "value": 1
                                },
                                {
                                    "time": 3,
                                    "value": 0.5
                                },
                                {
                                    "time": 3.05,
                                    "value": 0
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "moveSpeedStatic", // 移动速度
                    "config": {
                        "min": 50,
                        "max": 150
                    }
                },
                {
                    "type": "scale", // 尺寸
                    "config": {
                        "scale": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": 1
                                },
                                {
                                    "time": 3,
                                    "value": 0.3
                                },
                                {
                                    "time": 3.005,
                                    "value": 0.01
                                }
                            ]
                        },
                        "minMult": 1
                    }
                },
                {
                    "type": "rotation", // 角度
                    "config": {
                        "accel": 0,
                        "minSpeed": 0, // 旋转速度
                        "maxSpeed": 100,
                        "minStart": 180,
                        "maxStart": 100,
                    }
                },
                {
                    "type": "textureRandom", // 资源
                    "config": {
                        "textures": [
                            "images/wu.png",
                            "images/hua.png",
                            // "images/pp.png"
                        ]
                    }
                },
                {
                    "type": "spawnShape", // 位置
                    "config": {
                        "type": "rect",
                        "data": {
                            "x": Manager.width / 2,
                            "y": -500,
                            "w": 900,
                            "h": 500
                        }
                    }
                },
                {
                    "type": "color", // 颜色
                    "config": {
                        "color": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": "FFFFFF"
                                },
                                {
                                    "time": 1,
                                    "value": "FFB6C1"
                                }
                            ]
                        }
                    }
                },
            ]
        }

        this.addChild(container)

        this.emitter = new particles.Emitter(
            container,
            data
        );
        console.log(data);

        this.elapsed = Date.now();

        this.emitter.emit = true;
    }

    public update() {
        var now = Date.now();
        this.emitter.update((now - this.elapsed) * 0.001);
        this.elapsed = now;
    }

}