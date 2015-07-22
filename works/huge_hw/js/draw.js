var frame_rate = 10;

var gate_width = 50;
var gate_height = 120;

var player_width = 50;
var player_height = 50;

var ball_width = 12;
var ball_height = 12;

var red_location_x = 160;
var red_location_y = 180;

var red_score = 0;
var blue_score = 0;

var blue_location_x = 600;
var blue_location_y = 180;

var white_location_x = 400 - ball_width / 2;
var white_location_y = 200 - ball_height / 2;

var keys = [];

var canvas_gate = document.getElementById('gate');
var canvas_field = document.getElementById('field');

var interval_blue;
var interval_red;

function rectangle(x1, y1, w, h, fillstyle, canvas) {
    if (canvas == null) return false;
    var context = canvas.getContext('2d');
    context.fillStyle = "#EEEEFF";
    context.beginPath();
    context.rect(x1, y1, w, h);
    context.closePath();
    context.fillStyle = fillstyle;
    context.fill();
};

function clear(obj) {
    obj.clearRect(0, 0, 800, 400);
};

function init() {
    draw();
};

function draw() {
    //setInterval('update()', frame_rate);
    interval_blue = setInterval('blue_push()', frame_rate);
    interval_red = setInterval('red_push()', frame_rate);
};

function blue_push() {
    if (white_location_x == blue_location_x - ball_width && (white_location_y + ball_height > blue_location_y && white_location_y < blue_location_y + player_height)) {
        //up
        if (keys[38] && blue_location_y > 0) {
            blue_location_y -= 2;
            white_location_y -= 2;
        }
        //down
        if (keys[40] && blue_location_y < 400 - player_height) {
            blue_location_y += 2;
            white_location_y += 2;
        }
        //right
        if (keys[39] && blue_location_x < 800 - player_width) {
            blue_location_x += 2;
        }
        //left
        if (keys[37] && blue_location_x > ball_width) {
            blue_location_x -= 2;
            white_location_x -= 2;
        }
    }
    else if (white_location_x == blue_location_x + player_width && (white_location_y + ball_height > blue_location_y && white_location_y < blue_location_y + player_height)) {
        //up
        if (keys[38] && blue_location_y > 0) {
            blue_location_y -= 2;
            white_location_y -= 2;
        }
        //down
        if (keys[40] && blue_location_y < 400 - player_height) {
            blue_location_y += 2;
            white_location_y += 2;
        }
        //left
        if (keys[37] && blue_location_x > 0) {
            blue_location_x -= 2;
        }
        //right
        if (keys[39] && blue_location_x < 800 - player_width - ball_width) {
            blue_location_x += 2;
            white_location_x += 2;
        }
    }
    else if (white_location_y + ball_height == blue_location_y && (white_location_x + ball_width > blue_location_x && white_location_x < blue_location_x + player_width)) {
        //up
        if (keys[38] && blue_location_y > ball_height) {
            blue_location_y -= 2;
            white_location_y -= 2;
        }
        //down
        if (keys[40] && blue_location_y < 400 - player_height) {
            blue_location_y += 2;
        }
        //right
        if (keys[39] && blue_location_x < 800 - player_width) {
            blue_location_x += 2;
            white_location_x += 2;
        }
        //left
        if (keys[37] && blue_location_x > 0) {
            blue_location_x -= 2;
            white_location_x -= 2;
        }
    }
    else if (white_location_y == blue_location_y + player_height && (white_location_x + ball_width > blue_location_x && white_location_x < blue_location_x + player_width)) {
        //up
        if (keys[38] && blue_location_y > 0) {
            blue_location_y -= 2;
        }
        //down
        if (keys[40] && blue_location_y < 400 - player_height - ball_height) {
            blue_location_y += 2;
            white_location_y += 2;
        }
        //right
        if (keys[39] && blue_location_x < 800 - player_width) {
            blue_location_x += 2;
            white_location_x += 2;
        }
        //left
        if (keys[37] && blue_location_x > 0) {
            blue_location_x -= 2;
            white_location_x -= 2;
        }
    }
    else {
        //up
        if (keys[38] && blue_location_y > 0) {
            blue_location_y -= 2;
        }
        //down
        if (keys[40] && blue_location_y < 400 - player_height) {
            blue_location_y += 2;
        }
        //right
        if (keys[39] && blue_location_x < 800 - player_width) {
            blue_location_x += 2;
        }
        //left
        if (keys[37] && blue_location_x > 0) {
            blue_location_x -= 2;
        }
    }

    clear(canvas_field.getContext('2d'));
    rectangle(blue_location_x, blue_location_y, player_width, player_height, 'rgba(0, 0, 255, 0.4)', canvas_field);
    rectangle(red_location_x, red_location_y, player_width, player_height, 'rgba(255, 0, 0, 0.4)', canvas_field);
    rectangle(white_location_x, white_location_y, ball_width, ball_height, 'rgba(255, 255, 255, 1)', canvas_field);
    score();
};

