import { Manager } from './Manager';
import { LoaderScene } from './scenes/LoaderScene';

// const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
// Manager.initialize(750, height * Manager.ratio, 0x010134);
// Manager.initialize(window.innerWidth, window.innerHeight);
Manager.initialize(750, 1334);

// With getters but not setters, these variables become read-only

// let width = Math.max(document.documentElement.clientwidth, window.innerwidth || 0);
// let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
// Manager.initialize(width, height, 0x6495ed);

// We no longer need to tell the scene the size because we can ask Manager!
const loady: LoaderScene = new LoaderScene();
Manager.changeScene(loady);