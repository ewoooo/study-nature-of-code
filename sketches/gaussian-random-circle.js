export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    let x, y;
    let cl;
    let m, sd;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        cl = p.color(255, 50);
        m = CANVAS_SIZE / 2;
        sd = 60;
    };
    p.draw = () => {
        x = p.randomGaussian(m, sd);
        y = p.height / 2;

        p.noStroke();
        p.fill(cl);
        p.circle(x, y, 50);
    };
}
