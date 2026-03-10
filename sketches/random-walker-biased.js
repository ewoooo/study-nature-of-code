export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 30;
    const BACKGROUND_COLOR = 0;

    class Walker {
        constructor() {
            this.x = CANVAS_SIZE / 2;
            this.y = CANVAS_SIZE / 2;
            this.m = "idle";
        }

        calc() {
            const num = Number(p.random().toFixed(2));
            return num;
        }

        step() {
            const num = this.calc();

            if (num <= 0.4) {
                this.x--;
                this.m = "L";
            } else if (num <= 0.6) {
                this.x++;
                this.m = "R";
            } else if (num <= 0.8) {
                this.y--;
                this.m = "U";
            } else {
                this.y++;
                this.m = "D";
            }
        }

        monitor() {
            p.text(
                `x: ${this.x.toFixed(0)}, y: ${this.y.toFixed(0)}, m: ${this.m}`,
                50,
                50,
            );
        }
    }

    let walker;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        walker = new Walker();
    };
    p.draw = () => {
        p.stroke(255);
        p.strokeWeight(2);
        walker.step();
        p.point(walker.x, walker.y);

        p.strokeWeight(0.5);
        p.fill(BACKGROUND_COLOR);
        p.rect(40, 30, 120, 30);
        p.noStroke();
        p.fill("white");
        walker.monitor();
    };
}
