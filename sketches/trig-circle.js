export default function sketch(p) {
    const SIZE = 600;
    const R = 180;

    p.setup = () => {
        p.createCanvas(SIZE, SIZE);
        p.textFont("monospace");
    };

    let angle = 0;

    p.draw = () => {
        p.background(20);
        p.translate(SIZE / 2, SIZE / 2);

        // 마우스가 캔버스 위에 있으면 마우스 방향으로 각도 결정
        const mx = p.mouseX - SIZE / 2;
        const my = p.mouseY - SIZE / 2;
        if (
            p.mouseX > 0 &&
            p.mouseX < SIZE &&
            p.mouseY > 0 &&
            p.mouseY < SIZE
        ) {
            angle = Math.atan2(my, mx);
        }

        const x = Math.cos(angle) * R;
        const y = Math.sin(angle) * R;

        // 축
        p.stroke(60);
        p.strokeWeight(1);
        p.line(-R - 40, 0, R + 40, 0);
        p.line(0, -R - 40, 0, R + 40);

        // 단위원
        p.noFill();
        p.stroke(80);
        p.strokeWeight(1);
        p.circle(0, 0, R * 2);

        // 호 (각도 표시)
        p.stroke(255, 255, 100, 120);
        p.strokeWeight(2);
        p.noFill();
        p.arc(0, 0, 60, 60, 0, angle % p.TWO_PI);

        // cos 선 (x 성분) — 가로
        p.stroke(100, 200, 255);
        p.strokeWeight(3);
        p.line(0, y, x, y);

        // sin 선 (y 성분) — 세로
        p.stroke(255, 120, 100);
        p.strokeWeight(3);
        p.line(x, 0, x, y);

        // 빗변 (반지름)
        p.stroke(255, 255, 255, 150);
        p.strokeWeight(2);
        p.line(0, 0, x, y);

        // 원 위의 점
        p.fill(255);
        p.noStroke();
        p.circle(x, y, 14);

        // 축 위 투영 점
        p.fill(100, 200, 255);
        p.circle(x, 0, 10);
        p.fill(255, 120, 100);
        p.circle(0, y, 10);

        // 레이블
        p.noStroke();
        p.textSize(14);
        p.textAlign(p.CENTER);

        p.fill(100, 200, 255);
        p.text(`cos = ${(x / R).toFixed(2)}`, x, -16);

        p.fill(255, 120, 100);
        p.text(`sin = ${(y / R).toFixed(2)}`, -50, y + 5);

        p.fill(255, 255, 100);
        p.textSize(13);
        const deg = (((angle % p.TWO_PI) * 180) / Math.PI).toFixed(0);
        p.text(`θ = ${deg}°`, 46, -10);

        p.fill(255, 200);
        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text(`x = cos(θ) × r`, -R - 30, R + 30);
        p.text(`y = sin(θ) × r`, -R - 30, R + 50);
    };
}
