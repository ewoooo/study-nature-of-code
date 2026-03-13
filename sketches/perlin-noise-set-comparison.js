import { slider } from "../ui/sliders.js";

export default function sketch(p) {
    const W = 200;
    const H = 200;

    let t, speed, scale;

    p.setup = () => {
        p.createCanvas(W, H);
        p.background(0);
        p.pixelDensity(1);
        speed = slider("speed", 0.5, 0.1, 3, 0.1);
        scale = slider("scale", 0.05, 0.01, 0.2);
        t = 0;
    };

    p.draw = () => {
        const midY = H / 2;

        // 상단: noise(x + t) — noise 샘플링 이동
        // 매 프레임 전체 x를 다시 그림
        for (let x = 0; x < W; x++) {
            const b = p.noise(x * scale.value + t) * 255;
            p.stroke(b);
            p.line(x, 0, x, midY - 2);
        }

        // 하단: set(x + t) — 그리는 위치 이동
        // background 없음 → 이전 프레임 잔상 유지
        for (let x = 0; x < W; x++) {
            const b = p.noise(x * scale.value + t) * 255;
            const drawX = Math.floor(x + t * 10);
            if (drawX >= 0 && drawX < W) {
                p.stroke(b);
                p.line(drawX, midY + 2, drawX, H);
            }
        }

        // 구분선
        p.stroke(255, 0, 0);
        p.line(0, midY, W, midY);

        t += speed.value * 0.01;
    };
}
