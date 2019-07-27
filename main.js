// Select the canvas
const canvas = document.querySelector('.canvas');

// Select the 2D context
const ctx = canvas.getContext('2d');

// Variables
let frames = 0;

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


/**
 * 
 * @param {none}
 * @return {none}
 */
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
}

/**
 * 
 * @param {none}
 * @return {none}
 */
function update() {

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