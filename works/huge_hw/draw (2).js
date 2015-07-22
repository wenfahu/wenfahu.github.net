var xr = 150;   //the x coordinate of red circle center
var yr = 400;   //the y coordinate of red circle center
var rr = 40;    //the radius of red circle

var xb = 650;   //the x coordinate of blue circle center
var yb = 400;   //the y coordinate of blue circle center
var rb = 40;    //the radius of blue circle

var xw = 395;   //the x coordinate of white circle center
var yw = 150;   //the y coordinate of white circle center
var rw = 10;    //the radius of white circle

var mb = 10;    //the mass of big circle
var ml = 1;     //the mass of little circle

var speedred = 0;        //the up-velocity of red circle
var speedblue = 0;       //the up-velocity of blue circle
var speedwhiteup = 0;    //the up-velocity of white circle
var speedwhiteright = 0; //the right-velocity of white circle

var gravity_a = 0.5;     //gravity acceleration
var keys = [];           //press key

var score_red = 0;
var score_blue = 0;

var intervalId = 0;
var canvas = document.getElementById('field');
var context = canvas.getContext('2d');
var canvas1 = document.getElementById('gates');

//main draw
function draw() {
    intervalId = setInterval('update()', 5);
    setInterval('gravity()', 15);
    setInterval('score()', 15);
    setInterval('calCrash()', 30);
    return intervalId;
};

//draw circle
function circle(x, y, r, fillstyle) {
    if (canvas == null) return false;
    context.fillStyle = "#EEEEFF";
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = fillstyle;
    context.fill();
};

//draw rectangle
function rectangle(x1, y1, w, h, fillstyle) {
    if (canvas1 == null) return false;
    var context = canvas1.getContext('2d');
    context.fillStyle = "#EEEEFF";
    context.beginPath();
    context.rect(x1, y1, w, h);
    context.closePath();
    context.fillStyle = fillstyle;
    context.fill();
};

//clear canvas
function clear(obj) {
    context.clearRect(0, 0, 800, 400);
};

//calculate the affection of gravity
function gravity() {
    if (yb < 400) {
        speedblue = speedblue + gravity_a;
        yb = yb + speedblue;
        if (yb > 400) {
            yb = 400;
        }
    }

    if (yr < 400) {
        speedred = speedred + gravity_a;
        yr = yr + speedred;
        if (yr > 400) {
            yr = 400;
        }
    }

    if (yw < 400) {
        speedwhiteup += gravity_a;
        yw = yw + speedwhiteup;
        if (yw + rw > 400) {
            yw = 400 - rw;
            speedwhiteup -= 1;
            speedwhiteup = -speedwhiteup;
            
        }
        else if ((yw + rw >= 240 && yw < 240) && (xw + rw < 60 || xw + rw > 740)) {
            speedwhiteup -= 1;
            speedwhiteup = -speedwhiteup;
        }
        else if ((yw - rw <= 250 && yw > 240) && (xw + rw < 60 || xw + rw > 740)) {
            speedwhiteup -= 1;
            speedwhiteup = -speedwhiteup;
        }
    }

    if (xw < 0) { speedwhiteright = -speedwhiteright; }
    if (xw > 800 - 2 * rw) { speedwhiteright = -speedwhiteright; }
    if (yw + rw == 400 && speedwhiteup == 0) {
        if (speedwhiteright > 0) { speedwhiteright -= 0.1; if (speedwhiteright <= 0) { speedwhiteright = 0; } }
        if (speedwhiteright < 0) { speedwhiteright += 0.1; if (speedwhiteright >= 0) { speedwhiteright = 0; } }
    }
    xw = xw + speedwhiteright;
    calCrash();
    clear();
    circle(xr, yr, rr, 'rgba(255, 0, 0, 0.5)');
    circle(xb, yb, rb, 'rgba(0, 0, 255, 0.5)');
    circle(xw, yw, rw, 'rgba(255, 255, 255, 1)');
};

//calculate the distance of two circles' center
function calDistance(x1, y1, r1, x2, y2, r2) {
    var cx1 = x1;
    var cx2 = x2;
    var cy1 = y1;
    var cy2 = y2;
    var dis = (cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2);
    dis = Math.sqrt(dis);
    return dis;
};

//calculate the angle of the line between two cent
function calAngel(x1, y1, r1, x2, y2, r2) {
    var dis = calDistance(x1, y1, r1, x2, y2, r2);
    //var disx = x2 - x1;
    var disx = Math.abs(x1 - x2);
    var sin = disx / dis;
    var angle = Math.asin(sin);
    return angle;
};

