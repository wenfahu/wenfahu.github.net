var xr = 150;
var yr = 400;
var rr = 45;
var xb = 650;
var yb = 400;
var rb = 45;
var xw = 395;
var yw = 150;
var rw = 10;
var speedred = 0;
var speedblue = 0;
var speedwhiteup = 0;
var speedwhiteright = 0;
var gravity_a = 0.5;
var keys = [];
var score_red = 0;
var score_blue = 0;
var intervalId = 0;
var canvas = document.getElementById('field');
var context = canvas.getContext('2d');
var canvas1 = document.getElementById('gates');

function circle(x, y, r, fillstyle) {
    if (canvas == null) return false;
    context.fillStyle = "#EEEEFF";
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = fillstyle;
    context.fill();
};

function draw() {
    intervalId = setInterval('update()', 5);
    setInterval('gravity()', 15);
    return intervalId;
};

//check the collision of two ball
// input the x, y value of ball's position and the radius of ball
// return if the two balls meet

function checkCollision(ball1_x, ball1_y, ball1_r, ball2_x, ball2_y, ball2_r ){
    var delta_x = ball2_x - ball1_x;
    var delta_y = ball2_y - ball1_y;
    var dist = Math.sqrt(delta_y * delta_y + delta_x * delta_x);
    var sum_of_radius = ball1_r + ball2_r;
    if(dist <= sum_of_radius){
        return true;
    }
    else {
        return false;
    }
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
    var ball2_scalar_tangent = tangentVec.dot(ball2_vel

    var ball1ScalarNormalAfter = (ball1_scalar_normal * (ball1_mess - ball2_mess) + 2 * ball2_mess * ball2_scalar_normal) / (ball1_mess + ball2_mess);
    var ball2ScalarNormalAfter = (ball2_scalar_normal * (ball2_mess - ball1_mess) + 2 * ball1_mess * ball1_scalar_normal) / (ball1_mess + ball2_mess);

    var ball1scalarNormalAfter_vector = normalVec.multiply(ball1ScalarNormalAfter); // ball1Scalar normal doesnt have multiply not a vector.
    var ball2scalarNormalAfter_vector = normalVec.multiply(ball2ScalarNormalAfter);

    var ball1ScalarNormalVector = (tangentVec.multiply(ball1_scalar_tangential));
    var ball2ScalarNormalVector = (tangentVec.multiply(ball2_scalar_tangential));;

    ball1_vel  = ball1ScalarNormalVector.add(ball1scalarNormalAfter_vector);
    ball2_vel  = ball2ScalarNormalVector.add(ball2scalarNormalAfter_vector);

    ball1_x_vel = ball1_vel.getX();
    ball2_x_vel = ball2_vel.getX();
    // body...  
}

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

function clear(obj) {
    context.clearRect(0, 0, 800, 400);
};

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
        else if (yw + rw > 160 && (xw + rw < 80 || xw + rw > 720)) {
            yw = 160 - rw;
            speedwhiteup -= 1;
            speedwhiteup = -speedwhiteup;
        }
    }

    clear();
    circle(xr, yr, rr, 'rgba(255, 0, 0, 0.5)');
    circle(xb, yb, rb, 'rgba(0, 0, 255, 0.5)');
    circle(xw, yw, rw, 'rgba(255, 255, 255, 1)');
};

function calDistance(x1, y1, r1, x2, y2, r2) {
    var cx1 = x1 - r1;
    var cx2 = x2 - r2;
    var cy1 = y1;
    var cy2 = y2;
    var dis = (cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2);
    dis = Math.sqrt(dis);
    return dis;
};

function calAngel(x1, y1, r1, x2, y2, r2) {
    var dis = calDistance(x1, y1, r1, x2, y2, r2);
    var disx = Math.abs(x1 - x2);
    var sin = disx / dis;
    var angle = Math.asin(sin);
    return angle;
};

function calCrash() {
    //white and red
    if (calDistance(xw, yw, rw, xr, yr, rr) == rw + rr) {
        var speedtight;
        //A
        if (keys[65] && xr > rr) { speedright = -20; }
        //D
        else if (keys[68] && xr + rr < 800) { speedright = 20; }
        else if (key[65] == false && key[68] == false) { speedright = 0 };

        var angel = calAngel(xw, yw, rw, xr, yr, rr);

    }

    //white and blue
    if (calDistance(xw, yw, rw, xb, yb, rb) == rw + rb) {
        //right
        if (keys[39] && xb + rb < 800) {
            var speedright = 20;
        }
        //left
        if (keys[37] && xb > rb) {
            var speedright = -20;
        }
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