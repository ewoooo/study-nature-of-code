import fs from "fs";
import path from "path";

export default {
    plugins: [
        {
            name: "create-sketch",
            configureServer(server) {
                server.middlewares.use("/api/sketch-meta", (req, res) => {
                    const metaPath = path.resolve("sketch-meta.json");

                    if (req.method === "GET") {
                        const data = fs.readFileSync(metaPath, "utf-8");
                        res.setHeader("Content-Type", "application/json");
                        res.end(data);
                        return;
                    }

                    if (req.method === "PUT") {
                        let body = "";
                        req.on("data", (chunk) => (body += chunk));
                        req.on("end", () => {
                            try {
                                const parsed = JSON.parse(body);
                                fs.writeFileSync(
                                    metaPath,
                                    JSON.stringify(parsed, null, 4) + "\n",
                                );
                                res.setHeader(
                                    "Content-Type",
                                    "application/json",
                                );
                                res.end(JSON.stringify({ ok: true }));
                            } catch {
                                res.statusCode = 400;
                                res.end(
                                    JSON.stringify({ error: "Invalid JSON" }),
                                );
                            }
                        });
                        return;
                    }

                    res.statusCode = 405;
                    res.end("Method not allowed");
                });

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
                            `;

                            fs.writeFileSync(filePath, template);

                            // Add to sketch-meta.json under Uncategorized
                            const metaPath = path.resolve("sketch-meta.json");
                            const meta = JSON.parse(
                                fs.readFileSync(metaPath, "utf-8"),
                            );
                            if (!meta["Uncategorized"])
                                meta["Uncategorized"] = [];
                            const title = name.replace(/-/g, " ");
                            meta["Uncategorized"].push({
                                file: name,
                                title,
                                desc: "",
                            });
                            fs.writeFileSync(
                                metaPath,
                                JSON.stringify(meta, null, 4) + "\n",
                            );

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
