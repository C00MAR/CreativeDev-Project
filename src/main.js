import { GUI } from "dat.gui"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // context type: https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext#typedecontexte
let time = false;

document.getElementById('timebtn').addEventListener('click', () => {
    time = true;
    setTimeout(() => {
        time = false;
    }, params.timeVisibility);
});

function getTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeArray = [hours, minutes];
    const timeDigits = timeArray.flatMap(digit => digit < 10 ? [0, digit] : digit.toString().split('').map(Number));
    timeDigits.splice(2, 0, ':');
    return timeDigits;
}

function centerAllBubble(bubble) {
    bubble.x += (canvas.width / 2 - bubble.x) * 0.05
    bubble.y += (canvas.height / 2 - bubble.y) * 0.05
}

function GetPosition(size) {
    const coordinates = [];

    for (let i = 0; i < 5; i++) {
        const n = i + 1;
        coordinates.push({ x: (size.ecartTypeWidth * n) + (size.widthOfDigit * i), y: size.ecartTypeHeight });
    }

    return coordinates;
}

function GetSizeOfDigit() {
    const widthOfDigit = canvas.width * 0.15;
    const ecartTypeWidth = (canvas.width - widthOfDigit * 5) / 6;
    const heightOfDigit = canvas.height * 0.8;
    const ecartTypeHeight = (canvas.height - heightOfDigit) / 2;

    return { widthOfDigit, ecartTypeWidth, heightOfDigit, ecartTypeHeight };
}

