import fs from "fs";
import path from "path";

export default {
    plugins: [
        {
            name: "create-sketch",
            configureServer(server) {
                server.middlewares.use("/api/create-sketch", (req, res) => {
                    if (req.method !== "POST") {
                        res.statusCode = 405;
                        res.end("Method not allowed");
                        return;
                    }

                    let body = "";
                    req.on("data", (chunk) => (body += chunk));
                    req.on("end", () => {
                        try {
                            const { name } = JSON.parse(body);
                            if (!name || !/^[\w-]+$/.test(name)) {
                                res.statusCode = 400;
                                res.end(
                                    JSON.stringify({ error: "Invalid name" }),
                                );
                                return;
                            }

                            const dir = path.resolve("sketches");
                            if (!fs.existsSync(dir)) fs.mkdirSync(dir);

                            const filePath = path.join(dir, `${name}.js`);
                            if (fs.existsSync(filePath)) {
                                res.statusCode = 409;
                                res.end(
                                    JSON.stringify({ error: "Already exists" }),
                                );
                                return;
                            }

                            const template = `export default function sketch(p) {
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
                            `;

                            fs.writeFileSync(filePath, template);
                            res.setHeader("Content-Type", "application/json");
                            res.end(JSON.stringify({ ok: true, file: name }));
                        } catch {
                            res.statusCode = 400;
                            res.end(JSON.stringify({ error: "Bad request" }));
                        }
                    });
                });
            },
        },
    ],
};
