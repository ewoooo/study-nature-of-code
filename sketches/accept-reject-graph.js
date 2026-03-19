export default function sketch(p) {
    // Basic Configuration
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 60;
    const BACKGROUND_COLOR = 0;
    const COUNT = 10;

    // array
    const entry = Array(COUNT).fill(0);

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
    };
    p.draw = () => {
        const index = Math.floor(sampling() * COUNT);
        entry[index]++;

        const barWidth = p.width / COUNT;

        for (let i = 0; i < COUNT; i++) {
            const cx = (i / COUNT) * p.width;
            p.rect(cx, p.height - entry[i], barWidth, entry[i]);
        }
    };

    function sampling() {
        while (true) {
            let r1 = p.random(1);
            let k = 1 - r1 / 20;
            let r2 = p.random(1);
            if (r2 < k) {
                return r1;
            }
        }
    }
}
