import { Application, Container as PIXIContainer, DisplayObject, Text } from 'pixi.js'

import { Particles } from "./components/particles";

export class Manager {
    public static app: Application;
    public static currentScene: IScene;

    /**
     * Width and Height are read-only after creation (for now)
     */
    private static _width: number;
    private static _height: number;

    /**
     * public static rem: number = 1;
     */
    public static FPS: Text;

    /**
     * Particles
     */
    public static particles: Particles;

    /**
     * current map data
     */
    public static mapData: any;

    /**
     * current nav index
     */
    public static currentNavIndex: number = 0;

    /**
     * With getters but not setters, these variables become read-only
     */
    public static get width(): number {
        return Manager._width;
    }
    public static get height(): number {
        return Manager._height;
    }

    public static get ratio(): number {
        let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return width / height > 0.665 ? 1 : 2 || window.devicePixelRatio;
    }

    private constructor() { }

    public static initialize(width: number = 750, height: number = 1334, background: number = 0x000) {
        // store our width and height
        Manager._width = width;
        Manager._height = height;

        // Create our pixi app
        const options: any = {
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            // resolution: window.devicePixelRatio || 1, // [别开了,开了可能会很卡]
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height,
            // antialias: true, // 反锯齿
        }
        Manager.app = new Application(options)

        Manager.app.ticker.add(Manager.update)

        // listen for the browser telling us that the screen size changed
        // window.addEventListener("resize", Manager.resizeFixed);

        // call it manually once so we are sure we are the correct size after starting
        // Manager.resizeFixed();

        Manager.app.stage.sortableChildren = true;

        Manager.resizeFixed();

        // particles
        Manager.particles = new Particles();
        Manager.particles.zIndex = 500;
        Manager.app.stage.addChild(Manager.particles);
    }

    public static backgroundColor(color: number = 0x000) {
        Manager.app.renderer.backgroundColor = color;
    }

    /**
     * This update will be called by a pixi ticker and tell the scene that a tick happened
     * @param framesPassed
     */
    private static update(framesPassed: number): void {
        // Let the current scene know that we updated it...
        // Just for funzies, sanity check that it exists first.
        if (Manager.currentScene) {
            Manager.currentScene.update(framesPassed);
        }

        // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`

        if (Manager.particles) Manager.particles.update();
    }

    /**
     * Call this function when you want to go to a new scene
     * @param newScene 
     */
    public static changeScene(newScene: IScene): void {
        // Remove and destroy old scene... if we had one..
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        // Add the new one
        Manager.currentScene = newScene;
        Manager.currentScene.zIndex = 100;

        Manager.app.stage.addChild(Manager.currentScene);
    }

    public static resizeFixed(): void {
        let stageScale = 0;
        let stageWidth = document.documentElement.clientWidth;
        let stageHeight = document.documentElement.clientHeight;
        if (stageWidth / stageHeight > 0.665) {
            stageScale = stageHeight / (Manager.height / 2);
            Manager.app.view.style.marginLeft = (stageWidth - Manager.width / 2 * stageScale) / 2 + 'px';
        }
        else {
            stageScale = stageWidth / (Manager.width / 2);
            Manager.app.view.style.marginLeft = '0px';
        }
        Manager.app.view.style.width = Manager.width / 2 * stageScale + 'px';
        Manager.app.view.style.height = Manager.height / 2 * stageScale + 'px';
    }

    public static resizeRelative(): void {
        // current screen size
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // uniform scale for our game
        const scale = Math.min(screenWidth / Manager.width, screenHeight / Manager.height);

        // the "uniformly englarged" size for our game
        const enlargedWidth = Math.floor(scale * Manager.width);
        const enlargedHeight = Math.floor(scale * Manager.height);

        // margins for centering our game
        const horizontalMargin = (screenWidth - enlargedWidth) / 2;
        const verticalMargin = (screenHeight - enlargedHeight) / 2;

        // now we use css trickery to set the sizes and margins
        Manager.app.view.style.width = `${enlargedWidth}px`;
        Manager.app.view.style.height = `${enlargedHeight}px`;
        Manager.app.view.style.marginLeft = Manager.app.view.style.marginRight = `${horizontalMargin}px`;
        Manager.app.view.style.marginTop = Manager.app.view.style.marginBottom = `${verticalMargin}px`;
    }

}

export interface IScene extends DisplayObject {
    [x: string]: any;
    update(framesPassed: number): void;
}

export class Container extends PIXIContainer implements IScene {
    public static data: any;

    public update(): void {
        // To be a scene we must have the update method even if we don't use it.
    }
}