import p5 from "p5";

const modules = import.meta.glob("./sketches/*.js");

const sketchNames = Object.keys(modules)
    .map((path) => {
        const file = path.replace("./sketches/", "").replace(".js", "");
        return { path, file };
    })
    .sort((a, b) => a.file.localeCompare(b.file));

const listView = document.getElementById("list-view");
const sketchView = document.getElementById("sketch-view");
const sketchList = document.getElementById("sketch-list");
const canvasContainer = document.getElementById("canvas-container");
const backBtn = document.getElementById("back-btn");

let currentP5 = null;

function renderList() {
    if (sketchNames.length === 0) {
        sketchList.innerHTML =
            '<p class="empty">sketches/ 폴더에 스케치를 추가하세요</p>';
        return;
    }
    sketchList.innerHTML = sketchNames
        .map(({ file }) => `<a href="#${file}">${file.replace(/-/g, " ")}</a>`)
        .join("");
}

async function loadSketch(name) {
    const entry = sketchNames.find((s) => s.file === name);
    if (!entry) return;

    if (currentP5) {
        currentP5.remove();
        currentP5 = null;
    }
    canvasContainer.innerHTML = "";

    const mod = await modules[entry.path]();
    const sketchFn = mod.default;

    listView.style.display = "none";
    sketchView.style.display = "flex";
    document.title = `${name.replace(/-/g, " ")} — Nature of Code`;

    currentP5 = new p5(sketchFn, canvasContainer);
}

function showList() {
    if (currentP5) {
        currentP5.remove();
        currentP5 = null;
    }
    canvasContainer.innerHTML = "";
    sketchView.style.display = "none";
    listView.style.display = "block";
    document.title = "Nature of Code — p5.js Sketches";
}

function handleRoute() {
    const hash = location.hash.slice(1);
    if (hash) {
        loadSketch(hash);
    } else {
        showList();
    }
}

backBtn.addEventListener("click", () => {
    history.pushState(null, "", location.pathname);
    showList();
});

window.addEventListener("hashchange", handleRoute);

renderList();
handleRoute();
