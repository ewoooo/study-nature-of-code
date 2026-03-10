export default function sketch(p) {
    // Basic Configuration
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 60;
    const BACKGROUND_COLOR = 0;
    const COUNT = 20;

    // random
    let cx, cy, cl;
    let r, g, b;
    let dist, pow;

    const mean = CANVAS_SIZE / 2;
    const d = 50;
    const size = 20;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);

        r = 255;
        g = 255;
        b = 255;
        dist = 100;
        pow = 100;
    };
    p.draw = () => {
        cx = p.randomGaussian(mean, d);
        cy = p.randomGaussian(mean, d);

        r = p.randomGaussian(100, pow) + dist;
        g = p.randomGaussian(100, pow) + dist;

        cl = p.color(r, g, b);
        p.fill(cl);
        p.circle(cx, cy, size);
    };
}
