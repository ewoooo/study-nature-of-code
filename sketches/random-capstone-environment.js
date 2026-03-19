export default function sketch(p) {
    const CANVAS = 600;
    const HALF = CANVAS / 2;
    const FRAME_RATE = 60;
    const BACKGROUND_COLOR = 0;
    let time = 0;
    let offset = 5;

    function mod(n) {
        return ((n % CANVAS) + CANVAS) % CANVAS;
    }

    class Walker {
        constructor(maxLength = 100, size = 5, speed = 1) {
            this.points = [];
            this.maxLength = maxLength;
            this.size = size;
            this.speed = speed;
        }
        move() {
            const x = time * this.speed;
            const y = time * this.speed;
            return [x, y];
        }

        get isFull() {
            return this.points.length >= this.maxLength;
        }

        update() {
            if (this.isFull) this.points.shift();
            this.points.push(this.detectBorder(this.move()));
        }

        detectBorder([x, y]) {
            return [mod(x), mod(y)];
        }

        decorate(num) {
            const s = p.map(num, 0, this.points.length - 1, 0, this.size);
            const b = p.map(num, 0, this.points.length - 1, 0, 255);
            p.strokeWeight(s);
            p.stroke(b);
        }

        render() {
            if (this.points.length < 2) return;

            for (let i = 0; i < this.points.length; i++) {
                this.decorate(i);
                let [x2, y2] = this.points[i];
                let [x1, y1] = this.points[i - 1] || [x2, y2];
                if (p.dist(x1, y1, x2, y2) > HALF) [x1, y1] = [x2, y2];
                p.line(x1, y1, x2, y2);
            }
        }
    }

    class Bird extends Walker {
        constructor(maxLength, size, speed) {
            super(maxLength, size, speed);
        }

        move() {
            const x = HALF + time;
            const y = p.sin(time * this.speed) * HALF + CANVAS;
            return [x, y];
        }
    }

    class Butterfly extends Walker {
        constructor(maxLength, size, speed) {
            super(maxLength, size, speed);
        }

        move() {
            const x = HALF + time;
            const y = p.noise(p.sin(time * 0.001)) * CANVAS;
            return [x, y];
        }
    }

    let butterfly = new Butterfly(100, 5, 0.001);
    let bird = new Bird(100, 2, 0.002);

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        p.strokeWeight(5);
        p.stroke(255);
        time += offset;

        butterfly.update();
        bird.update();

        butterfly.render();
        bird.render();
    };
}
