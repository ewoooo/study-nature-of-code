export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const HALF = CANVAS_SIZE / 2;
    const FRAME_RATE = 30;
    const STEP = 0.01;

    let t = 0;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
    };

    p.draw = () => {
        p.background(0);

        // divider
        p.stroke(80);
        p.line(0, HALF, CANVAS_SIZE, HALF);

        // labels
        p.noStroke();
        p.fill(255);
        p.textSize(14);
        p.text("1D  noise(x + t)", 10, 25);
        p.text("2D  noise(x, t)", 10, HALF + 25);

        // 1D noise: noise(x + t)
        p.stroke(100, 200, 255);
        p.noFill();
        p.beginShape();
        for (let x = 0; x < CANVAS_SIZE; x++) {
            const y = p.noise(x * STEP + t) * HALF;
            p.vertex(x, y);
        }
        p.endShape();

        // 2D noise: noise(x, t)
        p.stroke(255, 150, 100);
        p.noFill();
        p.beginShape();
        for (let x = 0; x < CANVAS_SIZE; x++) {
            const y = p.noise(x * STEP, t) * HALF + HALF;
            p.vertex(x, y);
        }
        p.endShape();

        t += STEP;
    };
}
