var bots=[];
//var predictionGhost;
//var bestPlacementGhost;

var level=0;
var bestPlacement=new Object();
var playerImpulseY=5;

function initGameWorld()
{	
	//Walls, Floors and nets
	subFloor=new Boundary(0, courtBounds.height+35, courtBounds.width, 60, "#d8d8d8", 1);
	floor=new Boundary(0, courtBounds.height, courtBounds.width, 6, "#d8d8d8", -1);
	roof=new Boundary(0, -courtBounds.height, courtBounds.width, 6, "#d8d8d8", 1);
	leftWall=new Boundary(-6, -courtBounds.height, 6, 2*courtBounds.height, "#d8d8d8",1);
	leftCrossBar=new Boundary(0, courtBounds.height-140, 50,3 , "#d8d8d8",1);
	rightCrossBar=new Boundary(courtBounds.width-50, courtBounds.height-140, 50,3 , "#d8d8d8",1);
	rightWall=new Boundary(courtBounds.width, -courtBounds.height, 6, 2*courtBounds.height, "#d8d8d8",1);
	
	
	//Balls haha
	balls[0]=new Ball(courtBounds.width/2, courtBounds.height-60,10,"#b3b3b3");
	gameObjects.push(balls[0]);
	var ballWallHandler= function() //Avoid balls sticking to walls
	{
		if(box2d.getVelocity(balls[0].actor.body).x<1 && box2d.getVelocity(balls[0].actor.body).x>=0)
			box2d.impulseBodyX(balls[0].actor.body, 5);
		else if(box2d.getVelocity(balls[0].actor.body).x>-1 && box2d.getVelocity(balls[0].actor.body).x<=0)
			box2d.impulseBodyX(balls[0].actor.body, -5);
	}
	box2d.listenForCollision(balls[0].actor.body,leftWall.actor.body, ballWallHandler);
	box2d.listenForCollision(balls[0].actor.body,rightWall.actor.body, ballWallHandler);


	//Point Sensors stuff
	redPointSensor=new BoundarySensor(courtBounds.width-50+3, courtBounds.height-140+3, 50, 140-3);
	box2d.listenForCollision(balls[0].actor.body,redPointSensor.actor.body, function(){gameFunction=redScores;});
	
	blueNet=new BarDrawing(courtBounds.width-50, courtBounds.height-140+3, 50+3, 140-3, "#b3b3b3");
	blueNet.actor.skin.alpha=.1;
	
	bluePointSensor=new BoundarySensor(0, courtBounds.height-140+3, 50-3, 140-3);
	box2d.listenForCollision(balls[0].actor.body,bluePointSensor.actor.body, function(){gameFunction=blueScores;});
	
	redNet=new BarDrawing(0, courtBounds.height-140+3, 50, 140-3, "#b3b3b3");
	redNet.actor.skin.alpha=.1;

	//Player + AI
	var Jumpables=new Array(subFloor,leftWall,rightWall,leftCrossBar,rightCrossBar);
	
	players[0]=new Player(courtBounds.width/4, courtBounds.height,35,"#bd5757",null,null,null,null, Jumpables);
	players[0].bot=new dumBot(players[0]);
	gameObjects.push(players[0]);
	bots.push(players[0].bot);
	
	players[1]=new Player(3*courtBounds.width/4, courtBounds.height,35,"#3c83a4",37,39,38,40, Jumpables);
	gameObjects.push(players[1]);
	
	gameText.text="PRESS ANY KEY TO BATTLE DUMBOT";
	
	/*
	var ball=new Ball(null, null,10,"#0af")
	predictionGhost= easel.createCircleSkin(ball);
	
	ball=new Ball(null, null,35,"#fa0")
	bestPlacementGhost= easel.createCircleSkin(ball);
*/
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
	var ballBody= box2d.createCircleBody(this.initialX, this.initialY, this.r,1,.7);
	this.actor=new ActorObject(ballBody,ballSkin);
}

function aiThink()
{
	for(var i in bots)
		bots[i].think();	
}

