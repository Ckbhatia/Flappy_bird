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

// Start button
const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29
}

/**
 * Handles the click of the key
 * @param {object} event
 */
const handleKey = evt => {
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            swooshing_sound.play();
            break;
        case state.game:
             bird.flap();
             flap_sound.play();
             break;
        case state.over:
            let rect = canvas.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
}

const handleKeyup = e => {
    // Checks if pressed key is up arrow key or space key
    if (e.keyCode === 32 || e.keyCode === 38) {
        // Invokes handlekey function with event argument
        handleKey(e);

        if (state.current === state.over) {
            pipes.reset();
            bird.speedReset();
            score.reset();
            state.current = state.getReady;
        }
    }
}

// Listen for press of space ky and invokes a function
document.addEventListener('keyup', handleKey);

// Listen for click and invokes handleKey function
canvas.addEventListener('click', handleKey);

// Sprite image
const sprite = new Image();
sprite.src = "assets/media/img/sprite.png";


// Sounds effects
const score_sound = new Audio();
score_sound.src = 'assets/media/audio/sfx_point.wav';

const flap_sound = new Audio();
flap_sound.src = 'assets/media/audio/sfx_flap.wav';

const hit_sound = new Audio();
hit_sound.src = 'assets/media/audio/sfx_hit.wav';

const swooshing_sound = new Audio();
swooshing_sound.src = 'assets/media/audio/sfx_swooshing.wav';

const die_sound = new Audio();
die_sound.src = 'assets/media/audio/sfx_die.wav';


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
                    die_sound.play();
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
    },
    speedReset: function() {
        this.speed = 0;
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
                    hit_sound.play();
            }
            // Bottom pipe
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && 
                bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
                    state.current = state.over;
                    hit_sound.play();                    
            }

            // Move the pipes to the left
            p.x -= this.dx;

            // If the pipes go beyond canvas, delete them
            if (p.x + this.w <= 0) {
                this.position.shift();
                // Increment the score by one
                score.value += 1;
                // Score sound
                score_sound.play();
                // Best score
                score.best = Math.max(score.value, score.best);
                // Sent the best score to localStorage
                localStorage.setItem('best', score.best);
            }
        }
    },
    reset: function() {
        this.position = [];
    }
}

// Score object
const score = {
    best: parseInt(localStorage.getItem('best')) || 0,
    value: 0,
    draw() {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, canvas.width-50, 50);
            ctx.strokeText(this.value, canvas.width-50, 50);
        }
        else if (state.current == state.over) {
            // Score value text
            ctx.font = "30px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);
            // Best score text
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);
        }
    },
    reset: function() {
        this.value = 0;
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
    score.draw();
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