// import { ALPHA_MODES } from "pixi.js";

let data: any[] = [];
let base = [
    { name: "star", url: "./images/star.png" },

    { name: "role06", url: "./images/pp.png" },
    { name: "leg", url: "./girl/leg.jpeg" },
    { name: "q", url: "./images/q.png" },
    { name: "trail", url: "./images/trail.png" },
    { name: "gh", url: "./images/gh.png" },

    // animation
    { name: "huo", url: "./game/huo.json" },
    { name: "fg", url: "./game/fg.json" },
    { name: "fg_2", url: "./game/fg_2.json" },
    { name: "fg_3", url: "./game/fg_3.json" },

    { name: "c1", url: "./game/c1.png" },
    { name: "c2", url: "./game/c2.png" },
    { name: "c3", url: "./game/c3.png" },

    // role
    { name: "r1", url: "./game/roles/r1.json" },
    { name: "r1n", url: "./game/roles/r1n.json" },
    { name: "r1nz", url: "./game/roles/r1nz.json" },

    { name: "r2n", url: "./game/roles/r2n.json" },

    { name: "r2nz", url: "./game/roles/r2nz.json" },

    { name: "r3nz", url: "./game/roles/r3nz.json" },

    { name: "n1", url: "./game/roles/n1.json" },
    { name: "n1n", url: "./game/roles/n1n.json" },
    { name: "n3", url: "./game/roles/n3.json" },
    { name: "n3n", url: "./game/roles/n3n.json" },
    // { name: "n2", url: "./game/roles/n2.json" },

    // spine
    { name: "spine", url: "./spine/girl127_2da01/jiabo.json" },
    // { name: "spine1", url: "./spine/yc_a_01nvpu/YC18.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine2", url: "./spine/yc_a_02lvyejingling/YC19.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine3", url: "./spine/yc_a_03xxnvpu/YC_A_03.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine4", url: "./spine/yc_a_04wujin/YC_A_04.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine5", url: "./spine/yc_a_05shujianvpu/YC_A_05.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine6", url: "./spine/yc_a_06luolita/YC_A_06.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine7", url: "./spine/yc_a_07weilaijingcha/YC_A_07.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine8", url: "./spine/yc_a_8hefushaonv/YC_A_12.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine9", url: "./spine/yc_a_09tuziguniang/YC_A_13.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine10", url: "./spine/yc_a_10xiaohua/YC_A_14.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine11", url: "./spine/yc_a_11mofagongzhu/YC_A_09jinglijingcha.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },
    // { name: "spine12", url: "./spine/yc_a_12mofagongzhu/YC_A_16.json", metadata: { imageMetadata: { alphaMode: ALPHA_MODES.PMA } } },

    // game
    { name: "blood", url: "./game/blood.json" },
    { name: "buff", url: "./game/buff.json" },

    { name: "skill_wlhd", url: "./game/wlhd.json" },
    { name: "skill_hfhy", url: "./game/hfhy.json" },
    { name: "skill_psdh", url: "./game/psdh.json" },

    { name: "skill_pi", url: "./game/pi.json" },

    { name: "map_zz", url: "./game/map_zz.json" },

    { name: "num1", url: "./game/num1.json" },
    { name: "num2", url: "./game/num2.json" },

    { name: "dead_fl", url: "./game/dead_fl.json" },
    { name: "dead_all", url: "./game/dead_all.json" },

    { name: "dead_1", url: "./game/dead_1.png" },
    { name: "dead_2", url: "./game/dead_2.png" },

    { name: 'game_win', url: "./game/win.png" },
    { name: 'game_fail', url: "./game/fail.png" },
    { name: 'game_row', url: "./game/row.png" },

    // ui
    { name: "home_nav", url: "./ui/home_nav.json" },
    { name: "home_nav_text", url: "./ui/home_nav_text.json" },
    { name: "chat_bar", url: "./ui/chat_bar.json" },
    { name: "chat_bg", url: "./ui/chat_bg.png" },
    { name: "edge", url: "./ui/edge.png" },
    { name: "home_title", url: "./ui/home_title.png" },
    { name: "home_map", url: "./ui/home_map.png" },

    { name: "home_bg", url: "./ui/home_bg.png" },
    { name: "home_avatar", url: "./ui/home_avatar.png" },
    { name: "home_slave", url: "./ui/home_slave.png" },
    { name: "home_data", url: "./ui/home_data.png" },
    { name: "hpmp_bg", url: "./ui/hpmp_bg.png" },
    { name: "home_hp", url: "./ui/home_hp.png" },
    { name: "home_mp", url: "./ui/home_mp.png" },

    { name: "home_chat", url: "./ui/home_chat.png" },
    { name: "home_column", url: "./ui/home_column.png" },
    { name: "home_columns", url: "./ui/home_columns.png" },
    { name: "home_button", url: "./ui/home_button.png" },

    { name: "bg10", url: "./ui/bg_10.png" },
    { name: "game_title", url: "./ui/game_title.png" },

    { name: "button_yun", url: "./ui/button_yun.png" },

    { name: "title_name", url: "./ui/title_name.png" },

    { name: "select_skill", url: "./ui/select_skill.png" },
    { name: "row_skill", url: "./ui/row_skill.png" },
    { name: "f_jt", url: "./ui/f_jt.png" },

    { name: "confirm_box", url: "./ui/confirm_box.png" },

    { name: "avatar", url: "./avatar/avatar.png" },

]
data.push(base)
export const assets = data