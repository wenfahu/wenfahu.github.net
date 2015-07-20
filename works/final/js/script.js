var x = 120;
var y = 100;
var dx = 2;
var dy = 8;
var velX = 0;
var velY = 0;
var speed = 10;
var friction = 0.98;
var keys = [];
var ctx;
var width;
var height;
var paddlex;
var paddley;
var paddlew = 75;
var paddleh = 10;
var intervalId = 0;

function init() {
    ctx = $("#canvas")[0].getContext("2d");
    width = $("#canvas").width();
    height = $("#canvas").height();
    paddlex = width / 2;
    paddley = height - paddleh;
    intervalId = setInterval(update, 20);
    return intervalId;
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, width, height);
}

var leftKeyDown = false;
var rightKeyDown = false;
var upKeyDown = false;
var downKeyDown = false;

function update(){
    //up
    if(keys[38]){
        if(velY > -speed){
            velY--;
        }
    }
    //down
    if(keys[40]){
        if(velY < speed){
            velY++;
        }
    }
    //right
    if(keys[39]){
        if(velX < speed){
            velX++;
        }
    }
    //left
    if(keys[37]){
        if(velX > -speed){
            velX--;
        }
    }


    velY *= friction;
    paddley += velY;
    velX *= friction;
    paddlex += velX;

    if( paddley >= 295){
        paddley = 295;
    } else if(paddley <= 5){
        paddley = 5;
    }

    if( paddlex >= 245){
        paddlex = 245;
    } else if(paddlex <= 5){
        paddlex = 5;
    }

    clear();
    circle(x, y, 10);    
    rect(paddlex, paddley, paddlew, paddleh);
    if (x + dx > width || x + dx < 0) {
        dx = -dx;
    }
    if (y + dy < 0) {
        dy = -dy;
    } else if (y + dy > paddley) {
        if (x > paddlex && x < paddlex + paddlew) {
            dy = -dy;
        } else {
            if(y + dy < height){

            }else{
                clearInterval(intervalId);
            }
        }
    }
    x += dx;
    y += dy;

    //setTimeout(update, 10);
};

/*
function draw() {
    clear();
    circle(x, y, 10);    
    rect(paddlex, paddley, paddlew, paddleh);
    if (x + dx > width || x + dx < 0) {
        dx = -dx;
    }
    if (y + dy < 0) {
        dy = -dy;
    } else if (y + dy > paddley) {
        if (x > paddlex && x < paddlex + paddlew) {
            dy = -dy;
        } else {
            if(y + dy < height){

            }else{
                clearInterval(intervalId);
            }
        }
    }
    x += dx;
    y += dy;
}
*/

init();
window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
    // body...
    //update();
});

window.addEventListener('keyup', function(e) {
    // body...
    keys[e.keyCode] = false;
    //update();
});