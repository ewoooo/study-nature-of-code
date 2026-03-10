export default function sketch(p) {
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 120;
    const BACKGROUND_COLOR = 0;

    class Walker {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        step(coord) {
            const blob = 0.15;
            const num = Math.random();
            if (blob && num < blob) this.chase(coord);
            else this.move();
        }

        chase(coord) {
            const [cx, cy] = coord;
            const dx = cx - this.x;
            const dy = cy - this.y;

            if (Math.random() < 0.5 && dx !== 0) {
                this.x += Math.sign(dx);
            } else if (dy !== 0) {
                this.y += Math.sign(dy);
            } else {
                this.x += Math.sign(dx);
            }
        }

        move() {
            const x = Math.floor(Math.random() * 3) - 1;
            const y = Math.floor(Math.random() * 3) - 1;
            this.x += x;
            this.y += y;
        }
    }

    let walker;
    let mCoord;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        walker = new Walker(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    };
    p.draw = () => {
        mCoord = [p.mouseX, p.mouseY];
        walker.step(mCoord);

        p.stroke("white");
        p.strokeWeight(2);
        p.point(walker.x, walker.y);
    };
}
