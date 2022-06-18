import { Manager } from "../Manager";
import { MainScene } from "../scenes/MainScene";
import { LoginScene } from "../scenes/LoginScene";
import { SlaveScene } from "../scenes/SlaveScene";
import { GameScene } from "../scenes/GameScene";
import { UserScene } from "../scenes/UserScene";
import { SortScene } from "../scenes/SortScene";

export class Route {

    constructor(data: any, route: any[]) {
        data = data;
        console.log("Route :", route, data);
        switch (route[0]) {
            case 'login':
                UserScene.data = data.data;

                LoginScene.removeInput();
                Manager.changeScene(new MainScene)
                break;
            case 'map':
                try {
                    Manager.mapData = data.data
                    Manager.currentScene.changeNavPage(0);
                } catch (error) {

                }
                break;
            case 'user':
                switch (route[1]) {
                    case 'sort':
                        Manager.changeScene(new SortScene)
                        break;
                }
                break;
            case 'slave':
                Manager.changeScene(new SlaveScene)
                break;
            case 'game':

                switch (route[1]) {
                    case 'start':
                        var Game = new GameScene();
                        GameScene.game_type = data.data.game.type;
                        Game.team_data = data.data.team;

                        Manager.changeScene(Game);
                        break;
                    case 'row':
                        console.log('teamdata---------', data, UserScene.data);
                        var currentGame = Manager.currentScene;
                        // 改变team数据内容,不刷新容器
                        currentGame.team_data = data.data.team;
                        if (UserScene.data.user == data.data.user[0].user) {
                            currentGame.team_data = { 'p1': data.data.team.p2, 'p2': data.data.team.p1 };
                        }
                        // else {
                        //     currentGame.team_data = { 'p1': data.data.team.p1, 'p2': data.data.team.p2 };;
                        // }

                        // if (data.user[0].user == obj['User'].cc.user.user) {
                        //     console.log('我是p1', data.team);
                        //     team_data = { 'p1': data.team.p2, 'p2': data.team.p1 };
                        // } else {
                        //     console.log('我是p2');
                        //     team_data = { 'p1': data.team.p1, 'p2': data.team.p2 };
                        // }
                        // console.log('team_data', team_data);
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
                        GameScene.round = data.data;

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