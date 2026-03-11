export default function sketch(p) {
                                const CANVAS_SIZE = 600;
                                const FRAME_RATE = 30;
                                const BACKGROUND_COLOR = 0;
                                p.setup = () => {
                                    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
                                    p.frameRate(FRAME_RATE);
                                    p.background(BACKGROUND_COLOR);
                                };
                                p.draw = () => {

                                };
                            }
                            