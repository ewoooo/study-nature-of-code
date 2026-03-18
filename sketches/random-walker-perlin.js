export default function sketch(p) {
    const CANVAS = 600;
    const HALF = CANVAS / 2;
    const FRAME_RATE = 60;
    const BACKGROUND_COLOR = 0;

    let t = 0;

    class Fly {
        constructor(f = 100) {
            this.points = [];
            this.offset = f;
        }

        move() {
            const x = p.noise(t + this.offset) * CANVAS;
            const y = p.noise(t + this.offset + 1000) * CANVAS;
            return [x, y];
        }

        get isFull() {
            return this.points.length > 500;
        }

        update() {
            this.points.push(this.move());
            if (this.isFull) this.points.shift();
        }

        render() {
            this.update();
            if (this.points.length < 2) return;
            for (let i = 0; i < this.points.length; i++) {
                const b = p.map(i, 0, this.points.length - 1, 0, 255);
                const l = p.map(i, 0, this.points.length - 1, 1, 2);
                const [x2, y2] = this.points[i];
                const [x1, y1] = this.points[i - 1] || [x2, y2];

                p.strokeWeight(l);
                p.stroke(b);
                p.line(x1, y1, x2, y2);
            }
        }
    }

    const num = 5;
    const flies = [];

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        for (let i = 0; i < num; i++) {
            flies.push(new Fly(i * p.random(0, 10000)));
        }
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        p.strokeWeight(5);
        p.stroke(255);

        t += 0.01;
        flies.forEach((fly) => fly.render());
    };
}
