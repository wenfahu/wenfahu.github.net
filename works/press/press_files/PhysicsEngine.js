function Box2d(SCALE)
{
	this.scale=SCALE;
	var STEP = 22, TIMESTEP = 1/STEP;
	var world; //Box2dWorld
	var lastTimestamp = Date.now();
	var fixedTimestepAccumulator = 0;
	
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	var b2Listener=Box2D.Dynamics.b2ContactListener;
	
	var maxVelocityX=8;
	var maxVelocityY=8;
	var collisionBetween=[];
	var touchingBetween=[];
	var listener = new b2Listener;
	
	this.setup=function()
	{
		world = new b2World(new b2Vec2(0,4), true);
		this.setPaused(true);
		
		this.addDebug();
		world.SetContactListener(listener);
	}
	

	this.listenForCollision = function(bodyA, bodyB, doFunction)
	{
		var temp=new Object();
		temp.bodyA=bodyA;
		temp.bodyB=bodyB;
		temp.doFunction=doFunction;
		collisionBetween.push(temp);		
	}

	this.listenTouching = function(bodyA, bodyB, doFunction)
	{
		var temp=new Object();
		temp.bodyA=bodyA;
		temp.bodyB=bodyB;
		temp.doFunction=doFunction;
		touchingBetween.push(temp);
	}
	
	listener.BeginContact = function(contact) 
	{
		for (var i in collisionBetween)
		{
			if ((contact.GetFixtureA().GetBody()==collisionBetween[i].bodyA && contact.GetFixtureB().GetBody()==collisionBetween[i].bodyB)
					||(contact.GetFixtureB().GetBody()==collisionBetween[i].bodyA && contact.GetFixtureA().GetBody()==collisionBetween[i].bodyB))
				collisionBetween[i].doFunction();
		}
		
		for (var i in touchingBetween)
		{
			if ((contact.GetFixtureA().GetBody()==touchingBetween[i].bodyA && contact.GetFixtureB().GetBody()==touchingBetween[i].bodyB)
					||(contact.GetFixtureB().GetBody()==touchingBetween[i].bodyA && contact.GetFixtureA().GetBody()==touchingBetween[i].bodyB))
				touchingBetween[i].doFunction(true);
		}
	}
	
	listener.EndContact = function(contact) 
	{
		for (var i in touchingBetween)
		{
			if ((contact.GetFixtureA().GetBody()==touchingBetween[i].bodyA && contact.GetFixtureB().GetBody()==touchingBetween[i].bodyB)
					||(contact.GetFixtureB().GetBody()==touchingBetween[i].bodyA && contact.GetFixtureA().GetBody()==touchingBetween[i].bodyB))
				touchingBetween[i].doFunction(false);
		}
	}
	
	this.createCircleBody = function(x,y,r,groupIndex,restitution)
	{
		var circleFixture = new b2FixtureDef;
		circleFixture.density = 1;
		circleFixture.restitution = restitution;
		circleFixture.friction = 0;
		circleFixture.shape = new b2CircleShape(r / SCALE);
		circleFixture.filter.groupIndex = groupIndex;
		var circleBodyDef = new b2BodyDef;
		circleBodyDef.type = b2Body.b2_dynamicBody;
		circleBodyDef.position.x = x / SCALE;  // divide skin x and y by box2d scale to get right position
		circleBodyDef.position.y = y / SCALE;
		circleBodyDef.fixedRotation = true;
		circleBodyDef.bullet = true;
		var circleBody = world.CreateBody(circleBodyDef);
		circleBody.CreateFixture(circleFixture);
		return circleBody;
	}
	
	this.createRectangleBody = function(x,y,width,height,groupIndex,restitution)
	{
		var rectFixture = new b2FixtureDef;
		rectFixture.shape = new b2PolygonShape;
		rectFixture.shape.SetAsBox(width/2 / SCALE, height/2 / SCALE);
		rectFixture.density = 1;
		rectFixture.restitution = restitution;
		rectFixture.friction = 0;
		rectFixture.filter.groupIndex = groupIndex;
		var rectBodyDef = new b2BodyDef;
		rectBodyDef.type = b2Body.b2_staticBody;
		rectBodyDef.position.x = (x+(width/2)) / SCALE;
		rectBodyDef.position.y = (y+(height/2)) / SCALE;
		var rectBody = world.CreateBody(rectBodyDef);
		rectBody.CreateFixture(rectFixture);
		return rectBody;
	}

	this.createRectangleSensorBody = function(x,y,width,height)
	{
		var rectFixture = new b2FixtureDef;
		rectFixture.isSensor=true;
		rectFixture.shape = new b2PolygonShape;
		rectFixture.shape.SetAsBox(width/2 / SCALE, height/2 / SCALE);
		var rectBodyDef = new b2BodyDef;
		rectBodyDef.type = b2Body.b2_staticBody;
		rectBodyDef.position.x = (x+(width/2)) / SCALE;
		rectBodyDef.position.y = (y+(height/2)) / SCALE;
		var rectBody = world.CreateBody(rectBodyDef);
		rectBody.CreateFixture(rectFixture);
		return rectBody;
	}
		
	this.setPosition=function(body, x, y)
	{
		body.SetPosition(new b2Vec2(x/SCALE,y/SCALE));
	}
	
	this.getVelocity=function(body)
	{
		var vel=new Object();
		vel.x=body.GetLinearVelocity().x;
		vel.y=body.GetLinearVelocity().x;
		return vel;
	}
	
	this.getPosition=function(body)
	{
		var pos=new Object();
		pos.x=body.GetWorldCenter().x*SCALE;
		pos.y=body.GetWorldCenter().y*SCALE;
		return pos;
	}
	
	this.impulseBodyX=function(body, impulse)
	{
		//body.ApplyImpulse(new b2Vec2(impulse, 0), body.GetWorldCenter());
		body.SetAwake(true);
		body.SetLinearVelocity(new b2Vec2(impulse, body.GetLinearVelocity().y));
	}
	
	this.jumpBody=function(body, impulse)
	{
		//body.ApplyImpulse(new b2Vec2(0, impulse), body.GetWorldCenter());
		body.SetAwake(true);
		body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x,impulse));
	}
	
	this.stopBodyX=function(body)
	{
		body.SetLinearVelocity(new b2Vec2(0, body.GetLinearVelocity().y));
		body.SetAngularVelocity(0);
	}
	
	this.stopBodyY=function(body)
	{
		body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x,0));
		body.SetAngularVelocity(0);
	}
		
	this.stopBody=function(body)
	{
		body.SetLinearVelocity(new b2Vec2(0, 0));
		body.SetAngularVelocity(0);
	}
	
	this.speedLimit=function(body)
	{
		if (body.GetLinearVelocity().x > maxVelocityX)
			body.SetLinearVelocity(new b2Vec2(maxVelocityX, body.GetLinearVelocity().y));
		else if (body.GetLinearVelocity().x < -maxVelocityX)
			body.SetLinearVelocity(new b2Vec2(-maxVelocityX, body.GetLinearVelocity().y));
			
		if (body.GetLinearVelocity().y > maxVelocityY)
			body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x, maxVelocityY));
		else if (body.GetLinearVelocity().y < -maxVelocityY)
			body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x, -maxVelocityY ));

	}
	
	this.predictTrajectoryPoint = function(body, n)
	{
			//velocity and gravity are given per second but we want time step values here
      var stepVelocity= new b2Vec2(TIMESTEP* body.GetLinearVelocity().x,TIMESTEP* body.GetLinearVelocity().y); // m/s
      var stepGravity = new b2Vec2(TIMESTEP* TIMESTEP* world.GetGravity().x,TIMESTEP* TIMESTEP* world.GetGravity().y); // m/s/s
  		//console.log(stepGravity);
      var point= new b2Vec2(body.GetPosition().x + n * stepVelocity.x + 0.5 * (n*n+n) * stepGravity.x,body.GetPosition().y + n * stepVelocity.y + 0.5 * (n*n+n) * stepGravity.y);
      
      var result=Object();
      
      result.x=point.x*SCALE;
      result.y=point.y*SCALE;
      
      return result;
	}
	
	this.update = function() 
	{
		var now = Date.now();
		var dt = now - lastTimestamp;
		fixedTimestepAccumulator += dt;
		lastTimestamp = now;
		while(fixedTimestepAccumulator >= STEP) 
		{
			world.Step(TIMESTEP, 10, 10);
			fixedTimestepAccumulator -= STEP;
			world.ClearForces();
		}
	}
	
	this.slowMo= function(s)
	{
		if (s)
			TIMESTEP=1/50;
		else
			TIMESTEP=1/STEP;
	}
	
	this.setPaused = function(p) 
	{
			if(p)
			{ 
				TIMESTEP = 0;
			} 
			else 
			{ 
				TIMESTEP = 1/STEP;
			}
			
			lastTimestamp = Date.now();
		}
		
	this.drawDebug = function()
	{
		world.m_debugDraw.m_sprite.graphics.clear();
		world.DrawDebugData();
	}
	
	//box2d debugger
	this.addDebug = function() 
	{
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById("GameFrame").getContext("2d"));
		debugDraw.SetDrawScale(SCALE);
		debugDraw.SetFillAlpha(.7);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
	}
	
}