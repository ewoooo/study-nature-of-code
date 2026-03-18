export default function sketch(p) {
                                const CANVAS = 600;
                                const HALF = CANVAS / 2;
                                const FRAME_RATE = 30;
                                const BACKGROUND_COLOR = 0;

                                p.setup = () => {
                                    p.createCanvas(CANVAS, CANVAS);
                                    p.frameRate(FRAME_RATE);
                                    p.background(BACKGROUND_COLOR);
                                };

                                p.draw = () => {

                                };
                            }
                            