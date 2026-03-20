export default function sketch(p) {
    const CANVAS = 800;
    const HALF = CANVAS / 2;
    const FRAME_RATE = 60;
    const BACKGROUND_COLOR = 0;
    let time = 0;
    let offset = 0.01;

    function mod(n) {
        return ((n % CANVAS) + CANVAS) % CANVAS;
    }

    class Walker {
        constructor(x = 0, y = 0, { length = 5, size = 1, speed = 1 } = {}) {
            this.points = [];
            this.maxLength = length;
            this.size = size;
            this.speed = speed;
            this.x = x;
            this.y = y;
        }

        move() {
            return [this.x, this.y];
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
        constructor() {
            super(...arguments);
            this.amp = p.randomGaussian(1, 0.2);
        }
        move() {
            const offset = time;
            const dy = p.sin(offset) * this.amp;
            this.y += dy;
            this.x += this.speed;
            return [this.x, this.y];
        }
    }

    class Firefly extends Walker {
        constructor() {
            super(...arguments);
            this.amp = p.randomGaussian(1, 0.2);
            this.dir = p.random() < 0.5 ? -1 : 1;
            this.offset = p.random() * 1000;
        }

        decorate(num) {
            const s = p.map(num, 0, this.points.length - 1, 0, this.size);
            const b = p.map(p.sin(time + this.offset), -1, 1, 0, 255);
            p.strokeWeight(s);
            p.stroke(b);
        }

        move() {
            const noise = p.noise(this.x * 0.1 + this.offset, this.y * 0.1 + this.offset) - 0.5;
            const dx = (p.cos(time + this.offset) + noise) * this.amp * this.dir;
            const dy = (p.sin(time + this.offset) + noise) * this.amp * this.dir;
            this.x += dx;
            this.y += dy;
            return [this.x, this.y];
        }
    }

    class Bug extends Walker {
        constructor() {
            super(...arguments);
            this.amp = p.randomGaussian(0.3, 0.02);
            this.dir = p.random() < 0.5 ? -1 : 1;
        }
        move() {
            const offset = time * this.speed;
            const dx = p.sin(offset) * this.amp * this.dir;
            const dy = p.cos(offset) * this.amp * this.dir;
            this.x += dx;
            this.y += dy;
            return [this.x, this.y];
        }
    }

    class Butterfly extends Walker {
        constructor() {
            super(...arguments);
            this.amp = p.randomGaussian(1, 0.2);
            this.dir = p.random() < 0.5 ? -1 : 1;
            this.angle = 0;
        }

        jump() {
            while (true) {
                const r1 = p.random(1);
                const r2 = p.random(1);
                const k = 1 - r1;
                if (r2 < k) {
                    return r1;
                }
            }
        }

        move() {
            let delta = this.jump();
            if (delta > 0.95) this.angle += delta * 10;

            this.angle += time * 0.01;

            const offset = time * this.speed;
            const noise = p.noise(offset * 30) - 0.5;
            const x = (p.sin(this.angle) + noise) * this.amp * this.dir;
            const y = p.cos(this.angle) * this.amp * this.dir;

            this.x += x;
            this.y += y;

            return [this.x, this.y];
        }
    }

    let birds = [];
    let bugs = [];
    let fireflies = [];
    let butterflies = [];

    p.setup = () => {
        p.createCanvas(CANVAS, CANVAS);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);

        for (let i = 0; i < 6; i++) {
            const cx = p.randomGaussian(0, 10);
            const cy = p.randomGaussian(HALF, 100);
            const length = Math.floor(p.randomGaussian(150, 30));
            const spd = p.randomGaussian(2, 0.1);
            const size = p.randomGaussian(3, 2);
            birds.push(new Bird(cx, cy, { length: length, size: size, speed: spd }));
        }

        for (let i = 0; i < 25; i++) {
            const cx = p.random(CANVAS);
            const cy = p.randomGaussian(HALF, 300);
            const spd = p.randomGaussian(2, 0.1);
            bugs.push(new Bug(cx, cy, { length: 10, size: 1, speed: spd }));
        }

        for (let i = 0; i < 25; i++) {
            const cx = p.randomGaussian(HALF, 300);
            const cy = p.randomGaussian(HALF, 300);
            const length = Math.floor(p.randomGaussian(10, 3));
            fireflies.push(new Firefly(cx, cy, { length: length, size: 1, speed: 10 }));
        }

        for (let i = 0; i < 3; i++) {
            const cx = p.randomGaussian(HALF, 50);
            const cy = p.randomGaussian(HALF, 50);
            const length = Math.floor(p.randomGaussian(50, 3));
            butterflies.push(new Butterfly(cx, cy, { length: length, size: 5, speed: 1 }));
        }
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
        time += offset;

        for (let bird of birds) {
            bird.update();
            bird.render();
        }

        for (let bug of bugs) {
            bug.update();
            bug.render();
        }

        for (let firefly of fireflies) {
            firefly.update();
            firefly.render();
        }

        for (let butterfly of butterflies) {
            butterfly.update();
            butterfly.render();
        }
    };
}
