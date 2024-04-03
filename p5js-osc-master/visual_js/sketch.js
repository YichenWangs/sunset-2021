/*
  based on: https://observablehq.com/@rreusser/instanced-webgl-circles
*/
//variables to set up the work
var MAX_CIRCLE_CNT = 2500, MIN_CIRCLE_CNT = 0,
	MAX_VERTEX_CNT = 300, MIN_VERTEX_CNT = 0;
var circleCnt, vertexCnt, x, y;
var temp;
var state = "start";
var circleSize;
var thetaV;
var thetaC;
var scale;
var txt = "";
var particles = [];
var cls = [];
var noiseScale = 500;
var count = 0;
var scalew;
var scaleh;
var c;
var flag;
var p = [];
var fadeOut = false;
var fadec = 0;
var who;
/**
 * Load image
 */
function preload(){
	img = loadImage('cloud.png');
}

/**
 * Set up variables
*/
var imgs = [];
var imgs1 = [];
var imgs2 = [];
var colorsli;
// var cls = [];
function setup() {
	colorsli = [color(0, 116, 200,30),
		color(255, 141, 115,30),
		color(0, 116, 200,30)];
	// canvas
	createCanvas(windowWidth, windowHeight);
	translate(windowWidth / 2, windowHeight / 2);
	// osc
	setupOsc(12000, 3334);

	flag =1;
	// variables	
	temp = 20;
	// state = "disolve"
	// vertexCnt = 2;
	// circleCnt = 700;
	// circleSize = 100;
	// scale = 200;
	scalew = windowWidth/4032;
	scaleh = windowHeight/2403;
	flag = 0;
	// visualisation for the state image
	for (let index = 0; index < 1500; index++) {
		p.push(new Particle(-(windowWidth*scalew)/2+random(windowWidth*scalew),-(windowHeight*scaleh)/2+random(windowHeight*scaleh),10));
		newp.push(new Particle(-(windowWidth*scalew)/2+random(windowWidth*scalew),-(windowHeight*scaleh)/2+random(windowHeight*scaleh),10));
	}

	// below are visualisations for the state pixeling, essentially it tries to get the location of each pixels with different sizes
	for(let col =0; col<windowWidth*scalew;col +=20){
		imgs[col] = []; // create nested array
		for(let row =0; row<windowHeight*scaleh;row +=20){
			imgs[col][row]= new Particle(col-(windowWidth*scalew)/2,row-(windowHeight*scaleh)/2,20);

		}

	}
	for(let col =0; col<windowWidth*scalew;col +=15){
		imgs1[col] = []; // create nested array
		for(let row =0; row<windowHeight*scaleh;row +=15){
			imgs1[col][row]= new Particle(col-(windowWidth*scalew)/2+15,row-(windowHeight*scaleh)/2+15,15);
		}

	}
	for(let col =0; col<windowWidth*scalew;col +=5){
		imgs2[col] = []; // create nested array
		for(let row =0; row<windowHeight*scaleh;row +=5){
			imgs2[col][row]= new Particle(col-(windowWidth*scalew)/2+10,row-(windowHeight*scaleh)/2+10,5);
		}

	}

}


/**
 * This function is used for letters typing in the state begin
 */
function typeWriter(sentence, n, x, y, speed) {
	if (n < (sentence.length)) {
	  text(sentence.substring(0, n+1), x, y);
	  n++;
	}
}

/**
 * Main draw function for handling events
 * It has different states allowing the user to play around:
 * start - default black
 * begin - text 
 * image - sunset image
 * pixels - the image pixelling effect
 * disolve - the image disolution effect
 * drum - the effect map to the drum music
 * dynamic - dynamic visuals that represent sunset
 * drum&dynamic - combinations of drum and dynamic
 * shrink - fade away the disolve
 */

