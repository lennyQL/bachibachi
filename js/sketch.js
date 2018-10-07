var NUM = 10,
    SNUM = 20,
    DISTANCE = 200;
    //DISTANCE = -1;
var energy = new Array(NUM);

var bachibachiOn = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    for(var i = 0; i < energy.length; i++) {
        energy[i] = new Energy();

        var x = random(0, width),
            y = random(0, height);
        energy[i].location.set(x, y);

        var vx = random(-1, 1),
            vy = random(-1, 1),
            speed = 10;//random(1, 3);
        energy[i].velocity.set(vx*speed, vy*speed);
    }

    noCursor();
}

function draw() {
    // background(255);
    frameRate(60);
    // fill(0, 31);
    fill(0);
    noStroke();
    rect(0, 0, width, height);
    noStroke();
    fill(255);


    for(i = 0; i < energy.length-1; i++) {
        for(j = i+1; j < energy.length; j++) {
            var d = dist(energy[i].location.x, energy[i].location.y, energy[j].location.x, energy[j].location.y);
            if(d < DISTANCE) {
                //stroke(color(200, 200, 50), 200);
                //strokeWeight(1);
                //line(energy[i].location.x, energy[i].location.y, energy[j].location.x, energy[j].location.y);

                /*
                var scribble = new Scribble(); 
                for(n = 0; n < 5; n++) {
                    strokeWeight(10);
                    stroke(color(200, 200, 50), 200);
                    scribble.scribbleLine(energy[i].location.x, energy[i].location.y, energy[j].location.x, energy[j].location.y);
                    // line(energy[i].location.x, energy[i].location.y, energy[j].location.x, energy[j].location.y);
                    strokeWeight(10);
                    // stroke(color(50, 200, 200), 200);
                    stroke(color(150, 180, 255), 200);
                    scribble.scribbleLine(energy[i].location.x, energy[i].location.y, energy[j].location.x, energy[j].location.y);
                    // line(energy[i].location.x, energy[i].location.y, energy[j].location.x, energy[j].location.y);
                } 
                /*/
                for(n = 0; n < 3; n++)
                lightning(energy[i].location, energy[j].location);
                //*/

                var v = 10;
                var rad = -Math.atan2(energy[j].location.y-energy[i].location.y, energy[j].location.x-energy[i].location.x);
                energy[i].velocity.set(-cos(rad)*v, sin(rad)*v);
                energy[j].velocity.set(cos(rad)*v, -sin(rad)*v);


                energy[i].sparking();
                energy[j].sparking();
                
            }

            

        }
    }

    for(i = 0; i < energy.length; i++) {
        energy[i].update();

        energy[i].bounceOffWalls();

        energy[i].draw();

        //console.log(i, energy[i].isSparking);
    }



    /*
    if(DISTANCE < 0) {
        DIS_COUNT = 0.5;
    }
    else if(DISTANCE > 300) {
        DIS_COUNT = -0.5;
    }
    DISTANCE += DIS_COUNT;

    console.log(DISTANCE);
    */
   DISTANCE = random(50, 250);

   console.log(DISTANCE);

}


var lightning = function(p, q) {

    // PVector p = new PVector(width/2, 0),
    //         q = new PVector(width/2, height);

    
    var a = atan2(q.y-p.y, q.x-p.x);

    //x : cos(a - PI/2) = sin(a)
    //y : sin(a - PI/2) = -cos(a)

    //line(p.x, p.y, q.x, q.y);

    var N = 15;
    var s = 10;
    var l = p.dist(q);

    strokeWeight(3);
    stroke(81,91,250);

    var x = p.x, 
        y = p.y;

    for(var i = 0; i <= N; i++) {
        tx = p.x + (l/N *i)*cos(a) + (random(-1, 1)*s*sin(a));
        ty = p.y + (l/N *i)*sin(a) + (random(-1, 1)*s*(-cos(a)));
        
        
        //strokeWeight(i/(NUM/10));
        line(x, y, tx, ty);
        //ellipse(x, y, 5, 5);
        
        x = tx;
        y = ty;
    }
};



/** class */
var Particle = function() {
    this.location = createVector(0.0, 0.0);
    this.velocity = createVector(0.0, 0.0);
    this.acceleration = createVector(0.0, 0.0);
    this.gravity = createVector(0.0, 0.0);

    this.min = createVector(0.0, 0.0);
    this.max = createVector(width, height);
};

Particle.prototype.bounceOffWalls = function(v=1) {
    if(this.location.x > this.max.x) {
        this.location.x = this.max.x;
        this.velocity.x *= -v;
    }
    else if(this.location.x < this.min.x) {
        this.location.x = this.min.x;
        this.velocity.x *= -v;
    }
    if(this.location.y > this.max.y) {
        this.location.y = this.max.y;
        this.velocity.y *= -v;
    }
    else if(this.location.y < this.min.y) {
        this.location.y = this.min.y;
        this.velocity.y *= -v;
    }
};

Particle.prototype.update = function() {
    this.acceleration.add(this.gravity);
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
};


// extend class Energy
var Energy = function() {
    this.uber = Particle.prototype;
    Particle.call(this);

    this.radius = 1;//50;
    this.sparks = new Array(SNUM);
    this.isSparking = false;
};

Energy.prototype = Object.create(Particle.prototype);
Energy.prototype.constructor = Energy;

Energy.prototype.sparking = function() {
    this.isSparking = true;
    for(var i = 0; i < this.sparks.length; i++) {
        this.sparks[i] = new Spark();
        //f[i].location.set(mouseX, mouseY);
        this.sparks[i].location.set(this.location.x, this.location.y);
        var angle = random(PI * 2.0);
        var length = random(0.2);
        var posX = cos(angle) * length;
        var posY = sin(angle) * length;
        // this.sparks[i].velocity.set(posX, posY);
        this.sparks[i].velocity.set(0.0, 0.0);
        this.sparks[i].acceleration.set(posX, posY);
    }
};

Energy.prototype.draw = function() {
   //noStroke();
   stroke(color(10, 10, 10));
   strokeWeight(5);
   fill(color(255,255,255));
   ellipse(this.location.x, this.location.y, this.radius, this.radius);
//    var scribble = new Scribble(); 
//    scribble.scribbleEllipse(this.location.x, this.location.y, this.radius, this.radius); 

   if(this.isSparking)
   for(var i = 0; i < this.sparks.length; i++) {
       this.sparks[i].update();
       this.sparks[i].bounceOffWalls(0.5);
       this.sparks[i].draw();
   }
};


// extend class Spark
var Spark = function() {
    this.uber = Particle.prototype;
    Particle.call(this);

    this.radius = 2;
    this.gravity.set(0, 0.01);
};

Spark.prototype = Object.create(Particle.prototype);
Spark.prototype.constructor = Spark;

Spark.prototype.draw = function() {
   noStroke();
   //stroke(color(10, 10, 10));
   //strokeWeight(5);
//    fill(color(255,255,255));
//    fill(color(255,200,180));
   fill(color(200,200,255));
   ellipse(this.location.x, this.location.y, this.radius, this.radius);
   //var scribble = new Scribble(); 
   //scribble.scribbleEllipse(this.location.x, this.location.y, this.radius, this.radius); 
};