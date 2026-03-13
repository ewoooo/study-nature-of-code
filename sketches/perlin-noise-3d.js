export default function sketch(p) {
    const CANVAS = 600;
    const BACKGROUND_COLOR = 0;

    let cols, rows;
    let scl = 20;
    let t = 0; // 시간 변수
    let lvl = 0.1; // 레벨 변수 (Z축 높이)
    let terrain = [];

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS, p.WEBGL);
        p.background(BACKGROUND_COLOR);
        cols = CANVAS / scl;
        rows = CANVAS / scl;
        terrain = Array.from({ length: rows + 1 }, () => Array(cols).fill(0));
        for (let y = 0; y <= rows; y++) {
            for (let x = 0; x < cols; x++) {
                terrain[y][x] = 0;
            }
        }
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        p.stroke(255);
        p.fill(0);

        p.translate(-CANVAS / 2, 0);
        p.rotateX(p.PI / 3); // X축으로 회전

        for (let y = 0; y < rows; y++) {
            p.beginShape(p.TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                const nz = p.noise(x * lvl + t, y * lvl + t) * 100;
                terrain[y][x] = nz;
                p.vertex(x * scl, y * scl, terrain[y][x]); // Z값에 펄린 노이즈 추가
                p.vertex(x * scl, (y + 1) * scl, terrain[y + 1][x]);
            }
            p.endShape();
        }

        t += 0.01; // 시간 증가 (노이즈 애니메이션 효과)
    };
}
