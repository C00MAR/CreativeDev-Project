import { GUI } from "dat.gui"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // context type: https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext#typedecontexte

/**
 *  CONFIG
 */
const params = {
    nBubbles: 4,
    speed: 1,
    radius: 10,
    lineWidth: 2,
    threshold: 50
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
    constructor(x, y, context) {
        this.x = x
        this.y = y

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
        const bubble_ = new Bubble(x_, y_, ctx)
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

        bubbles.forEach((b) => {
            ctx.lineWidth = params.lineWidth
            b.update(canvas, params.speed)
            b.draw(ctx)
        })
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

// Start
generateBubbles()