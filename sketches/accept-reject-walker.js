export default function sketch(p) {
    const CANVAS_SIZE = 1000;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;
    const SIZE = 3;
    const COLOR = "white";

    class Walker {
        constructor() {
            this.x = CANVAS_SIZE / 2;
            this.y = CANVAS_SIZE / 2;
        }

        stepSize() {
            const d = p.random(0, 10);
            return d;
        }

        step() {
            const dx = p.randomGaussian(this.m, this.sd);
            const dy = p.randomGaussian(this.m, this.sd);
            this.x += dx;
            this.y += dy;
        }
    }

    let walker;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        walker = new Walker();
    };

    p.draw = () => {
        walker.step();
        const { x, y } = walker;

        p.noStroke();
        p.fill(COLOR);
        p.circle(x, y, SIZE);
    };
}
