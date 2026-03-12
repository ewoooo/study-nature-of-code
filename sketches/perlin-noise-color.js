import { slider } from "../ui/sliders.js";

export default function sketch(p) {
    const CANVAS = 200;
    const BACKGROUND_COLOR = 0;

    let scale;
    let t;

    p.setup = () => {
        p.pixelDensity(1);
        p.createCanvas(CANVAS, CANVAS);
        p.background(BACKGROUND_COLOR);
        scale = 0.1;
    };
    p.draw = () => {
        for (let x = 0; x < CANVAS; x++) {
            for (let y = 0; y < CANVAS; y++) {
                let nx = x * scale;
                let ny = y * scale;
                const b = 255 * p.noise(nx, ny);
                p.stroke(b);
                p.point(x, y);
            }
        }

        t += 0.01;
    };
}
