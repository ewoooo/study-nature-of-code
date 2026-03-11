import { fetchMeta, getMeta, saveMeta } from "/ui/meta.js";
import { renderList } from "/ui/list.js";
import { sketchNames, loadSketch, showList } from "/ui/sketch-loader.js";
import { initRouter } from "/ui/router.js";

const listView = document.getElementById("list-view");
const sketchView = document.getElementById("sketch-view");
const sketchList = document.getElementById("sketch-list");
const canvasContainer = document.getElementById("canvas-container");
const backBtn = document.getElementById("back-btn");
const editBtn = document.getElementById("edit-btn");
const addBtn = document.getElementById("add-btn");

let editMode = false;
const views = { listView, sketchView, canvasContainer };

function render() {
    renderList({
        meta: getMeta(),
        sketchNames,
        editMode,
        listEl: sketchList,
        onSave: async () => {
            try {
                await saveMeta(sketchList);
                editMode = false;
                editBtn.textContent = "Edit";
                render();
            } catch {
                alert("저장에 실패했습니다.");
            }
        },
        onCancel: () => {
            editMode = false;
            editBtn.textContent = "Edit";
            render();
        },
    });
}

editBtn.addEventListener("click", () => {
    editMode = !editMode;
    editBtn.textContent = editMode ? "Cancel" : "Edit";
    render();
});

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
    showList(views);
});

// Init
fetchMeta().then(() => {
    render();
    initRouter(
        (name) => loadSketch(name, views),
        () => showList(views),
    );
});
