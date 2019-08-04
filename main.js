// Select the canvas
const canvas = document.querySelector('.canvas');

// Select the 2D context
const ctx = canvas.getContext('2d');

// Variables
let frames = 0;
const degree = Math.PI/180;

// Game state 
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// Event listener on canvas
document.addEventListener('click', function(evt) {
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
             bird.flap();
             break;
        case state.over: 
            state.current = state.getReady;
            break;
    }
})

// Sprite image
const sprite = new Image();
sprite.src = "assets/media/img/sprite.png";

// Background object
const background = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: canvas.height - 226,

    /**
     * Draws images on context
     * @param {none}
     * @return {none}
     */
    draw: function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}

// Foreground object
const foreground = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: canvas.height - 112,
    dx: 2,

    /**
     * Draws images on context
     * @param {none}
     * @return {none}
     */
    draw: function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    /**
     * Renders foreground as moving
     * @param {none}
     * @return {undefined}
     */
    update: function() {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w/2);
        }
    }
}

// Bird object
const bird = {
    animation: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    // Radius
    radius: 12,

    // frame
    frame: 0,
    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0,

    draw: function() {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);

        ctx.restore();
    },

    /**
     * Changes the speed of the bird
     * @param {none}
     * @return {undefined}
     */
    flap: function() {
        this.speed = - this.jump;
    },
    
    /**
     * Updates the bird properties and game state
     * @param {none}
     * @return {undefined}
     */
    update: function() {
    // If the current state is get ready, the bird flap slowly
        this.period = state.current == state.getReady ? 10 : 5;
        // Increment the frame by 1, each period
        this.frame += frames % this.period == 0 ? 1 : 0;
        // Frame goes from 0 to 4, then again resets to 0
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150; // Reset the position of the bird after game over
            this.rotation = 0 * degree;

        }
        else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h/2 >= canvas.height - foreground.h) {
                this.y = canvas.height - foreground.h - this.h/2;
                if (state.current == state.game) {
                    state.current = state.over;
                }
            }
            // If the speed is greater than the jump means bird is faling down 
            if (this.speed >= this.jump) {
                this.rotation = 90 * degree;
                this.frame = 1;
            }
            else {
                this.rotation = -25 * degree;
            }
        }
    }

}

// Get ready 
const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: canvas.width/2 - 173/2,
    y: 80,

    draw: function() {
        if (state.current == state.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// Get ready 
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: canvas.width/2 - 225/2,
    y: 90,

    draw: function() {
        if (state.current == state.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// Pipes object
const pipes = {
    // Array for different position
    position: [],
    
    top: {
        sX: 553,
        sY: 0
    },
    bottom:{
        sX: 502,
        sY: 0
    },
    
    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    /**
     * Draws pipes to the canvas
     * @param {none}
     * @return {undefined}
     */
    draw : function() {
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },

    /**
     * Updates pipes position
     * @param {none}
     * @return {undefined}
     */
    update: function() {
        // Checks the state if current is game then skipps it
        if (state.current !== state.game) return;


        if (frames % 100 == 0) {

            this.position.push({
                x : canvas.width,
                y : this.maxYPos * ( Math.random() + 1)
            });

        }
        
        for (let k = 0; k < this.position.length; k++) {
            let p = this.position[k];

            let bottomPipeYPos = p.y + this.h + this.gap;

            // COLLISION DETECTION
            // Top pipe
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y 
                && bird.y - bird.radius < p.y + this.h) {
                    state.current = state.over;
                    // Reset pipe postiion
                    this.position = [];
            }
             
            // Bottom pipe
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && 
                bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
                    state.current = state.over;
                    // Reset pipe position
                    this.position = [];

            }

            // Move the pipes to the left
            p.x -= this.dx;

            // If the pipes go beyond canvas, delete them
            if (p.x + this.w <= 0) {
                this.position.shift();
            }
        }
    }
}

/**
 * 
 * @param {none}
 * @return {none}
 */
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    background.draw();
    foreground.draw();
    pipes.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

/**
 * Invokes the all update functions of main.js file
 * @param {none}
 * @return {undefined}
 */
function update() {
    // Invokes the bird's update method
    bird.update();
    // Invokes the foreground's update method
    foreground.update();
    // Invokes the pipe's update method
    pipes.update();
}

/**
 * 
 * @param {none}
 * @return {none}
 */
function loop() {
    update();
    draw();
    frames++;

    // Request animation frame
    requestAnimationFrame(loop)
}
// Invokes loop function
loop();