function calCrash() {
    //white and red
    if (calDistance(xw, yw, rw, xr, yr, rr) <= rw + rr) {
        var speedright;
        //A
        if (keys[65] && xr > rr) { speedright = -2; }
        //D
        else if (keys[68] && xr + rr < 800) { speedright = 2; }
        else if (keys[65] == false && keys[68] == false) { speedright = 0 };

        var angel = calAngel(xw, yw, rw, xr, yr, rr);
        var cos = Math.cos(angel);
        var sin = Math.sin(angel);

       /* if (yw < yr) {*/
            var vel_normal_big = speedred/15 * cos + speedright * sin;
            var vel_normal_little = speedwhiteup/15 * cos + speedwhiteright * sin;
            var vel_tangent_big = speedred/15 * sin + speedright * cos;
            var vel_tangent_little = speedwhiteup/15 * sin + speedwhiteright * cos;

            if (((xr - xw) / (vel_normal_big - vel_normal_little) > 0) || ((yr - yw) / (vel_normal_big - vel_normal_little) > 0)) {
                var del = vel_normal_big - vel_normal_little;
                del = -del;
                vel_normal_little = vel_tangent_big - del;
            }

            speedwhiteup = vel_normal_little * cos + vel_tangent_little * sin;
            speedwhiteright = vel_normal_little * sin + vel_tangent_little * cos;
    }

    //white and blue
    if (calDistance(xw, yw, rw, xb, yb, rb) <= rw + rb) {
        var speedright;
        //right
        if (keys[39] && xb + rb < 800) {speedright = 2;}
        //left
        if (keys[37] && xb > rb) { speedright = -2; }
        else if (keys[37] == false && keys[38] == false) { speedright = 0 };

        var angel = calAngel(xw, yw, rw, xb, yb, rb);
        var cos = Math.cos(angel);
        var sin = Math.sin(angel);

        var vel_normal_big = speedblue/15 * cos + speedright * sin;
        var vel_normal_little = speedwhiteup/15 * cos + speedwhiteright * sin;
        var vel_tangent_big = speedblue / 15 * sin + speedright * cos;
        var vel_tangent_little = speedwhiteup/15 * sin + speedwhiteright * cos;

        if (((xb - xw) / (vel_normal_big - vel_normal_little) > 0) || ((yb - yw) / (vel_normal_big - vel_normal_little) > 0)) {
            var del = vel_normal_big - vel_normal_little;
            del = -del;
            vel_normal_little = vel_tangent_big - del;
        }

        speedwhiteup = vel_normal_little * cos + vel_tangent_little * sin;
        speedwhiteright = vel_normal_little * sin + vel_tangent_little * cos;
    }
};

function score() {
    if (xw - rw < 60 && yw >= 250) {
        score_blue++;
        xr = 150;
        yr = 400;
        xb = 650;
        xw = xr;
        yb = 400;
        yw = 150;
        speedred = 0;
        speedblue = 0;
        speedwhiteup = 0;
        speedwhiteright = 0;

        setTimeout('clear()', 3000);
        circle(xr, yr, rr, 'rgba(255, 0, 0, 0.5)');
        circle(xb, yb, rb, 'rgba(0, 0, 255, 0.5)');
        circle(xw, yw, rw, 'rgba(255, 255, 255, 1)');
    }
    if (xw + rw >= 740 && yw >= 250)
    {
        score_red++;
        xr = 150;
        yr = 400;
        xb = 650;
        xw = xb;
        yb = 400;
        yw = 150;
        speedred = 0;
        speedblue = 0;
        speedwhiteup = 0;
        speedwhiteright = 0;

        setTimeout('clear()', 3000);
        circle(xr, yr, rr, 'rgba(255, 0, 0, 0.5)');
        circle(xb, yb, rb, 'rgba(0, 0, 255, 0.5)');
        circle(xw, yw, rw, 'rgba(255, 255, 255, 1)');
    }
};

function update() {
    //up
    if (keys[38]) {
        if (yb == 400) {
            speedblue = -10;
            yb = yb + speedblue;
        }
    }
    //down
    if (keys[40]) {
        
    }
    //right
    if (keys[39] && xb + rb < 800) {
        xb += 2;
    }
    //left
    if (keys[37] && xb > rb) {
        xb -= 2;
    }


    //W
    if (keys[87]) {
        if (yr == 400) {
            speedred = -10;
            yr = yr + speedred;
        }
    }
    //S
    if (keys[83]) {

    }
    //A
    if(keys[65] && xr > rr) {
        xr -= 2;
    }
    //D
    if (keys[68] && xr + rr < 800) {
        xr +=  2;
    }
    calCrash();
    clear();
    circle(xr, yr, rr, 'rgba(255, 0, 0, 0.5)');
    circle(xb, yb, rb, 'rgba(0, 0, 255, 0.5)');
    circle(xw, yw, rw, 'rgba(255, 255, 255, 1)');
};



$(window).load(function () {
    new rectangle(0, 250, 60, 150, 'rgba(255, 255, 255, 0.3)');
    new rectangle(0, 240, 60, 10, 'rgba(255, 0, 0, 0.5)');
    new rectangle(740, 250, 60, 150, 'rgba(255, 255, 255, 0.3)');
    new rectangle(740, 240, 60, 10, 'rgba(0, 0, 255, 0.5)');

    draw();
});

window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true;
    // body...
    //update();
});

window.addEventListener('keyup', function (e) {
    // body...
    keys[e.keyCode] = false;
    //update();
});