function drawDigit(bubbles, digit, i, coo, sizeOfDigit) {
    const startIndex = (i - 1) * 6;
    const endIndex = i * 6;
    const digitBubbles = bubbles.slice(startIndex, endIndex);

    if (digit !== ':') {
        const dotTop = new Bubble((canvas.width / 2), (canvas.height / 2 + 75), ctx, i + 1);
        dotTop.draw(ctx);
        const dotBottom = new Bubble((canvas.width / 2), (canvas.height / 2 - 75), ctx, i + 1);
        dotBottom.draw(ctx);

        for (let k = 0; k < 1.5; k += 0.5) {
            const bubble = new Bubble(coo.x, coo.y + (sizeOfDigit.heightOfDigit * k), ctx, i + 1);
            bubble.draw(ctx);
            
            if (k === 0.5 && (digit === 2 || digit === 3 || digit === 4 || digit === 5 || digit === 6 || digit === 8 || digit === 9)) {
                drawLine(bubble.x, bubble.y, bubble.x + sizeOfDigit.widthOfDigit, bubble.y);
            }

            if (k === 0.5 && (digit === 0 || digit === 4 || digit === 5 || digit === 6 || digit === 8 || digit === 9)) {
                drawLine(bubble.x, bubble.y, bubble.x, bubble.y - sizeOfDigit.heightOfDigit / 2);
            }

            if (k === 0.5 && (digit === 0 || digit === 2 || digit === 6 || digit === 8)) {
                drawLine(bubble.x, bubble.y, bubble.x, bubble.y + sizeOfDigit.heightOfDigit / 2);
            }

            if (k === 0.5 && (digit === 1)) {
                drawLine(bubble.x, bubble.y, bubble.x + sizeOfDigit.widthOfDigit, bubble.y - sizeOfDigit.heightOfDigit / 2);
            }

            for (let l = 0; l < 2; l++) {
                const bubble = new Bubble(coo.x + (sizeOfDigit.widthOfDigit * l), coo.y + (sizeOfDigit.heightOfDigit * k), ctx, i + 1);
                bubble.draw(ctx);

                if (l === 1 && k === 0 && (digit === 0 || digit === 2 || digit === 3 || digit === 5 || digit === 6 || digit === 7 || digit === 8 || digit === 9)) {
                    drawLine(bubble.x, bubble.y, bubble.x - sizeOfDigit.widthOfDigit, bubble.y);
                }

                if (l === 1 && k === 0 && (digit === 0 || digit === 1 || digit === 2 || digit === 3 || digit === 4 || digit === 7 || digit === 8 || digit === 9)) {
                    drawLine(bubble.x, bubble.y, bubble.x, bubble.y + sizeOfDigit.heightOfDigit / 2);
                }

                if (l === 1 && k === 1 && (digit === 0 || digit === 2 || digit === 3 || digit === 5 || digit === 6 || digit === 8 || digit === 9)) {
                    drawLine(bubble.x, bubble.y, bubble.x - sizeOfDigit.widthOfDigit, bubble.y);
                }

                if (l === 1 && k === 1 && (digit === 0 || digit === 1 || digit === 3 || digit === 4 || digit === 5 || digit === 6 || digit === 7 || digit === 8 || digit === 9)) {
                    drawLine(bubble.x, bubble.y, bubble.x, bubble.y - sizeOfDigit.heightOfDigit / 2);
                }
            }
        }
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function timeCall(bubbles) {
    const timeDigits = getTime();
    const sizeOfDigit = GetSizeOfDigit();
    const startDigitAt = GetPosition(sizeOfDigit);

    timeDigits.forEach((digit, i) => {
        drawDigit(bubbles, digit, i, startDigitAt[i], sizeOfDigit);
    });
}

/**
 *  CONFIG
 */
const params = {
    nBubbles: 24,
    speed: 1,
    radius: 3,
    lineWidth: 2,
    threshold: 200,
    timeVisibility: 3000
}
const debug = new GUI() // create a debug GUI and add it to the DOM
let guiFolder

/**
 * METHODS
 */
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const distance = (x1, y1, x2, y2) => {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy) // Theorème de Pythagore : https://fr.wikipedia.org/wiki/Th%C3%A9or%C3%A8me_de_Pythagore
}

/**
 *  CLASSES
 */
class Bubble {
    constructor(x, y, context, id) {
        this.x = x
        this.y = y
        this.id = id;

        // animation
        this.vx = Math.random() * 2 - 1 // [-1 : 1]
        this.vy = Math.random() * 2 - 1 // [-1 : 1]
        this.context = context
    }

    draw(context) {
        // draw
        context.save()
        context.translate(this.x, this.y)
        context.beginPath()
        context.arc(0, 0, params.radius, 0, 2 * Math.PI)
        context.fill()
        context.stroke()
        context.closePath()
        context.restore()
    }

    update(canvas, speed = 1) {
        // position
        this.x += this.vx * speed
        this.y += this.vy * speed

        // bounce
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
    }
}


/**
 *  MAIN
 */
const generateBubbles = () => {
    // Get canvas dimensions
    const canvasWidth = canvas.getBoundingClientRect().width
    const canvasHeight = canvas.getBoundingClientRect().height
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Setup
    const bubbles = []
    for (let i = 0; i < params.nBubbles; i++) {
        const x_ = canvasWidth * Math.random()
        const y_ = canvasHeight * Math.random()
        const id_ = i + 1
        const bubble_ = new Bubble(x_, y_, ctx, id_)
        bubbles.push(bubble_)
    }

    // Style
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineCap = "round" // avoid artifact with large strokes

    // Update
    const update = () => {
        clearCanvas()

        for (let i = 0; i < bubbles.length; i++) {
            const current_ = bubbles[i]

            for (let j = i + 1; j < bubbles.length; j++) {
                const next_ = bubbles[j]

                const dist_ = distance(current_.x, current_.y, next_.x, next_.y)

                if (dist_ < params.threshold) {
                    ctx.save()
                    ctx.beginPath()
                    ctx.moveTo(current_.x, current_.y)
                    ctx.lineTo(next_.x, next_.y)
                    ctx.stroke()
                    ctx.closePath()
                    ctx.restore()
                }
            }
        }

        bubbles.forEach((bubble) => {
            ctx.lineWidth = params.lineWidth;
            time ? centerAllBubble(bubble) : bubble.update(canvas, params.speed);
            bubble.draw(ctx);
        });

        time && timeCall(bubbles);

        window.requestAnimationFrame(update)
    }
    update()
}

// Debug
guiFolder = debug.addFolder("SETUP")
guiFolder.add(params, 'nBubbles', 2, 100, 1).onChange(generateBubbles)
guiFolder = debug.addFolder("UPDATE")
guiFolder.add(params, 'speed', -10, 10, .1)
guiFolder.add(params, 'radius', 0, 20, .1)
guiFolder.add(params, 'lineWidth', 1, 10, .1)
guiFolder.add(params, 'threshold', 0, canvas.width, 1)
guiFolder.add(params, 'timeVisibility', 1000, 60000, 1)

// Start
generateBubbles()