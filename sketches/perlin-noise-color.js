import { slider } from "../ui/sliders.js";

export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 10;
    const BACKGROUND_COLOR = 0;

    let xOff, yOff, t;
    let amp, octave, falloff, inc;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        p.pixelDensity(1);
        p.colorMode(p.HSB);

        amp = slider("Amplitude", 0.02, 0, 0.1, 0.01);
        octave = slider("Octave", 16, 1, 32);
        falloff = slider("Falloff", 0.5, 0, 1);
        inc = slider("Increment", 0.01, 0.01, 0.1, 0.01);
    };
    p.draw = () => {
        p.loadPixels();

        yOff = 0;
        for (let y = 0; y < CANVAS_SIZE; y++) {
            xOff = 0;
            for (let x = 0; x < CANVAS_SIZE; x++) {
                const index = (x + y * CANVAS_SIZE) * 4;
                const value = p.noise(xOff, yOff, t) * 255;
                p.pixels[index] = value;
                p.pixels[index + 1] = value;
                p.pixels[index + 2] = value;
                p.pixels[index + 3] = 255;
                xOff += amp.value;
            }
            yOff += amp.value;
        }
        p.updatePixels();
        t += inc;
        p.noLoop();
        p.noiseDetail(octave.value, falloff.value);
    };
}