function redScores()
{
		gameText.text=bots[0].name+" SCORED!";
		gameText.visible=true;
		
		gameScore++;
		updateScoreBar();
		
		if (gameScore>=5)
		{
			gameText.text=bots[0].name+" :( GAME OVER";
			gameText.visible=true;
			gameFunction=doNothing;
			setTimeout(function(){anyKey=false; gameFunction=gameOver; gameText.text="PRESS ANY KEY TO TRY AGAIN";},3000);
			return;
		}
		
		gameFunction=doNothing;
		setTimeout(function(){resetGame(); gameFunction=gameStep; box2d.setPosition(balls[0].actor.body,players[1].initialX,balls[0].initialY);},1500);
}

function blueScores()
{
	gameText.text="YOU SCORED";
		gameText.visible=true;
		
		gameScore--;
		updateScoreBar();
		
		if (gameScore<=-5)
		{
			if (level==0)
			{
				gameText.text="YOU BEAT DUMBOT, WAY TO GO...";
				gameText.visible=true;
				gameFunction=doNothing;
				players[0].bot=new crackBot(players[0]);
				bots[0]=players[0].bot;
				level++;
				gameScore=0;
				updateScoreBar();
				setTimeout(function(){ anyKey=false; resetGame(); gameFunction=waitForKey;  gameText.text="PRESS ANY KEY TO BATTLE CRACKBOT"; gameText.visible=true;},3000);	
				return;	
			}
			else if (level==1)
			{
				gameText.text="YOU BEAT CRACKBOT, NOT BAD?";
				gameText.visible=true;
				gameFunction=doNothing;
				players[0].bot=new ballsyBot(players[0]);
				bots[0]=players[0].bot;
				level++;
				gameScore=0;
				updateScoreBar();
				setTimeout(function(){ anyKey=false; resetGame(); gameFunction=waitForKey; gameText.text="PRESS ANY KEY TO BATTLE THE FEARLESS BALLSYBOT"; gameText.visible=true;},3000);	
				return;	
			}
			else if (level==2)
			{
				gameText.text="YOU DEFEATED BALLSYBOT. FORMIDABLE!";
				gameText.visible=true;
				gameFunction=doNothing;
				players[0].bot=new shmorgBot(players[0]);
				bots[0]=players[0].bot;
				level++;
				gameScore=0;
				updateScoreBar();
				setTimeout(function(){ anyKey=false; resetGame(); gameFunction=waitForKey; gameText.text="PRESS ANY KEY TO BATTLE THE MIGHTY SHMORG!"; gameText.visible=true;},3000);	
				return;	
			}
			else if (level==3)
			{
				gameText.text="I GUESS SHMORG WAS NOT SO MIGHTY AFTER ALL...";
				gameText.visible=true;
				gameFunction=doNothing;
				players[0].bot=new beelzeBot(players[0]);
				bots[0]=players[0].bot;
				level++;
				gameScore=0;
				updateScoreBar();
				setTimeout(function(){ anyKey=false; resetGame(); gameFunction=waitForKey; gameText.text="PRESS ANY KEY TO BATTLE BEELZEBOT"; gameText.visible=true;},3000);	
				return;	
			}
			else if (level==4)
			{
				gameText.text="YOU WIN?";
				gameText.visible=true;
				gameFunction=doNothing;
				players[0].bot=new beelzeBot(players[0]);
				bots[0]=players[0].bot;
	
				level++;
				gameScore=0;
				updateScoreBar();
				setTimeout(function(){ anyKey=false; resetGame(); gameFunction=waitForKey; gameText.text="FALSE! PRESS ANY KEY TO BATTLE BEELZEBOT & SHMORG!!!"; gameText.visible=true; players[2]=new Player(courtBounds.width/4-100, courtBounds.height,35,"#906040",null,null,null,null,new Array(subFloor,leftWall,rightWall,leftCrossBar,rightCrossBar));
					players[2].bot=new shmorgBot(players[2]);
					gameObjects.push(players[2]);
					bots.push(players[2].bot);
					bots[0].name=	"BEELZEBOT & SHMORG";},3000);
				
				return;	
			}
			else if (level==5)
			{
				$.post("winner.php");
				gameText.text="I CAN'T BELIEVE ANYONE ACTUALLY BEAT THIS...";
				gameText.visible=true;
				gameFunction=doNothing;
				level++;
				gameScore=0;
				updateScoreBar();
				
				setTimeout(function(){ anyKey=false; gameFunction=gameOver; gameText.text="YOU ARE A TRUE GOOBBALLER! PRESS ANY KEY TO DO IT AGAIN?";},3000);	
				return;	
			}
		}
			
		gameFunction=doNothing;
		setTimeout(function(){resetGame(); gameFunction=gameStep; box2d.setPosition(balls[0].actor.body,players[0].initialX,balls[0].initialY);},1500);
}

