import { slider } from "../ui/sliders";

export default function sketch(p) {
    const CANVAS = 500;
    const BACKGROUND_COLOR = 0;

    class Particle {
        constructor() {
            this.pos = p.createVector(p.random(CANVAS), p.random(CANVAS));
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.maxspeed = 2;
        }
        follow(vectors) {
            const x = Math.floor(this.pos.x / scl);
            const y = Math.floor(this.pos.y / scl);
            const index = x + y * cols;
            const force = vectors[index];
            this.applyForce(force);
        }

        update() {
            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        applyForce(force) {
            this.acc.add(force);
        }

        show() {
            p.stroke(255);
            p.strokeWeight(4);
            p.point(this.pos.x, this.pos.y);
        }

        edges() {
            if (this.pos.x > CANVAS) this.pos.x = 0;
            if (this.pos.x < 0) this.pos.x = CANVAS;
            if (this.pos.y > CANVAS) this.pos.y = 0;
            if (this.pos.y < 0) this.pos.y = CANVAS;
        }
    }

    let cols, rows;
    let scl = 20;
    let inc = 0.1;
    let t = 0;

    let particles = [];
    let flowfield = [];
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
        for (let y = 0; y < cols; y++) {
            for (let x = 0; x < rows; x++) {
                const index = x + y * cols;
                const angle =
                    p.noise(x * inc, y * inc + t * 0.05, t * 0.05) * p.TWO_PI;
                const v = p.constructor.Vector.fromAngle(angle);
                v.setMag(0.001);
                flowfield[index] = v;
                p.push();
                p.translate(x * scl, y * scl);
                p.rotate(v.heading());
                p.stroke(155);
                p.strokeWeight(1);
                p.line(0, 0, scl, 0);
                p.pop();
            }
        }
        t += inc;

        for (let particle of particles) {
            particle.follow(flowfield);
            particle.update();
            particle.show();
            particle.edges();
        }
    };
}