function red_push() {

    if (white_location_x == red_location_x - ball_width && (white_location_y + ball_height > red_location_y && white_location_y < red_location_y + player_height)) {
        //W
        if (keys[87] && red_location_y > 0) {
            red_location_y -= 2;
            white_location_y -= 2;
        }
        //S
        if (keys[83] && red_location_y < 400 - player_height) {
            red_location_y += 2;
            white_location_y += 2;
        }
        //D
        if (keys[68] && red_location_x < 800 - player_width) {
            red_location_x += 2;
        }
        //A
        if (keys[65] && red_location_x > ball_width) {
            red_location_x -= 2;
            white_location_x -= 2;
        }
    }
    else if (white_location_x == red_location_x + player_width && (white_location_y + ball_height > red_location_y && white_location_y < red_location_y + player_height)) {
        //W
        if (keys[87] && red_location_y > 0) {
            red_location_y -= 2;
            white_location_y -= 2;
        }
        //S
        if (keys[83] && red_location_y < 400 - player_height) {
            red_location_y += 2;
            white_location_y += 2;
        }
        //D
        if (keys[68] && red_location_x < 800 - player_width - ball_width) {
            red_location_x += 2;
            white_location_x += 2;
        }
        //A
        if (keys[65] && red_location_x > 0) {
            red_location_x -= 2;
        }
    }
    else if (white_location_y + ball_height == red_location_y && (white_location_x + ball_width > red_location_x && white_location_x < red_location_x + player_width)) {
        //W
        if (keys[87] && red_location_y > ball_height) {
            red_location_y -= 2;
            white_location_y -= 2;
        }
        //S
        if (keys[83] && red_location_y < 400 - player_height) {
            red_location_y += 2;
        }
        //D
        if (keys[68] && red_location_x < 800 - player_width) {
            red_location_x += 2;
            white_location_x += 2;
        }
        //A
        if (keys[65] && red_location_x > 0) {
            red_location_x -= 2;
            white_location_x -= 2;
        }
    }
    else if (white_location_y == red_location_y + player_height && (white_location_x + ball_width > red_location_x && white_location_x < red_location_x + player_width)) {
        //W
        if (keys[87] && red_location_y > 0) {
            red_location_y -= 2;
        }
        //S
        if (keys[83] && red_location_y < 400 - player_height - ball_height) {
            red_location_y += 2;
            white_location_y += 2;
        }
        //D
        if (keys[68] && red_location_x < 800 - player_width) {
            red_location_x += 2;
            white_location_x += 2;
        }
        //A
        if (keys[65] && red_location_x > 0) {
            red_location_x -= 2;
            white_location_x -= 2;
        }
    }
    else {
        //W
        if (keys[87] && red_location_y > 0) {
            red_location_y -= 2;
        }
        //S
        if (keys[83] && red_location_y < 400 - player_height) {
            red_location_y += 2;
        }
        //D
        if (keys[68] && red_location_x < 800 - player_width) {
            red_location_x += 2;
        }
        //A
        if (keys[65] && red_location_x > 0) {
            red_location_x -= 2;
        }
    }
    clear(canvas_field.getContext('2d'));
    rectangle(blue_location_x, blue_location_y, player_width, player_height, 'rgba(0, 0, 255, 0.4)', canvas_field);
    rectangle(red_location_x, red_location_y, player_width, player_height, 'rgba(255, 0, 0, 0.4)', canvas_field);
    rectangle(white_location_x, white_location_y, ball_width, ball_height, 'rgba(255, 255, 255, 1)', canvas_field);
    score();
};

function score() {
    document.getElementById('score_field').innerHTML = red_score + ":" + blue_score;
    if (white_location_x < gate_width && (white_location_y >= 200 - gate_height/2 && white_location_y + ball_height <= 200 + gate_height/2)) {
        blue_score++;
        document.getElementById('score_field').innerHTML = red_score + ":" + blue_score;
        window.clearInterval(interval_blue);
        window.clearInterval(interval_red);
        blue_location_x = 600;
        blue_location_y = 180;
        red_location_x = 160;
        red_location_y = 180;
        white_location_x = 400 - ball_width / 2 - 150;
        white_location_y = 200 - ball_height / 2;
        setTimeout('draw()', 1000);
    }
    if (white_location_x > 800 - gate_width - ball_width && (white_location_y >= 200 - gate_height / 2 && white_location_y + ball_height <= 200 + gate_height / 2)) {
        red_score++;
        document.getElementById('score_field').innerHTML = red_score + ":" + blue_score;
        window.clearInterval(interval_blue);
        window.clearInterval(interval_red);
        blue_location_x = 600;
        blue_location_y = 180;
        red_location_x = 160;
        red_location_y = 180;
        white_location_x = 400 - ball_width / 2 + 150;
        white_location_y = 200 - ball_height / 2;
        setTimeout('draw()', 1000);
    }
};

$(window).load(function () {
    //red's gate
    new rectangle(0, 200 - gate_height / 2, gate_width, gate_height, 'rgba(255, 255, 255, 0.4)', canvas_gate);
    new rectangle(0, 200 - gate_height / 2 - 5, gate_width, 5, 'rgba(255, 0, 0, 0.4)', canvas_gate);
    new rectangle(0, 200 + gate_height / 2, gate_width, 5, 'rgba(255, 0, 0, 0.4)', canvas_gate);
    //blue's gate
    new rectangle(800 - gate_width, 200 - gate_height / 2, gate_width, gate_height, 'rgba(255, 255, 255, 0.4)', canvas_gate);
    new rectangle(800 - gate_width, 200 - gate_height / 2 - 5, gate_width, 5, 'rgba(0, 0, 255, 0.4)', canvas_gate);
    new rectangle(800 - gate_width, 200 + gate_height / 2, gate_width, 5, 'rgba(0, 0, 255, 0.4)', canvas_gate);

    draw();
});

window.addEventListener('keyppress', function (e) {

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