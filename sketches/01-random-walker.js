export default function sketch(p) {
    // Basic Configuration
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    // Walker Class
    class Walker {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        calc() {
            const a = Math.floor(p.random(3)) - 1;
            const b = Math.floor(p.random(3)) - 1;
            return [a, b];
        }
        step() {
            const [x, y] = this.calc();
            this.x += x;
            this.y += y;
        }
        render() {
            p.point(this.x, this.y);
        }
    }

    let walker;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        walker = new Walker(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    };
    p.draw = () => {
        p.stroke(255);
        p.strokeWeight(2);
        walker.step();
        walker.render();
    };
}