function draw() {

	if(state == "begin"){
		background(0);
		// console.log(count);
		fill(255);
		textFont('Courier');
		textSize(scalew*100);
		if(count == txt.length){
			text(txt,-(2*txt.length*scalew),-(2*txt.length*scalew),100);
		}else if (count >txt.length ){
			count = 0;
		}
		else{
			typeWriter(txt,count,-(2*txt.length*scalew),-(2*txt.length*scalew),100);
			count++;
		}
	}else if(state == "start"){
		background(0);
	}
	else if (state == "dynamic") {
		background(0);

		if (circleCnt <= 500) {
			circleCnt += 1;
		}
		// draw every cicle
		for (ci = 0; ci < circleCnt; ci++) {
			var time = float(frameCount / 20);
			thetaC = map(ci, 0, circleCnt, 0, TAU);
			// get circle center
			circleCenter = getCenterByTheta(thetaC, time, scale);

			if(ci % 2 == 0 ){
				// change color based on "who" message in extempore
				c = getColorByTheta(thetaC, time,who);
			}else{
				c = color(255,180,255,30);
			}

			//get vertex
			stroke(c);
			noFill();
			beginShape();
			for (vi = 0; vi < vertexCnt; vi++) {
				thetaV = float(map(vi, 0, vertexCnt, 0, TAU));
				x = circleCenter.x + cos(thetaV) * circleSize;
				y = circleCenter.y + sin(thetaV) * circleSize;
				vertex(x, y);
		}
			endShape(CLOSE);
		}
	}
		else if ( state =="image" ){
			background(0);
			if(fadec == 125){
				fadeOut = true;
		
			}else if (fadec == 0 && fadeOut){
				fadeOut = false;
			}
		
			if(fadeOut) {
				fadec --;
			}
			else{
				fadec ++;
			}
			tint(255, fadec);		
			image(img, -(windowWidth*scalew)/2, -(windowHeight*scaleh)/2, windowWidth*scalew, windowHeight*scaleh);

		}else if(state == "drum" ){
			// set the drum synced with music metro 
			cs = frameCount%(180-temp);

			stroke(color(255,180,255,30));
			strokeWeight(10);
			ellipse(0,0,cs*50,cs*50);
			
		}else if (state == "disolve" && (flag == 1)){
			// disolve 
			noStroke();
			push();
			clouds();
			pop();

		}else if(state == "shrink"){
			shrink();
		}else if(state == "pixels"){
			noStroke();
			pixel();
		}else if(state == "drum&dynamic" ){
			background(0);

			//same to dynamic
			if (circleCnt <= 100) {
				circleCnt += 5;
			}
	
			for (ci = 0; ci < circleCnt; ci++) {
				var time = float(frameCount / 20);
				thetaC = map(ci, 0, circleCnt, 0, TAU);
				circleCenter = getCenterByTheta(thetaC, time, scale);
				
				if(ci % 2 == 0 ){
					c = getColorByTheta(thetaC, time, who);
				}else{
					c = color(255,180,255,30);
				}

				stroke(c);
				noFill();
				beginShape();
	
				for (vi = 0; vi < vertexCnt; vi++) {
					thetaV = float(map(vi, 0, vertexCnt, 0, TAU));
					x = circleCenter.x + cos(thetaV) * circleSize;
					y = circleCenter.y + sin(thetaV) * circleSize;
					vertex(x, y);

			}
			
				endShape(CLOSE);
			
			}
			// but with the drum
			cs = frameCount%(180-temp);
			push();
			stroke(color(255,180,255,30));
			strokeWeight(10);
			// fill(color(255,180,255,30));
			ellipse(0,0,cs*50,cs*50);
			pop();
		}


}

/**
 * Helper function for image pixeling effect
 */			
function pixel(){
	background(0);
	// essentially it iterates the location pre-set and draw and move the rect on that loaction
	for(let col =0; col<windowWidth*scalew;col +=20){
		for(let row =0; row<windowHeight*scaleh;row +=20){
			fill(color(255,180,200,30));
			var i = imgs[col][row];
			i.display();
			i.move()
			

		}
	}

	for(let col =0; col<windowWidth*scalew;col +=15){
		for(let row =0; row<windowHeight*scaleh;row +=15){
			fill(color(0, 116, 200,30));
			var i = imgs1[col][row];
			i.display();
			i.move()
			

		}
	}
	for(let col =0; col<windowWidth*scalew;col +=5){
		for(let row =0; row<windowHeight*scaleh;row +=5){
			fill(color(255, 141, 115,30));
			var i = imgs2[col][row];
			i.display();
			i.move()
			

		}
	}

}

/**
 * Helper function for shrink effect
 */
function shrink(){
	// essentially it iterates the location  of drawn disolution effect and set the to black as "fading away"
	for (let index = p.length; index >0; index -=1) {
				
		fill(0);
		var j = new_p[new_p.length-index];
		j.display();
		j.move();
	}

	for (let index = p.length; index >0; index -=2) {
				
		fill(0);
		var j = new_p[new_p.length-index];
		j.display();
		j.move();
	}

	for (let index = p.length; index >0; index -=3) {
				
		fill(0);
		var j = new_p[new_p.length-index];
		j.display();
		j.move();
	}

		for(let col =0; col<windowWidth*scalew;col +=20){
		for(let row =0; row<windowHeight*scaleh;row +=20){

			var i = imgs[col][row];
			fill(0);
			i.display();
			i.move()
			

		}
	}
}