///////////////////
//Bots/////////////
function dumBot(player)
{	
	this.player=player;
	this.name= "DUMBOT";
	
	this.think = function()
	{
		if(Math.random()>.7)
		{
			this.player.left=false;
			this.player.right=false;
			return;
		}
		
		if (box2d.getPosition(balls[0].actor.body).x>box2d.getPosition(this.player.actor.body).x+10)
		{
			this.player.left=false;
			this.player.right=true;
		}
		else if (box2d.getPosition(balls[0].actor.body).x<box2d.getPosition(this.player.actor.body).x-10)
		{
			this.player.left=true;
			this.player.right=false;
		}	
		else if (box2d.getPosition(balls[0].actor.body).x==box2d.getPosition(this.player.actor.body).x)
			{
			this.player.left=true;
			this.player.right=false;
		}	
		else
		{
			this.player.left=false;
			this.player.right=false;
		}
	}
}

function crackBot(player)
{	
	this.player=player;
	this.name= "CRACKBOT";
	this.think = function()
	{
		if(Math.random()>.8)
		{
			this.player.left=false;
			this.player.right=false;
			return;
		}
		
		if (box2d.getPosition(balls[0].actor.body).x<box2d.getPosition(this.player.actor.body).x+this.player.r/2 || Math.random()>.8)
		{
			this.player.left=true;
			this.player.right=false;
		}
		else
		{
			this.player.left=false;
			this.player.right=true;
		}	
	}
}

function ballsyBot(player)
{	
	this.player=player;
	this.name= "BALLSYBOT";
	this.think = function()
	{
		if(Math.random()>.8)
		{
			return;
		}
		
		if (box2d.getPosition(balls[0].actor.body).x>box2d.getPosition(this.player.actor.body).x+10 && box2d.getPosition(this.player.actor.body).x<courtBounds.width/2)
		{
			this.player.left=false;
			this.player.right=true;
		}
		else if (box2d.getPosition(balls[0].actor.body).x<box2d.getPosition(this.player.actor.body).x-10)
		{
			this.player.left=true;
			this.player.right=false;
		}	
		else if (box2d.getPosition(balls[0].actor.body).x==box2d.getPosition(this.player.actor.body).x)
		{
			this.player.left=true;
			this.player.right=false;
		}	
		else
		{
			this.player.left=false;
			this.player.right=false;
		}
		
		if (box2d.getPosition(balls[0].actor.body).y<box2d.getPosition(this.player.actor.body).y)
			this.player.up=true;
		else
			this.player.up=false;
	}
}

//SHMORG
function shmorgBot(player)
{	
	this.player=player;
	this.name= "SHMORG";
	this.think = function()
	{
		if (box2d.getPosition(balls[0].actor.body).x<courtBounds.width/2)
		{
			if (box2d.getPosition(balls[0].actor.body).x>box2d.getPosition(this.player.actor.body).x+10)
			{
				this.player.left=false;
				this.player.right=true;
			}
			else 
			{
				this.player.left=true;
				this.player.right=false;
			}	
		
			
			if (box2d.getPosition(balls[0].actor.body).y<box2d.getPosition(this.player.actor.body).y)
				this.player.up=true;
			else
				this.player.up=false;
		}
		else
		{
			this.player.up=false;
			
			if (box2d.getPosition(this.player.actor.body).x+10<2*courtBounds.width/5)
			{
				this.player.left=false;
				this.player.right=true;
			}
			else if (box2d.getPosition(this.player.actor.body).x-10>2*courtBounds.width/5)
			{
				this.player.left=true;
				this.player.right=false;
			}	
			else
			{
				this.player.left=false;
				this.player.right=false;
			}
		}
	}
}

