import { slider } from "../ui/sliders";

export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 120;
    const BACKGROUND_COLOR = 0;

    let t;
    let pow;
    let spd;
    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        pow = slider("power", 0.01, 0.01, 1, 0.01);
        spd = slider("speed", 0.01, 0.01, 1, 0.01);

        t = 0;
    };
    p.draw = () => {
        const power = pow.value;
        const speed = spd.value;
        p.background(BACKGROUND_COLOR);
        p.stroke("white");
        p.noFill();

        p.beginShape();
        for (let x = 0; x < CANVAS_SIZE; x++) {
            let y = p.noise(x * power + t, speed) * CANVAS_SIZE;
            p.vertex(x, y);
        }
        p.endShape();

        t += speed;
    };
}