/**
 * Helper function for image disolution effect
 */
var newp = [];
var new_p = [];
function clouds(){
	// essentially it iterates the location pre-set and draw and move the rect on that loaction
	for (let index = 0; index < 1500; index+=1) {
		fill(color(255,180,200,30));
		var i = p[index];
		i.display();
		i.move()
		new_p.push(i);
	}
	for (let index = 0; index < 1500; index+=2) {
		fill(color(0, 116, 200,30));
		var i = p[index];
		i.display();
		i.move()
		new_p.push(i);
	}
	for (let index = 0; index < 1500; index+=3) {
		fill(color(255, 141, 115,30));
		var i = p[index];
		i.display();
		i.move()
		new_p.push(i);
	}

}



/**
 * Handling OSC message from Extempore
 */

function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);

	msg = value[0]
	if (address == '/test/msg') {
		txt = msg;
	} else if (address == '/temp') {
		temp = msg;
	} else if (address == '/vcount') {
		vertexCnt = msg;
	} else if (address == '/state') {
		state = msg;
	} else if (address == '/ccount') {
		circleCnt = msg;
	} else if (address == '/csize') {
		circleSize = msg;
	} else if (address == '/scale') {
		scale = msg;
	} else if (address == '/flag') {
		flag = msg;
	}else if (address == '/who') {
		who = msg;
	}
	


}


// function sendOsc(address, value) {
// 	socket.emit('message', [address].concat(value));
// }

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function () {
		socket.emit('config', {
			server: { port: oscPortIn, host: '127.0.0.1' },
			client: { port: oscPortOut, host: '127.0.0.1' }
		});
	});
	socket.on('message', function (msg) {
		if (msg[0] == '#bundle') {
			for (var i = 2; i < msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}

/**
 * Handling color of the visual effect
 */
function getCenterByTheta(theta, time, scale) {
	directionV = createVector(cos(theta), sin(theta));
	// console.log(directionV)
	var distance = 0.6 + 0.2 * cos(theta * 6.0 + cos(theta * 8.0 + time));
	circleCenter = directionV.mult(distance * scale);
	return circleCenter;
}

function getSizeByTheta(theta, time, scale) {
	var offset = 0.2 + 0.12 * cos(theta * 9.0 - time * 2.0);
	var circleSize = scale * offset;
	return circleSize;
}

function getColorByTheta(theta, time, who) {
	// the color can change based on the who setup in extermpore - either 0, 1, 2
	var th = 8.0 * theta + time * 2.0;
	var blend = 0;

	if(who == 0){
		var r = 0.6 + 0.3 * cos(th);
		g = 0.29;
		b = 0.5 + 0.05 * cos(th - PI / 2.0);

	}else if (who ==1){

		var r = 0.6 + 0.3 * cos(th);
		g = 0.29;
		// b = 0.5 + 0.05 * cos(th - PI / 2.0),
		b = 0;

	}else if(who ==2){
		var r =0;
		g = 0.29+0.3 * cos(th);
		b = 0.5 + 0.05 * cos(th - PI / 2.0);
		// b = 0;

	}else{
		var r = 0.6 + 0.3 * cos(th);
		g = 0.29;
		b = 0.5 + 0.05 * cos(th - PI / 2.0);

	}

	alpha = map(circleCnt, MIN_CIRCLE_CNT, MAX_CIRCLE_CNT, 50, 20);
	return color(r * 255, g * 255, b * 255, alpha);
}

/**
 * For the state disolve
 */
function Particle(x, y, size){
	this.dir = createVector(0, 0);
	this.vel = createVector(0, 0);
	this.pos = createVector(x, y);
	this.speed = 0.2;

  	this.size = size;

	// print(this.pos);

	this.move = function(){
		var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*TWO_PI*noiseScale;
		this.dir.x = cos(angle);

		this.dir.y = sin(angle);
		this.vel = this.dir.copy();
		this.vel.mult(this.speed);
		this.pos.add(this.vel);
	}

	this.checkEdge = function(){
		if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
			this.pos.x = random(10, width);
			this.pos.y = random(10, height);
		}
	}

	this.display = function(){
        rect(this.pos.x, this.pos.y, size, size);
	}
}