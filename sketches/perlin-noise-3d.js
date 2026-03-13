export default function sketch(p) {
    const CANVAS = 600;
    const HALF = CANVAS / 2;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    let land;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS, p.WEBGL);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        land;
    };

    p.draw = () => {};
}
