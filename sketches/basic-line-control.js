export default function sketch(p) {
    const CANVAS = 600;
    const FRAME_RATE = 60;
    const BACKGROUND_COLOR = 0;

    let x1, y1, x2, y2;
    let speed = 1;
    let isVertical = true;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        x1 = 0;
        y1 = 0;
        x2 = CANVAS;
        y2 = CANVAS;
        isVertical = false;
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        p.stroke(255);
        p.strokeWeight(1);

        // TODO: 여기에 로직을 다시 작성하세요
        if (!isVertical) {
            x1 += speed;
            x2 -= speed;
            if (x1 >= CANVAS || x1 <= 0) {
                isVertical = true;
            }
        } else {
            y1 += speed;
            y2 -= speed;
            if (y1 >= CANVAS || y1 <= 0) {
                isVertical = false;
                speed = -speed;
            }
        }

        p.circle(x1, y1, 5);
        p.circle(x2, y2, 5);
        p.line(x1, y1, x2, y2);
    };
}
