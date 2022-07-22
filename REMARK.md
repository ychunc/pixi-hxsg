# Events
仅鼠标       仅触摸       鼠标 + 触控
click	    tap	        pointertap
mousedown   touchstart	pointerdown
mouseup     touchend	pointerup
mousemove	touchmove	pointermove

pointerupoutside 弹起指针在外

# callback
function(event) {}
(event) => {}
() =>

# 怎么使用面向对象实现回调

# 多学习设计模式

# spine 修复
修改找不到的 Region not found in atlas : 

一个角色一张图!!!

# 人物
[头] 21x21
[体] 24x16,36x16
[腿] 15x9,13x9


# 多个对象多个同事件
[app.stage, whiteBox, blackBox].forEach((object) => {
    object.addEventListener('pointerenter', onEvent);
    object.addEventListener('pointerleave', onEvent);
    object.addEventListener('pointerover', onEvent);
    object.addEventListener('pointerout', onEvent);
});

# 人物移动
x = 150|0
y = 90*n

LM18674868661WYR

header y:0
body y:0 + header.height


5 13 16 21