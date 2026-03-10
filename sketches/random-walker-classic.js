export default function sketch(p) {
    let x, y;

    // basic configuration
    const size = 640;

    class Walker {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        step() {
            const v = Math.floor(p.random(4));
            switch (v) {
                case 0:
                    this.x += stepSize;
                    break;
                case 1:
                    this.x -= stepSize;
                    break;
                case 2:
                    this.y += stepSize;
                    break;
                case 3:
                    this.y -= stepSize;
                    break;
            }
        }

        render() {
            p.point(this.x, this.y);
        }
    }

    const stepSize = 2;
    let walker;

    p.setup = () => {
        p.createCanvas(size, size);
        p.background(255);
        walker = new Walker(p.width / 2, p.height / 2);
    };

    p.draw = () => {
        p.stroke("black");
        p.strokeWeight(stepSize);
        walker.step();
        walker.render();
    };
}
