export default function sketch(p) {
    // Basic Configuration
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 120;
    const BACKGROUND_COLOR = 0;
    const COUNT = 20;

    // array
    const entry = Array(COUNT).fill(0);

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
    };
    p.draw = () => {
        const num = Math.floor(p.randomGaussian(COUNT / 2, 3));
        const index = p.constrain(num, 0, COUNT - 1);
        entry[index]++;

        const barWidth = p.width / COUNT;

        for (let i = 0; i < COUNT; i++) {
            const cx = (i / COUNT) * p.width;
            p.rect(cx, p.height - entry[i], barWidth, entry[i]);
        }
    };
}
