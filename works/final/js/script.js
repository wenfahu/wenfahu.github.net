var x = 120;
var y = 100;
var dx = 2;
var dy = 8;
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
    intervalId = setInterval(draw, 20);
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

/*
$(document).keydown(function(e) {
    if(e.keyCode == 39) {
        rightKeyDown = true;
    } else if(e.keyCode = 37) {
        leftKeyDown = true;
    } else if(e.keyCode = 38){
        upKeyDown = true;
    } else if(e.keyCode = 40){
        downKeyDown = true;
    }
});
$(document).keyup(function(e) {
    if(e.keyCode == 39) {
        rightKeyDown = false;
    } else if(e.keyCode == 37) {
        leftKeyDown = false;
    } else if(e.keyCode = 38){
        upKeyDown = false;
    } else if(e.keyCode = 40){
        downKeyDown = false;
    }
});
*/
function keyDown(e){
 switch(e.keyCode){
     //left
     case 37:
     paddlex -= 40;
     break;
     //up
     case 38:
     paddley -= 20;
     break;
     //right
     case 39:
     paddlex += 40;
     break;
     //down
     case 40:
     paddley += 20;
     break;
     //default:
     //console.log('unknown position');
 }
};


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

init();
window.addEventListener('keydown', keyDown, true);