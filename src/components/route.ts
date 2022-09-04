import { ws } from "./websocket";
import { Manager } from "../Manager";
import { MainScene } from "../scenes/MainScene";
import { LoginScene } from "../scenes/LoginScene";
import { SortScene } from "../scenes/SortScene";
import { UserScene, SkillScene as UserSkillScene, AttributeScene as UserAttributeScene } from "../scenes/UserScene";
import { AttributeScene, SkillScene, SlaveDetailScene, SlaveScene } from "../scenes/SlaveScene";
import { SlaveScene as SlaveSlaveScene } from "../scenes/TreasuryScene";
import { PackScene } from "../scenes/PackScene";
import { GameScene } from "../scenes/GameScene";

export class Route {

    constructor(result: any, route: any[]) {
        console.log("Route :", route, result, result.msg);

        switch (route[0]) {
            case 'chat':
                let time = new Date(result.time * 1000 + 8 * 60 * 60 * 1000).toJSON().substr(11, 5).replace('T', ' ');
                Manager.chat.message(time, result.data.msg, result.data.user.nick);
                break;
            case 'login':
                UserScene.data = result.data;
                LoginScene.removeInput();
                Manager.changeScene(new MainScene);
                break;
            case 'map':
                MainScene.mapData = result.data
                Manager.currentScene.changeNavPage(MainScene.currentNavIndex);
                break;
            case 'plot':
                setTimeout(() => {
                    Manager.currentScene.dialogue.data = result.data;
                    Manager.currentScene.dialogue.initText();
                    Manager.currentScene.dialogue.plot = result.data.Plot;
                    Manager.currentScene.dialogue.task = result.data.Task;
                    Manager.currentScene.dialogue.plotText();
                }, 500);
                break;
            case 'user':
                switch (route[1]) {
                    case 'sort':
                        SortScene.data = result.data;
                        Location.to(SortScene);
                        break;
                    case 'user':
                        UserScene.data = result.data;
                        break;
                    case 'attr':
                        UserScene.data = result.data;
                        Manager.changeScene(new UserAttributeScene);
                        break;
                    case 'Upsld':
                    case 'skillStudy':
                        UserScene.data.struct.skill = result.data;
                        Manager.changeScene(new UserSkillScene);
                        break;

                }
                break;
            case 'slave':
                switch (route[1]) {
                    case 'list':
                        SlaveScene.data = result.data;
                        Location.to(SlaveScene);
                        break;
                    case 'del':
                        Location.to(SlaveScene, { route: "slave", uri: "list" });
                        break;
                    case 'slave':
                        SlaveSlaveScene.data = result.data;
                        Location.to(SlaveSlaveScene);
                        break;
                    case 'exp':
                        SlaveDetailScene.data = result.data;
                        SlaveScene.data.list[SlaveDetailScene.selectedIndex] = result.data;
                        Manager.changeScene(new SlaveDetailScene);
                        break;
                    case 'attr':
                        SlaveDetailScene.data = result.data;
                        SlaveScene.data.list[SlaveDetailScene.selectedIndex] = result.data;
                        Manager.changeScene(new AttributeScene);
                        break;
                    case 'Upsld':
                    case 'skillStudy':
                        SlaveScene.data.list[SlaveDetailScene.selectedIndex]['skill'] = result.data;
                        Manager.changeScene(new SkillScene);
                        break;
                    default:
                        break;
                }

                break;
            case 'goods':
                switch (route[1]) {
                    case 'list':
                        PackScene.data = result.data;
                        Location.to(PackScene);
                        break;
                }
                break;
            case 'game':
                switch (route[1]) {
                    case 'start':
                        GameScene.gameUser = result.data.user;
                        GameScene.gameType = result.data.game.type.toLocaleUpperCase();

                        var Game = new GameScene(result.data.team);
                        Manager.changeScene(Game);
                        break;
                    case 'row':
                        var currentGame = Manager.currentScene;
                        // 改变team数据内容,不刷新容器
                        currentGame.team_data = result.data.team;
                        if (UserScene.data.user == result.data.user[0].user) {
                            currentGame.team_data = { 'p1': result.data.team.p2, 'p2': result.data.team.p1 };
                        }
                        // 更新血量百分比
                        GameScene.bloodRate();
                        break;
                    case 'run':
                    case 'end':
                        console.log('game play run or end');
                        // 游戏状态
                        GameScene.GameOver = route[1];

                        // 游戏结果
                        GameScene.isWin = result.msg;

                        // 运行前准备
                        Manager.currentScene.readyRunGame()

                        // 回合运行数据
                        GameScene.round = result.data;

                        // 开始运行
                        Manager.currentScene.playGame();
                        break;
                }
                break;
            default:
                break;
        }

    }

}

export class Location {
    /**
     * 跳转场景 缓存跳转或请求数据跳转
     * @param Scene 场景
     * @param route 请求的路由,只需切换场景时可以不传
     */
    public static to(Scene: any, route?: {}) {
        console.log(route ? '发送请求:' : '开始跳转', new Date().getTime() / 1000);
        if (route) {
            ws.send(route);
        } else {
            Manager.changeScene(new Scene);
        }
    }
}