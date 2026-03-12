import { slider } from "../ui/sliders.js";

export default function sketch(p) {
    const CANVAS = 600;
    const THIRD = CANVAS / 3;
    const FRAME_RATE = 30;
    const MARGIN = 20;

    const GRAY = [120, 120, 120];
    const BLUE = [0, 100, 155];
    const ORANGE = [255, 100, 0];
    const MAGENTA = [205, 10, 155];

    let t = 0;
    let step, speed;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        step = slider("step", 0.02, 0.01, 0.1, 0.01);
        speed = slider("speed", 0.2, 0.1, 1, 0.1);
    };

    p.draw = () => {
        p.background(0);

        // divider
        p.stroke(GRAY);
        p.line(0, THIRD, CANVAS, THIRD);
        p.line(0, THIRD * 2, CANVAS, THIRD * 2);

        // X Axis
        p.fill(GRAY);
        p.noStroke();
        p.text("X", MARGIN - 10, MARGIN);

        p.stroke(BLUE);
        p.noFill();
        p.beginShape();
        for (let x = 0; x < CANVAS; x++) {
            let y = p.noise(x * step.value + t) * THIRD;
            p.vertex(x, y);
        }
        p.endShape();

        // X,Y Axis
        p.fill(GRAY);
        p.noStroke();
        p.text("XY", MARGIN - 10, THIRD + MARGIN);

        p.stroke(ORANGE);
        p.noFill();
        p.beginShape();
        for (let x = 0; x < CANVAS; x++) {
            let y =
                p.noise(x * step.value + t, t * speed.value) * THIRD + THIRD;
            p.vertex(x, y);
        }
        p.endShape();

        // X,Y Axis
        p.fill(GRAY);
        p.noStroke();
        p.text("XYZ", MARGIN - 10, THIRD * 2 + MARGIN);

        p.stroke(MAGENTA);
        p.noFill();
        p.beginShape();
        for (let x = 0; x < CANVAS; x++) {
            let y =
                p.noise(x * step.value + t, t * speed.value, t * speed.value) *
                    THIRD +
                THIRD * 2;
            p.vertex(x, y);
        }
        p.endShape();

        t += step.value;
    };
}
