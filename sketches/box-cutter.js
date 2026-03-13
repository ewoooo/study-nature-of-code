export default function sketch(p) {
    const CANVAS = 100;
    const HALF = CANVAS / 2;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
    };

    p.draw = () => {
        // 1. Box
        // for (let y = 0; y < CANVAS; y++) {
        //     for (let x = 0; x <= CANVAS; x++) {
        //         p.set(x, y, 255);
        //     }
        // }

        // 2. Triangle
        // for (let y = 0; y < CANVAS; y++) {
        //     for (let x = 0; x <= y; x++) {
        //         p.set(x, y, 255);
        //     }
        // }

        // 3. Triangle (reversed)
        // for (let y = 0; y < CANVAS; y++) {
        //     for (let x = CANVAS; x >= CANVAS - y; x--) {
        //         p.set(x, y, 255);
        //     }
        // }

        // 3. Triangle (centered)
        // for (let y = 0; y < CANVAS; y++) {
        //     const spread = y / 2;
        //     for (let x = HALF - spread; x <= HALF + spread; x++) {
        //         p.set(x, y, 255);
        //     }
        // }

        // 4. Diamond
        // for (let y = 0; y <= CANVAS; y++) {
        //     const spread = HALF - Math.abs(HALF - y);
        //     for (let x = HALF - spread; x <= HALF + spread; x++) {
        //         p.set(x, y, 255);
        //     }
        // }

        // 5. Diamond (Alternative)
        for (let y = 0; y <= CANVAS; y++) {
            const start = Math.abs(HALF - y);
            for (let x = start; x <= CANVAS - start; x++) {
                p.set(x, y, 255);
            }
        }

        p.updatePixels();
        p.noLoop();
    };
}
