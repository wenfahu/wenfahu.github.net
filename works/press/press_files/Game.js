var anyKey=false;
var keyPress=[];

var gameObjects=[];
var players=[];
var balls=[];
var player1;
var player2;
var net;
var floor;
var leftWall;
var rightWall;

var courtBounds;
var gameFunction=waitForKey;
var gameScore=0;
var scoreBar;

var slowMoPress=false;
var slowMoTime=5;
var slowMoCount=slowMoTime;
var slowMoInterval;

var playerImpulseX=6;
var playerImpulseY=6;
var box2d;

var SCALE = 30; //Meters per pixel
var FPS=45;

var easel;
var gameText;

function init() 
{   
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )
		addMobile();


	var canvas = document.getElementById("GameFrame");
	courtBounds = new Rectangle();
	courtBounds.width = canvas.width;
	courtBounds.height = canvas.height-6;

	easel=new DrawEngine(canvas);
	box2d=new Box2d(SCALE,courtBounds);
	box2d.setup(courtBounds); 
	
	//Score stuff
 	scoreBar=new BarDrawing(courtBounds.width/2, courtBounds.height,0,6,"#863c3c");
 	slowMoBar=new BarDrawing(courtBounds.width/2-70, 0,140,12,"#bd83a4")
	gameText=easel.createText("PRESS ANY KEY TO BEGIN", courtBounds.width/2, courtBounds.height/2,"#000");	
	
	//Initialize game based on type
	initGameWorld();
	
	//I/O stuff
	window.onkeydown=keyDownHandler;
	window.onkeyup=keyUpHandler;
	window.onfocus=focusHandler;
	window.onblur=blurHandler;
/*
	$(window).keydown(keyDownHandler);
	$(window).keyup(keyUpHandler);
	$(window).focus(focusHandler);
	$(window).blur(blurHandler);
	
*/
	
	Ticker.setFPS(FPS);
	Ticker.addListener(this);
}

function ActorObject(body, skin) 
{
	this.body = body;
	this.skin = skin;
	
	this.update = function() 
	{
		this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
		this.skin.x = this.body.GetWorldCenter().x * SCALE;
		this.skin.y = this.body.GetWorldCenter().y * SCALE;
	}
}

function Player(initialX,initialY, r, color, leftKey,rightKey,upKey,downKey, Jumpables)
{
	this.initialX=initialX;
	this.initialY=initialY;
	this.r=r;
	this.color=color;
	this.left=false;
	this.right=false;
	this.up=false;
	this.down=false;
	this.Jumpables=Jumpables;
	this.canJumpOff=[];
	this.touchingFloor=false;
	this.touchingNet=false;
	this.touchingWall=false;
	this.actor;
	
	var playerSkin= easel.createCircleSkin(this.initialX,this.initialY,this.r,this.color);
	var playerBody= box2d.createCircleBody(this.initialX,this.initialY,this.r,-1,0); ///in -1 group aka doesn't touch anything in -1, 0 restitution
	this.actor=new ActorObject(playerBody,playerSkin);
	
	var player=this;
	keyPress[leftKey]= function(b) {player.left=b;};
	keyPress[rightKey]= function(b) {player.right=b;};
	keyPress[upKey]= function(b) {player.up=b};
	keyPress[downKey]= function(b) {slowMoPress=b;};
	
	for(var i in player.Jumpables)
	{
		player.canJumpOff[i]=new Object();
		player.canJumpOff[i].touching=false;
		var jumpable=player.canJumpOff[i];
		//Craziest line of code ever...
		box2d.listenTouching(
			player.actor.body,player.Jumpables[i].actor.body,
			(function(i, jumpable)
				{return function(touching)
							{
								jumpable.touching=touching;
/* 								console.log(touching); */
							}
				}
			)(i,jumpable));
	}
}

function Ball(initialX, initialY, r, color)
{
	this.initialX=initialX;
	this.initialY=initialY;
	this.r=r;
	this.color=color;
	this.actor;
	
	var ball=this;
	var ballSkin= easel.createCircleSkin(this.initialX, this.initialY, this.r, this.color);
	ballSkin.alpha=1;
	var ballBody= box2d.createCircleBody(this.initialX, this.initialY, this.r,1,1);
	this.actor=new ActorObject(ballBody,ballSkin);
	
	box2d.jumpBody(this.actor.body, -playerImpulseY);	//Ball created jumping
}

function Boundary(initialX, initialY, width, height, color, grouping)
{
	this.initialX=initialX;
	this.initialY=initialY;
	this.width=width;
	this.height=height
	this.color=color;
	this.actor;
	
	var boundarySkin= easel.createRectangleSkin(this.initialX, initialY, this.width, this.height, this.color);
	var boundaryBody= box2d.createRectangleBody(this.initialX, initialY, this.width, this.height,grouping,0); // grouping and 0 restitution
	this.actor=new ActorObject(boundaryBody,boundarySkin);
}

function BarDrawing(initialX, initialY, width, height, color)
{
	this.initialX=initialX;
	this.initialY=initialY;
	this.width=width;
	this.height=height
	this.color=color;
	this.actor;
	
	var boundarySkin= easel.createRectangleSkin(this.initialX, initialY, this.width, this.height, this.color);
	var boundaryBody= null;
	this.actor=new ActorObject(boundaryBody,boundarySkin);
}


function BoundarySensor(initialX, initialY, width, height)
{
	this.initialX=initialX;
	this.initialY=initialY;
	this.width=width;
	this.height=height
	this.actor;

	var boundaryBody= box2d.createRectangleSensorBody(this.initialX, this.initialY, this.width, this.height); // grouping and 0 restitution
	this.actor=new ActorObject(boundaryBody,null);
}

