import { slider } from "../ui/sliders.js";

export default function sketch(p) {
    const CANVAS_SIZE = 600;

    let speed, size, hue, radius;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.colorMode(p.HSB, 360, 100, 100);
        p.background(0, 0, 10);

        speed = slider("Speed", 2, 0.5, 10, 0.5);
        size = slider("Size", 8, 2, 40, 1);
        hue = slider("Hue", 200, 0, 360, 1);
        radius = slider("Radius", 150, 20, 280, 1);
    };

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    let angle = 0;

    p.draw = () => {
        p.background(0, 0, 10, 0.05);

        const x = cx + Math.cos(angle) * radius.value;
        const y = cy + Math.sin(angle) * radius.value;

        p.noStroke();
        p.fill(hue.value, 80, 90, 0.6);
        p.circle(x, y, size.value);

        angle += speed.value * 0.02;
    };
}
