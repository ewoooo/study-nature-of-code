export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 120;
    const BACKGROUND_COLOR = 0;

    let y;
    let t;
    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
    };
    p.draw = () => {
        if (p.frameCount >= CANVAS_SIZE) {
            p.noLoop();
            return;
        }

        p.stroke("white");
        t = p.frameCount / 500;
        let nx = p.frameCount;
        let ny = p.noise(t) * 600;
        p.line(nx, 0, nx, ny);
    };
}
