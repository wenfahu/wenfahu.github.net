var xr = 150;   //the x coordinate of red circle center
var yr = 400;   //the y coordinate of red circle center
var rr = 40;    //the radius of red circle

var xb = 650;   //the x coordinate of blue circle center
var yb = 400;   //the y coordinate of blue circle center
var rb = 40;    //the radius of blue circle

var xw = 395;   //the x coordinate of white circle center
var yw = 150;   //the y coordinate of white circle center
var rw = 10;    //the radius of white circle

var mb = 1000;    //the mass of big circle
var ml = 100;     //the mass of little circle

var speedred = 0;        //the up-velocity of red circle
var speedredright = 0;
var speedblue = 0;       //the up-velocity of blue circle
var speedblueright = 0;
var speedwhiteup = 0;    //the up-velocity of white circle
var speedwhiteright = 0; //the right-velocity of white circle

var gravity_a = 0.5;     //gravity acceleration
var keys = [];           //press key

var score_red = 0;
var score_blue = 0;

var framerate = 6;

var intervalId = 0;
var canvas = document.getElementById('field');
var context = canvas.getContext('2d');
var canvas1 = document.getElementById('gates');

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

//main draw
function draw() {
    intervalId = setInterval('update()', framerate);
    setInterval('gravity()', framerate * 3);
    //setInterval('score()', framerate * 3);
    setInterval('calCollision()', framerate * 3);
    return intervalId;
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
    if (!checkCollision(xw, yw, rw, xr, yr, rr) || !checkCollision(xw, yw, rw, xb, yb, rb))
    {
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
        if (yw + rw <= 0) {
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

//calculate the angle of the line between two center and y-axis
function calAngel(x1, y1, r1, x2, y2, r2) {
    var dis = calDistance(x1, y1, r1, x2, y2, r2);
    var disx = Math.abs(x1 - x2);
    var sin = disx / dis;
    var angle = Math.asin(sin);
    return angle;
};

function calCollision() {
    if (checkCollision(xw, yw, rw, xr, yr, rr)) {
        var obj = ballCollision(xw, yw, rw, ml, 0, speedwhiteup, xr, yr, rr, mb, speedredright, speedred);
        speedwhiteright = obj.x1;
        speedwhiteup = obj.y1;
        clear();
        circle(xr, yr, rr, 'rgba(255, 0, 0, 0.5)');
        circle(xb, yb, rb, 'rgba(0, 0, 255, 0.5)');
        circle(xw, yw, rw, 'rgba(255, 255, 255, 1)');
    }
    if (checkCollision(xw, yw, rw, xb, yb, rb)) {
        var obj = ballCollision(xw, yw, rw, ml, 0, speedwhiteup, xb, yb, rb, mb, speedblueright, speedblue);
        speedwhiteright = obj.x;
        speedwhiteup = obj.y;
        clear();
        circle(xr, yr, rr, 'rgba(255, 0, 0, 0.5)');
        circle(xb, yb, rb, 'rgba(0, 0, 255, 0.5)');
        circle(xw, yw, rw, 'rgba(255, 255, 255, 1)');
    }
};

//check the collision of two ball
// input the x, y value of ball's position and the radius of ball
// return if the two balls meet

function checkCollision(ball1_x, ball1_y, ball1_r, ball2_x, ball2_y, ball2_r ){
    var delta_x = ball2_x - ball1_x;
    var delta_y = ball2_y - ball1_y;
    var dist = Math.sqrt(delta_y * delta_y + delta_x * delta_x);
    var sum_of_radius = ball1_r + ball2_r;
    if(dist <= sum_of_radius + 10){
        return true;
    }
    else {
        return false;
    }
}

function collision(ball1_x, ball1_y, ball1_x_vel, ball1_y_vel, ball2_x, ball2_y, ball2_x_vel, ball2_y_vel) {
    ball2_x_vel = -ball2_x_vel;
    ball2_y_vel = -ball2_y_vel;
}

// input x, y coordinate of ball and the radius of ball, mess of ball, and the x, y velocity of ball
// and return above values after collision

function ballCollision (ball1_x, ball1_y, ball1_r, ball1_mess, ball1_x_vel, ball1_y_vel, 
    ball2_x, ball2_y, ball2_r, ball2_mess, ball2_x_vel, ball2_y_vel) {
    var delta_x = ball1_x - ball2_x;
    var delta_y = ball1_y - ball2_y;

    var normalVec = new vector(delta_x, delta_y);
    normalVec = normalVec.normalise();

    var tangentVec = new vector((normalVec.getY() * -1), 
        normalVec.getX());

    var ball1_vel = new vector(ball1_x_vel, ball1_y_vel);
    var ball2_vel = new vector(ball2_x_vel, ball2_y_vel);

    var ball1_scalar_normal = normalVec.dot(ball1_vel);
    var ball2_scalar_normal = normalVec.dot(ball2_vel);

    var ball1_scalar_tangent = tangentVec.dot(ball1_vel);
    var ball2_scalar_tangent = tangentVec.dot(ball2_vel);

    var ball1ScalarNormalAfter = (ball1_scalar_normal * (ball1_mess - ball2_mess) + 2 * ball2_mess * ball2_scalar_normal) / (ball1_mess + ball2_mess);
    var ball2ScalarNormalAfter = (ball2_scalar_normal * (ball2_mess - ball1_mess) + 2 * ball1_mess * ball1_scalar_normal) / (ball1_mess + ball2_mess);

    var ball1scalarNormalAfter_vector = normalVec.multiply(ball1ScalarNormalAfter); // ball1Scalar normal doesnt have multiply not a vector.
    var ball2scalarNormalAfter_vector = normalVec.multiply(ball2ScalarNormalAfter);

    var ball1ScalarNormalVector = (tangentVec.multiply(ball1_scalar_tangent));
    var ball2ScalarNormalVector = (tangentVec.multiply(ball2_scalar_tangent));;

    ball1_vel  = ball1ScalarNormalVector.add(ball1scalarNormalAfter_vector);
    ball2_vel  = ball2ScalarNormalVector.add(ball2scalarNormalAfter_vector);

    ball1_x_vel = ball1_vel.getX();
    ball2_x_vel = ball2_vel.getX();
    ball1_y_vel = ball1_vel.getY();
    ball2_y_vel = ball2_vel.getY();
    return {x1:ball1_x_vel, y1:ball1_y_vel, x2:ball2_x_vel, y2:ball1_y_vel};
    // body...  
}

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
            speedblue = -8;
            yb = yb + speedblue;
        }
    }
    //down
    if (keys[40]) {
        
    }
    //right
    if (keys[39] && xb + rb < 800) {
        xb += 2;
        speedblueright = 5;
        }
    //left
    if (keys[37] && xb > rb) {
        xb -= 2;
        speedblueright = -5;
    }
    if (!keys[37]) { speedblueright = 0; }
    if (!keys[39]) { speedblueright = 0; }


    //W
    if (keys[87]) {
        if (yr == 400) {
            speedred = -8;
            yr = yr + speedred;
        }
    }
    //S
    if (keys[83]) {

    }
    //A
    if(keys[65] && xr > rr) {
        xr -= 2;
        speedredright = -5;
    }
    //D
    if (keys[68] && xr + rr < 800) {
        xr += 2;
        speedredright = 5;
    }
    if (!keys[68]) { speedredright = 0;}
    if (!keys[65]) { speedredright = 0;}
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