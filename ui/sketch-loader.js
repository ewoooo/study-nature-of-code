import p5 from "p5";
import { clearSliders } from "/ui/sliders.js";

const modules = import.meta.glob("../sketches/*.js");

let currentP5 = null;

export const sketchNames = Object.keys(modules).map((path) => {
    const file = path.replace("../sketches/", "").replace(".js", "");
    return { path, file };
});

export async function loadSketch(name, { listView, sketchView, canvasContainer }) {
    const entry = sketchNames.find((s) => s.file === name);
    if (!entry) return;

    if (currentP5) {
        currentP5.remove();
        currentP5 = null;
    }
    canvasContainer.innerHTML = "";
    clearSliders();

    const mod = await modules[entry.path]();
    const sketchFn = mod.default;

    listView.style.display = "none";
    sketchView.style.display = "flex";
    document.title = `${name.replace(/-/g, " ")} — Nature of Code`;

    currentP5 = new p5(sketchFn, canvasContainer);
}

export function showList({ listView, sketchView, canvasContainer }) {
    if (currentP5) {
        currentP5.remove();
        currentP5 = null;
    }
    canvasContainer.innerHTML = "";
    clearSliders();
    sketchView.style.display = "none";
    listView.style.display = "block";
    document.title = "Nature of Code — p5.js Sketches";
}
