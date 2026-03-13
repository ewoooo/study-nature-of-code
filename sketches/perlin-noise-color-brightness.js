import { slider } from "../ui/sliders";
export default function sketch(p) {
    const CANVAS = 150;
    const HALF = CANVAS / 2;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    let scl, spd, oct, falloff;
    let xOff, yOff;
    let t = 0;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.pixelDensity(1);
        p.colorMode(p.HSB, 360, 100, 100);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        scl = slider("scale", 0.05, 0.01, 1, 0.01);
        spd = slider("speed", 1, 1, 5);
        oct = slider("octave", 1, 1, 5);
        falloff = slider("falloff", 1, 1, 5);
        xOff = slider("xOff", 1, 1, 5);
        yOff = slider("yOff", 1, 1, 5);
    };

    p.draw = () => {
        for (let y = 0; y < CANVAS; y++) {
            for (let x = 0; x < CANVAS; x++) {
                const nx = x * scl.value * xOff.value;
                const ny = y * scl.value * yOff.value;

                const n = Math.floor(p.noise(nx, ny) * 360);
                const b = Math.floor(p.noise(nx, ny) * 200);
                const hue = (n * 2 + t) % 360;

                p.set(x, y, p.color(hue, 80, b));
            }
        }

        p.noiseDetail(oct.value, falloff.value);
        p.updatePixels();

        t += spd.value;
    };
}