//Main Tick
function tick() 
{
	gameFunction();
	easel.stage.update();
	//box2d.drawDebug();
}
///////////////////////////////
//Game Functions///////////////
function resetGame()
{
	box2d.setPaused(true);
	for(var i in gameObjects) 
	{		
		box2d.stopBody(gameObjects[i].actor.body);
		box2d.setPosition(gameObjects[i].actor.body,gameObjects[i].initialX, gameObjects[i].initialY);	 
	}
	box2d.jumpBody(balls[0].actor.body, -playerImpulseY);
	
	resetSlowMotioner();	
	gameText.visible=false;
	box2d.setPaused(false);
}

function waitForKey()
{
	if (anyKey)
	{
		gameText.visible=false;
		gameFunction=gameStep;
		box2d.setPaused(false);
	}	
}

function gameStep()
{
	aiThink();
	checkPlayerMovement();
	box2d.update();
	for(var i in gameObjects) 
	{
		box2d.speedLimit(gameObjects[i].actor.body);
  	gameObjects[i].actor.update();
	}
}

function aiThink()
{
	//No AI in this mode
}

function checkPlayerMovement()
{
	for(var i in players)
	{
		if (players[i].left)
			box2d.impulseBodyX(players[i].actor.body,-playerImpulseX);
		if (players[i].right)
			box2d.impulseBodyX(players[i].actor.body,playerImpulseX);
		if(!players[i].left &&!players[i].right)
			box2d.stopBodyX(players[i].actor.body)
			
		for (var j in players[i].canJumpOff)	
		{
			if (players[i].up && players[i].canJumpOff[j].touching)
			{
				box2d.jumpBody(players[i].actor.body,-playerImpulseY);
				players[i].canJumpOff[j].touching=false;
			}
		}
	}

	if (slowMoPress && slowMoCount>=slowMoTime)
	{
		slowMoCount=0;
		box2d.slowMo(true);
		slowMoInterval=setInterval(slowMotioner,100);
	}
}

function slowMotioner()
{
	slowMoCount+=.1
	if(slowMoCount>=slowMoTime)
	{
		resetSlowMotioner();
		box2d.slowMo(false);
		return;
	}
	slowMoBar.color="#bda3a4";
	slowMoBar.initialX+=((slowMoBar.width-(140*(slowMoTime-slowMoCount)/slowMoTime))/2);
	slowMoBar.width=140*(slowMoTime-slowMoCount)/slowMoTime;
	easel.updateShapeWidth(slowMoBar);
}

function resetSlowMotioner()
{
	clearTimeout(slowMoInterval);
	slowMoCount=slowMoTime;
	slowMoBar.color="#bd83a4";
	slowMoBar.initialX=courtBounds.width/2-70;
	slowMoBar.width=140;
	easel.updateShapeWidth(slowMoBar);
}

function redScores()
{
		gameText.text="RED SCORES";
		gameText.visible=true;
		
		gameScore++;
		updateScoreBar();
		
		if (gameScore>=5)
		{
			gameText.text="RED WINS";
			gameText.visible=true;
			gameFunction=doNothing;
			
			setTimeout(function(){anyKey=false; gameFunction=gameOver; gameText.text="PRESS ANY KEY TO PLAY AGAIN";},3000);
			return;
		}
		
		gameFunction=doNothing;
		setTimeout(function(){resetGame(); gameFunction=gameStep; box2d.setPosition(balls[0].actor.body,players[1].initialX,balls[0].initialY);},1500);
}

function blueScores()
{
	gameText.text="BLUE SCORES";
		gameText.visible=true;
		
		gameScore--;
		updateScoreBar();
		
		if (gameScore<=-5)
		{
			gameText.text="BLUE WINS";
			gameText.visible=true;
			gameFunction=doNothing;
			setTimeout(function(){ anyKey=false; gameFunction=gameOver; gameText.text="PRESS ANY KEY TO PLAY AGAIN";},3000);	
			return;	
		}
			
			
		gameFunction=doNothing;
		setTimeout(function(){resetGame(); gameFunction=gameStep; box2d.setPosition(balls[0].actor.body,players[0].initialX,balls[0].initialY);},1500);
}

function updateScoreBar()
{	
	if (gameScore>0)
	{
		scoreBar.color="#863c3c";
		scoreBar.initialX=courtBounds.width/2-5;
		scoreBar.width=(-gameScore*(courtBounds.width/10));
		easel.updateShapeWidth(scoreBar);
	}
	else
	{
		scoreBar.color="#28596f";
		scoreBar.initialX=courtBounds.width/2+5 ;
		scoreBar.width=(-gameScore*(courtBounds.width/10));
		easel.updateShapeWidth(scoreBar);
	}
}

function gameOver()
{
	if (anyKey)
	{
		location.reload(true);
		gameFunction=doNothing;
	}
}

function doNothing()
{}
//////////////////////////////
//I/O/////////////////////////
function keyDownHandler(e)
{
		anyKey=true;
		
		if(keyPress[e.keyCode])
			keyPress[e.keyCode](true);
}

function keyUpHandler(e)
{
		if(keyPress[e.keyCode])
			keyPress[e.keyCode](false);
}

function blurHandler()
{ 
	box2d.setPaused(true);
	Ticker.setPaused(true); 
}

function focusHandler()
{ 
	box2d.setPaused(false); 
	Ticker.setPaused(false);
}

