function DrawEngine(canvas)
{
	this.stage= new Stage(canvas);
	
	this.createCircleSkin= function(x,y,r,color)
	{
		var g = new Graphics();
		g.setStrokeStyle(1);
		g.beginFill(color);
		g.drawCircle(0,0,r);
		var circleSkin = new Shape(g);
		circleSkin.x = x;
		circleSkin.y = y;
		circleSkin.alpha=.7;
		//circleSkin.compositeOperation="lighter";
		this.stage.addChildAt(circleSkin,0);
		
		return circleSkin;
	}
	
	this.createRectangleSkin= function(x,y,width,height,color)
	{
		var g = new Graphics();
		g.setStrokeStyle(1);
		g.beginFill(color);
		g.drawRect(0,0, width, height);
		var rectangleSkin = new Shape(g);
		rectangleSkin.x = x;
		rectangleSkin.y = y;
		//rectangleSkin.alpha=.3;
		this.stage.addChild(rectangleSkin);
		
		return rectangleSkin;
	}
	
	this.createImg = function(src,x,y)
	{
		var bitmap = new Bitmap(src);	
		bitmap.x = x-bitmap.image.width/2;
	    bitmap.y = y-bitmap.image.height*2;
	    this.stage.addChild(bitmap);
			
	    return bitmap;
	}
	
	this.createText = function(text,x,y, color)
	{
		var label = new Text(text.toString(), "24px Futura", color);
		label.textAlign = "center";
		label.x = x;
		label.y = y;
		this.stage.addChild(label);
		
		return label;
	}
	
	this.updateShapeWidth=function(shape)
	{
		var g = new Graphics();
		g.setStrokeStyle(1);
		g.beginFill(shape.color);
		g.drawRect(0,0, shape.width, shape.height);
		var rectangleSkin = new Shape(g);
		rectangleSkin.x = shape.initialX;
		rectangleSkin.y = shape.initialY;
		//rectangleSkin.alpha=.3;
		this.stage.addChild(rectangleSkin);
		this.stage.removeChild(shape.actor.skin);	
		shape.actor.skin= rectangleSkin;
	}
}



