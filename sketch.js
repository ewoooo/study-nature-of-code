import p5 from "p5";
import { clearSliders } from "/ui/sliders.js";

const modules = import.meta.glob("./sketches/*.js");

const sketchNames = Object.keys(modules).map((path) => {
    const file = path.replace("./sketches/", "").replace(".js", "");
    return { path, file };
});
const listView = document.getElementById("list-view");
const sketchView = document.getElementById("sketch-view");
const sketchList = document.getElementById("sketch-list");
const canvasContainer = document.getElementById("canvas-container");
const backBtn = document.getElementById("back-btn");
const editBtn = document.getElementById("edit-btn");

let currentP5 = null;
let editMode = false;
let sketchMeta = {};

async function fetchMeta() {
    const res = await fetch("/api/sketch-meta");
    sketchMeta = await res.json();
}

function renderList() {
    const categorized = new Set(
        Object.values(sketchMeta)
            .flat()
            .map((s) => s.file),
    );
    const uncategorized = sketchNames.filter((s) => !categorized.has(s.file));

    const entries = Object.entries(sketchMeta);
    if (entries.length === 0 && uncategorized.length === 0) {
        sketchList.innerHTML =
            '<p class="empty">sketches/ 폴더에 스케치를 추가하세요</p>';
        return;
    }

    const categories = Object.keys(sketchMeta);

    if (editMode) {
        let html = entries
            .map(
                ([category, sketches]) =>
                    `<h3>${category}</h3>` +
                    sketches
                        .map(
                            ({ file, title, desc }) =>
                                `<div class="edit-row" data-file="${file}">` +
                                `<input class="edit-title" value="${escapeAttr(title)}" placeholder="Title">` +
                                `<input class="edit-desc" value="${escapeAttr(desc)}" placeholder="Description">` +
                                `<select class="edit-category">${categories.map((c) => `<option value="${c}"${c === category ? " selected" : ""}>${c}</option>`).join("")}</select>` +
                                `</div>`,
                        )
                        .join(""),
            )
            .join("");

        html += `<div class="edit-actions"><button class="save-btn">Save</button><button class="cancel-btn">Cancel</button></div>`;
        sketchList.innerHTML = html;

        sketchList
            .querySelector(".save-btn")
            .addEventListener("click", saveMeta);
        sketchList
            .querySelector(".cancel-btn")
            .addEventListener("click", cancelEdit);
    } else {
        let html = entries
            .map(
                ([category, sketches]) =>
                    `<h3>${category}</h3>` +
                    sketches
                        .map(
                            ({ file, title, desc }) =>
                                `<a href="#${file}"><span class="sketch-title">${title}</span><span class="sketch-desc">${desc}</span></a>`,
                        )
                        .join(""),
            )
            .join("");

        if (uncategorized.length > 0) {
            html +=
                `<h3>Uncategorized</h3>` +
                uncategorized
                    .map(
                        ({ file }) =>
                            `<a href="#${file}"><span class="sketch-title">${file.replace(/-/g, " ")}</span></a>`,
                    )
                    .join("");
        }

        sketchList.innerHTML = html;
    }
}

function escapeAttr(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

async function saveMeta() {
    const rows = sketchList.querySelectorAll(".edit-row");
    const newMeta = {};

    rows.forEach((row) => {
        const file = row.dataset.file;
        const title = row.querySelector(".edit-title").value.trim();
        const desc = row.querySelector(".edit-desc").value.trim();
        const category = row.querySelector(".edit-category").value;

        if (!newMeta[category]) newMeta[category] = [];
        newMeta[category].push({ file, title, desc });
    });

    const res = await fetch("/api/sketch-meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeta),
    });

    if (res.ok) {
        sketchMeta = newMeta;
        editMode = false;
        editBtn.textContent = "Edit";
        renderList();
    } else {
        alert("저장에 실패했습니다.");
    }
}

function cancelEdit() {
    editMode = false;
    editBtn.textContent = "Edit";
    renderList();
}

editBtn.addEventListener("click", () => {
    editMode = !editMode;
    editBtn.textContent = editMode ? "Cancel" : "Edit";
    renderList();
});

async function loadSketch(name) {
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

function showList() {
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

function handleRoute() {
    const hash = location.hash.slice(1);
    if (hash) {
        loadSketch(hash);
    } else {
        showList();
    }
}

const addBtn = document.getElementById("add-btn");

addBtn.addEventListener("click", async () => {
    const name = prompt("스케치 이름을 입력하세요 (예: bouncing-ball)");
    if (!name) return;

    const res = await fetch("/api/create-sketch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    const data = await res.json();

    if (!res.ok) {
        alert(
            data.error === "Already exists"
                ? "이미 존재하는 이름입니다."
                : data.error,
        );
        return;
    }

    alert(`${name}.js 생성 완료! 페이지를 새로고침합니다.`);
    location.reload();
});

backBtn.addEventListener("click", () => {
    history.pushState(null, "", location.pathname);
    showList();
});

window.addEventListener("hashchange", handleRoute);

// Init: fetch meta then render
fetchMeta().then(() => {
    renderList();
    handleRoute();
});
