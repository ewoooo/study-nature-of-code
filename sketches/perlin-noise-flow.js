import { slider } from "../ui/sliders";

export default function sketch(p) {
    const CANVAS = 500;
    const BACKGROUND_COLOR = 0;

    // 바람에 떠다니는 점 하나하나를 나타내는 클래스
    class Particle {
        constructor() {
            // 캔버스 위 랜덤한 위치에서 시작
            this.pos = p.createVector(p.random(CANVAS), p.random(CANVAS));
            this.vel = p.createVector(0, 0); // 속도 (처음엔 정지)
            this.acc = p.createVector(0, 0); // 가속도 (외부 힘이 여기에 쌓임)
            this.maxspeed = 2; // 최대 속도 제한
        }

        // 현재 위치에 해당하는 flow field 격자의 벡터를 힘으로 적용
        follow(vectors) {
            // 픽셀 좌표 → 격자 인덱스로 변환 (예: 75px / 20 = 3번째 칸)
            const x = Math.floor(this.pos.x / scl);
            const y = Math.floor(this.pos.y / scl);
            const index = x + y * cols; // 2D 격자를 1D 배열 인덱스로 변환
            const force = vectors[index];
            this.applyForce(force);
        }

        update() {
            this.vel.add(this.acc); // 가속도 → 속도에 반영
            this.vel.limit(this.maxspeed); // 너무 빨라지지 않게 제한
            this.pos.add(this.vel); // 속도 → 위치에 반영
            this.acc.mult(0); // 가속도 초기화 (매 프레임 새로 받기 위해)
        }

        applyForce(force) {
            this.acc.add(force); // 외부 힘을 가속도에 누적
        }

        show() {
            p.stroke(255);
            p.strokeWeight(4);
            p.point(this.pos.x, this.pos.y);
        }

        // 화면 밖으로 나가면 반대편에서 다시 나타남 (무한 반복 효과)
        edges() {
            if (this.pos.x > CANVAS) this.pos.x = 0;
            if (this.pos.x < 0) this.pos.x = CANVAS;
            if (this.pos.y > CANVAS) this.pos.y = 0;
            if (this.pos.y < 0) this.pos.y = CANVAS;
        }
    }

    let cols, rows; // flow field 격자의 열/행 수
    let scl = 10; // 격자 한 칸의 크기 (px)
    let inc = 0.1; // 펄린 노이즈 입력 간격 (작을수록 부드러운 흐름)
    let t = 0; // 시간값 (노이즈에 전달해서 흐름이 서서히 변하게 함)

    let particles = [];
    let flowfield = []; // 각 격자 칸마다 방향 벡터를 저장하는 배열
    let mag;

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.background(BACKGROUND_COLOR);
        rows = Math.floor(p.height / scl);
        cols = Math.floor(p.width / scl);

        mag = slider("Magnitude", 0.001, 0.001, 10);
        flowfield = new Array(rows * cols);
        for (let i = 0; i < 1000; i++) particles.push(new Particle());
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        p.stroke(255);

        // 1) flow field 그리기: 각 격자 칸마다 펄린 노이즈로 방향을 정하고 화살표로 표시
        for (let y = 0; y < cols; y++) {
            for (let x = 0; x < rows; x++) {
                const index = x + y * cols;

                // 펄린 노이즈로 각도 생성 (0 ~ TWO_PI)
                const angle =
                    p.noise(x * inc, y * inc + t * 0.05, t * 0.05) * p.TWO_PI;

                // 각도를 벡터로 변환하고 크기(세기) 설정
                const v = p.constructor.Vector.fromAngle(angle);
                v.setMag(0.001); // 값이 작을수록 파티클에 주는 힘이 약함

                flowfield[index] = v; // 이 칸의 바람 방향 저장

                // 격자 위에 방향 선 그리기 (시각화용)
                p.push();
                p.translate(x * scl, y * scl);
                p.rotate(v.heading());
                p.stroke(55);
                p.strokeWeight(1);
                p.line(0, 0, scl, 0);
                p.pop();
            }
        }
        t += inc; // 시간 흐름 → 노이즈 입력이 바뀌면서 바람 방향이 서서히 변함

        // 2) 파티클 업데이트: 현재 위치의 바람을 받고 → 이동하고 → 그리기
        for (let particle of particles) {
            particle.follow(flowfield); // 현재 칸의 바람 방향을 힘으로 받음
            particle.update(); // 힘 → 속도 → 위치 반영
            particle.show(); // 화면에 점으로 표시
            particle.edges(); // 화면 밖이면 반대편으로 이동
        }
    };
}
