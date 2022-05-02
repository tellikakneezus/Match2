

window.canvas = document.getElementById('gameCanvas');
window.ctx = window.canvas.getContext('2d');
bubbles = [];

function init () {

  window.ctx.fillStyle = 'black';
  window.ctx.fillRect(0,0,800,400);

}

function setup(){

    
    for(i = 0 ; i < 10; i++){
        bubbles[i] = (new Bubble(random(800),random(400),random(40), 'white'));
        bubbles[i].show();
    }
}
//#region Loop

let 
limit = 300,
lastFrameTimeMs = 0,
maxFPS = 60,
delta = 0,
timestep = 1000 / 60;

function update(delta) {
    for(bubble of bubbles){
        bubble.move(delta);
    }
}

function draw() {
    for(i = 0; i < bubbles.size; i++){
        bubbles[i].show();
    }
}

function panic() {
delta = 0;
}

function mainLoop(timestamp) {
// Throttle the frame rate.    
if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
    requestAnimationFrame(mainLoop);
    return;
}
delta += timestamp - lastFrameTimeMs;
lastFrameTimeMs = timestamp;

let numUpdateSteps = 0;
while (delta >= timestep) {
    update(timestep);
    delta -= timestep;
    if (++numUpdateSteps >= 240) {
        panic();
        break;
    }
}
draw();
requestAnimationFrame(mainLoop);
}

//requestAnimationFrame(mainLoop);//start of the loop
//#endregion

function random(size){
    return Math.floor(Math.random() * size);
}

function random(min, max){
    return Math.floor((Math.random() * (max -  min)) + max);
}

class Bubble {

    constructor(x, y, r, color){
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }

    move(delta){
        let newX = this.x + (Math.floor(Math.random()*100) - 50);
        let newY = this.y + (Math.floor(Math.random()*100) - 50);
        
        while(bubbleCollision(this.x, this.y, newX, newY, this.r)){
            newX = this.x + (Math.floor(Math.random()*100) - 50);
            newY = this.y + (Math.floor(Math.random()*100) - 50);
        }

        this.x = newX;
        this.y = newY;

    }

    show(){
        window.ctx.strokeStyle = this.color;
        window.ctx.beginPath();
        window.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        window.ctx.stroke();
        window.ctx.closePath();
    }

}

function bubbleCollision(oldX, oldY, newX, newY, radius){
    collision = false;
    //#region check collision logic
    for(bubble of bubbles){
        if(oldX != bubble.x && oldY != bubble.y){ //not current bubble
            if((newX + radius)  > (bubble.x - bubble.r)){ //furthest right point after furthest left point
                if((newX - radius) < (bubble.x + bubble.r)){//furthest left point before furthest right point 
                    if((newY + radius) > (bubble.y - bubble.r)){//top most point above lowest point
                        if((newY - radius) < (bubble.y + bubble.r)){//lowest point below top most point
                            collision = true;
                        }
                    }
                }
            }
        }
    }
    //#endregion
    return collision;
}

init();
setup();





