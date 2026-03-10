export default function sketch(p) {
    let x, y;

    p.setup = () => {
        p.createCanvas(640, 480);
        x = p.width / 2;
        y = p.height / 2;
        p.background(30);
    };

    p.draw = () => {
        x += p.random(-2, 2);
        y += p.random(-2, 2);
        x = p.constrain(x, 0, p.width);
        y = p.constrain(y, 0, p.height);

        p.stroke(255, 100);
        p.point(x, y);
    };
}
