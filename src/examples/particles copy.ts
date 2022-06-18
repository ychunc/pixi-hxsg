import { Container, } from "pixi.js";
// import { Texture,  } from "pixi.js";

// Sprite
import { IScene } from "../Manager";
// import { Back } from "../components/back";
// import { MainScene } from "../scenes/MainScene";
import * as particles from '@pixi/particle-emitter'

export class Particles extends Container implements IScene {


    public elapsed: number;
    public emitter: any;

    constructor() {
        super();

        let container = new Container



        let data = {
            "lifetime": {
                "min": 0.5,
                "max": 0.5
            },
            "frequency": 0.008,
            "emitterLifetime": 0.31,
            "maxParticles": 1000,
            "addAtBack": false,
            "pos": {
                "x": 100,
                "y": 100
            },
            "behaviors": [
                {
                    "type": "alpha",
                    "config": {
                        "alpha": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": 0.8
                                },
                                {
                                    "time": 1,
                                    "value": 0.1
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "moveSpeed",
                    "config": {
                        "speed": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": 200
                                },
                                {
                                    "time": 1,
                                    "value": 100
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "scale",
                    "config": {
                        "scale": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": 1
                                },
                                {
                                    "time": 1,
                                    "value": 0.3
                                }
                            ]
                        },
                        "minMult": 1
                    }
                },
                {
                    "type": "color",
                    "config": {
                        "color": {
                            "list": [
                                {
                                    "time": 0,
                                    "value": "fb1010"
                                },
                                {
                                    "time": 1,
                                    "value": "f5b830"
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "rotationStatic",
                    "config": {
                        "min": 0,
                        "max": 360
                    }
                },
                {
                    "type": "textureRandom",
                    "config": {
                        "textures": [
                            "./images/pp.png"
                        ]
                    }
                },
                {
                    "type": "spawnShape",
                    "config": {
                        "type": "torus",
                        "data": {
                            "x": 0,
                            "y": 0,
                            "radius": 10,
                            "innerRadius": 0,
                            "affectRotation": false
                        }
                    }
                }
            ]
        }

        // container.addChild(Sprite.from("./animation/huo/0.png"));
        this.addChild(container)


        this.emitter = new particles.Emitter(

            // The PIXI.Container to put the emitter in
            // if using blend modes, it's important to put this
            // on top of a bitmap, and not use the root stage Container
            // container,
            container
            // Emitter configuration, edit this to change the look
            // of the emitter
            , data
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
        console.log(this.emitter);
        // console.log(container.addChild(this.emitter));



        // this.addChild(new Back(MainScene))
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