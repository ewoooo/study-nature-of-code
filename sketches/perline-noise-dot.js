import { slider } from "../ui/sliders";

export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 120;
    const BACKGROUND_COLOR = 0;
    const LINE_ALPHA = 60;
    const DOT_ALPHA = 180;
    const DOT_SIZE = 10;
    const DOT_SPACING = 20;

    let t;
    let pow;
    let spd;
    let yValues;

    function sampleNoiseCurve() {
        // 2D noise를 사용해서 x 위치와 시간 t를 함께 입력한다.
        // 첫 번째 축은 시간에 따라 흐르고, 두 번째 축은 x 위치에 따라 변한다.
        for (let x = 0; x < CANVAS_SIZE; x++) {
            yValues[x] =
                p.noise(x * pow.value + t, x * pow.value) * CANVAS_SIZE;
        }
    }

    function drawNoiseLine() {
        p.noFill();
        p.stroke(255, 255, 255, LINE_ALPHA);
        p.beginShape();
        for (let x = 0; x < CANVAS_SIZE; x++) {
            p.vertex(x, yValues[x]);
        }
        p.endShape();
    }

    function drawNoiseDots() {
        p.noFill();
        p.stroke(255, 255, 255, DOT_ALPHA);
        for (let x = 0; x < CANVAS_SIZE; x++) {
            if (x % DOT_SPACING === 0 && x >= DOT_SPACING) {
                p.circle(x, yValues[x], DOT_SIZE);
            }
        }
    }

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        pow = slider("power", 0.01, 0.01, 1, 0.01);
        spd = slider("speed", 0.01, 0.01, 1, 0.01);

        t = 0;
        // 매 프레임 새 배열을 만들지 않고 숫자 버퍼를 재사용한다.
        yValues = new Float32Array(CANVAS_SIZE);
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);

        sampleNoiseCurve();
        drawNoiseLine();
        drawNoiseDots();

        t += spd.value;
    };
}
