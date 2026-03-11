import { slider } from "../ui/sliders";

export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    let inc = 0.01;
    let octave;
    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        p.pixelDensity(1);
        octave = slider("octave", 4, 1, 32, 1);
    };
    p.draw = () => {
        let yOff = 0;
        p.loadPixels();
        for (let y = 0; y < p.height; y++) {
            let xOff = 0;
            for (let x = 0; x < p.width; x++) {
                let index = (x + y * p.width) * 4;
                let value = p.noise(xOff, yOff) * 255;
                p.pixels[index] = value;
                p.pixels[index + 1] = value;
                p.pixels[index + 2] = value;
                p.pixels[index + 3] = 255;
                xOff += inc;
            }
            yOff += inc;
        }
        p.updatePixels();
        p.noiseDetail(octave.value);
    };
}
