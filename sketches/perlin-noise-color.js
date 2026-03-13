import { slider } from "../ui/sliders.js";

export default function sketch(p) {
    const CANVAS = 100;
    const BACKGROUND_COLOR = 0;

    let t, scale, speed, hueSpeed, octave, falloff;
    let yOff, num;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.background(BACKGROUND_COLOR);
        p.pixelDensity(1);
        p.colorMode(p.HSB, 360, 100, 100);
        speed = slider("speed", 0.1, 0.1, 5);
        scale = slider("scale", 0.1, 0.1, 1);
        hueSpeed = slider("hueSpeed", 20, 10, 50, 1);
        octave = slider("octave", 4, 1, 8, 1);
        falloff = slider("falloff", 0.5, 0, 2, 0.05);
        t = 0;
        yOff = 0;
        num = CANVAS;
    };

    p.draw = () => {
        p.noiseDetail(octave.value, falloff.value);
        for (let y = 0; y < CANVAS; y++) {
            for (let x = 0; x <= CANVAS; x++) {
                let n = p.noise(x * scale.value, y * scale.value, t);
                let hue = (n * 360 + t * hueSpeed.value) % 360;
                p.set(x, y, p.color(hue, 80, 100));
            }
        }
        p.updatePixels();
        t += speed.value * 0.01;
    };
}
