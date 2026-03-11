import { slider } from "../ui/sliders.js";
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

        // stepSize(d) {
        //     while (true) {
        //         const r1 = p.random(0, d);
        //         const r2 = p.random(0, 1);
        //         const k = 1 / r1 ** 2;
        //         if (r2 < k) return r1;
        //     }
        // }

        stepSize(d) {
            while (true) {
                const r1 = p.random(0, d);
                const r2 = p.random(0, 1);
                const k = 1 - r1 / d;
                if (r2 < k) return r1;
            }
        }

        step(d) {
            const step = this.stepSize(d);
            const dx = p.random([true, false]) ? 1 : -1;
            const dy = p.random([true, false]) ? 1 : -1;
            this.x += dx * step;
            this.y += dy * step;
        }
    }

    let walker, dist;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        walker = new Walker();
        dist = slider("distance", 50, 0, 300, 10);
    };

    p.draw = () => {
        walker.step(dist.value);
        const { x, y } = walker;
        const dx = ((x % CANVAS_SIZE) + CANVAS_SIZE) % CANVAS_SIZE;
        const dy = ((y % CANVAS_SIZE) + CANVAS_SIZE) % CANVAS_SIZE;
        console.log(dx, dy);
        p.noStroke();

        p.fill(COLOR);
        p.circle(dx, dy, SIZE);
    };
}
