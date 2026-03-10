export default function sketch(p) {
    // Basic Configuration
    const CANVAS_SIZE = 600;
    const FRAME_RATE = 10;
    const BACKGROUND_COLOR = 0;
    const COUNT = 20;
    let entry;

    p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(FRAME_RATE);
        p.background(BACKGROUND_COLOR);
        entry = Array.from({ length: COUNT }, (_, i) => 0);
        console.log(entry);
    };
    p.draw = () => {
        const index = parseInt(p.random(entry.length));
        const barWidth = CANVAS_SIZE / COUNT;
        entry[index]++;

        // Display
        for (let i = 0; i < entry.length; i++) {
            console.log(entry[i]);
            p.rect(i * barWidth, CANVAS_SIZE - entry[i], barWidth, entry[i]);
        }
    };
}
