export default function sketch(p) {
    const CANVAS = 600;
    const FRAME_RATE = 60;
    const BACKGROUND_COLOR = 0;

    // 직각삼각형 꼭짓점: (0, CANVAS) → (CANVAS, CANVAS) → (CANVAS, 0) → 다시 처음
    // phase 0: 밑변 (x만 이동)
    // phase 1: 오른쪽 변 (y만 이동)
    // phase 2: 빗변 (x, y 둘 다 이동)
    let x, y;
    let phase;
    let speed = 10;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        x = 20;
        y = CANVAS - 20;
        phase = 0;
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        p.stroke(100);
        p.strokeWeight(1);

        // 삼각형 가이드라인
        p.line(0, CANVAS, CANVAS, CANVAS);
        p.line(CANVAS, CANVAS, CANVAS, 0);
        p.line(CANVAS, 0, 0, CANVAS);

        if (phase === 0) {
            x += speed;
            if (x >= CANVAS) {
                x = CANVAS;
                phase = 1;
            }
        } else if (phase === 1) {
            y -= speed;
            if (y <= 0) {
                y = 0;
                phase = 2;
            }
        } else {
            x -= speed;
            y += speed;
            if (x <= 0) {
                x = 0;
                y = CANVAS;
                phase = 0;
            }
        }

        p.fill(255);
        p.noStroke();
        p.circle(x, y, 40);
    };
}
