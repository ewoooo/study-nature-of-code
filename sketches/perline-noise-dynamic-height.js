import { slider } from "../ui/sliders.js";

export default function sketch(p) {
    const CANVAS = 600;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    let spd, speed;
    let t, amp;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        spd = slider("speed", 0.01, 0.01, 0.1, 0.005);
        amp = slider("amplitude", 1, 0, 2);
        t = 0;
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        speed = spd.value;

        for (let x = 20; x < CANVAS; x += 20) {
            let y = p.noise(x * amp.value, t + speed) * CANVAS;
            p.circle(x, y, 20);
        }
        t += speed;
    };
}
