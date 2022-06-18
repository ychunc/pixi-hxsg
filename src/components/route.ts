import { Manager } from "../Manager";
import { MainScene } from "../scenes/MainScene";
import { LoginScene } from "../scenes/LoginScene";
import { SlaveScene } from "../scenes/SlaveScene";
import { GameScene } from "../scenes/GameScene";
import { UserScene } from "../scenes/UserScene";
import { SortScene } from "../scenes/SortScene";
import { PackScene } from "../scenes/PackScene";

export class Route {

    constructor(result: any, route: any[]) {
        console.log("Route :", route, result);
        switch (route[0]) {
            case 'login':
                UserScene.data = result.data;

                LoginScene.removeInput();
                Manager.changeScene(new MainScene)
                break;
            case 'map':
                try {
                    Manager.mapData = result.data
                    Manager.currentScene.changeNavPage(0);
                } catch (error) {

                }
                break;
            case 'user':
                switch (route[1]) {
                    case 'sort':
                        SortScene.data = result.data;
                        Manager.changeScene(new SortScene)
                        break;
                }
                break;
            case 'slave':
                SlaveScene.data = result.data;
                Manager.changeScene(new SlaveScene)
                break;
            case 'goods':
                switch (route[1]) {
                    case 'list':
                        PackScene.data = result.data;
                        Manager.changeScene(new PackScene);
                        break;
                }
                break;
            case 'game':

                switch (route[1]) {
                    case 'start':
                        var Game = new GameScene();
                        GameScene.game_type = result.data.game.type;
                        Game.team_data = result.data.team;

                        Manager.changeScene(Game);
                        break;
                    case 'row':
                        console.log('teamdata-', result, UserScene.data);
                        var currentGame = Manager.currentScene;
                        // 改变team数据内容,不刷新容器
                        currentGame.team_data = result.data.team;
                        if (UserScene.data.user == result.data.user[0].user) {
                            currentGame.team_data = { 'p1': result.data.team.p2, 'p2': result.data.team.p1 };
                        }

                        // // 更新血量百分比
                        GameScene.bloodRate();
                        // // 更新buff [更新team,按情况显示]
                        // obj['Game'].buff(obj['Game'].runStatus == 1 ? false : true);
                        // // 获取目标
                        // obj['Game'].select_index_s = obj['Game'].getIndex('p1');

                        break;
                    case 'run':
                    case 'end':
                        console.log('game play run or end');
                        // 游戏状态
                        GameScene.status = route[1]

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