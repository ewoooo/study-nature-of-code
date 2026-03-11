import { slider } from "../ui/sliders";

export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    let falloff, octave, step, speed;
    let x,
        y,
        offset,
        s = 0;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        falloff = slider("falloff", 0.5, 0.1, 1, 0.1);
        octave = slider("octave", 4, 1, 32, 1);
        step = slider("steps", 0.005, 0.001, 0.05, 0.001);
        speed = slider("speed", 1, 0.1, 10, 0.1);
    };
    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        p.stroke("white");
        p.noFill();

        offset = s;

        const cy = p.noise(offset + step.value * 300) * p.height;
        p.circle(p.width / 2, cy, 10);

        p.beginShape();
        for (let x = 0; x < p.width; x++) {
            const y = p.noise(offset) * p.height;
            p.vertex(x, y);
            offset += step.value;
        }
        p.endShape();

        s += step.value * speed.value;
        p.noiseDetail(octave.value, falloff.value);
    };
}