//BeelzeBot////////////
function beelzeBot(player)
{	
	this.player=player;
	this.name= "BEELZEBOT";
	this.think = function()
	{
		if (box2d.getPosition(balls[0].actor.body).x<courtBounds.width/2)
		{	
			var ballPrediction=box2d.predictTrajectoryPoint(balls[0].actor.body,(courtBounds.height-box2d.getPosition(balls[0].actor.body).y-this.player.r)/10 ); //50 steps into the future spppooookkky		
			if(ballPrediction.x<0)
				ballPrediction.x=-ballPrediction.x;
			else if (ballPrediction.x>courtBounds.width)
				ballPrediction.x=  courtBounds.width-(ballPrediction.x-courtBounds.width);
			predictionGhost=	ballPrediction;
			
			var bestPlacement=new Object();
			bestPlacement.x=(ballPrediction.x+box2d.getPosition(balls[0].actor.body).x)/2;
			bestPlacement.y=(ballPrediction.y+box2d.getPosition(balls[0].actor.body).y)/2;
			bestPlacementGhost=bestPlacement;
			
			if (ballPrediction.y<box2d.getPosition(balls[0].actor.body).y)
			{
				bestPlacement.y=box2d.getPosition(balls[0].actor.body).y-(ballPrediction.y-box2d.getPosition(balls[0].actor.body).y);
			}
		
			if(bestPlacement.x>box2d.getPosition(this.player.actor.body).x)
			{
				this.player.left=false;
				this.player.right=true;
			}
			else
			{
				this.player.left=true;
				this.player.right=false;
			}
			
			if(bestPlacement.y>box2d.getPosition(this.player.actor.body).y-200 && bestPlacement.y < box2d.getPosition(this.player.actor.body).y-150)
				this.player.up=true;
			else
				this.player.up=false;
		}
		
		//////////////////////
		//Offense//////////////
		else
		{
			if(Math.random()>.4)
			{
				return;
			}	
		
			var ballPrediction=box2d.predictTrajectoryPoint(balls[0].actor.body,(courtBounds.height-box2d.getPosition(balls[0].actor.body).y-this.player.r)/10 ); //50 steps into the future spppooookkky	
			if(ballPrediction.x<0)
				ballPrediction.x=-ballPrediction.x;
			else if (ballPrediction.x>courtBounds.width)
				ballPrediction.x=  courtBounds.width-(ballPrediction.x-courtBounds.width);
			//predictionGhost.x=	ballPrediction.x;
			//predictionGhost.y=	ballPrediction.y;
			
			var bestPlacement=new Object();
			bestPlacement.x=(ballPrediction.x+box2d.getPosition(balls[0].actor.body).x)/2;
			bestPlacement.y=(ballPrediction.y+box2d.getPosition(balls[0].actor.body).y)/2;
			//bestPlacementGhost.x=bestPlacement.x;
			//bestPlacementGhost.y=bestPlacement.y;
				
			if (ballPrediction.y>box2d.getPosition(balls[0].actor.body).y)
			{
				bestPlacement.y=box2d.getPosition(balls[0].actor.body).y-(ballPrediction.y-box2d.getPosition(balls[0].actor.body).y);
			}
		
			if(bestPlacement.x>box2d.getPosition(this.player.actor.body).x+this.player.r)
			{
				this.player.left=false;
				this.player.right=true;
			}
			else 
			{
				this.player.left=true;
				this.player.right=false;
			}
			
			if(box2d.getPosition(balls[0].actor.body).y<box2d.getPosition(this.player.actor.body).y)
				this.player.up=true;
			else
				this.player.up=false;
		}
	}
}