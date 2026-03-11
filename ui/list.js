import { flattenMeta, allSketchFiles, allCategoryPaths } from "/ui/meta.js";

function escapeAttr(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export function renderList({
    meta,
    sketchNames,
    editMode,
    listEl,
    onSave,
    onCancel,
}) {
    const categorized = new Set(allSketchFiles(meta));
    const uncategorized = sketchNames.filter((s) => !categorized.has(s.file));
    const flat = flattenMeta(meta);

    if (flat.length === 0 && uncategorized.length === 0) {
        listEl.innerHTML =
            '<p class="empty">sketches/ 폴더에 스케치를 추가하세요</p>';
        return;
    }

    const categoryPaths = allCategoryPaths(flat);

    if (editMode) {
        let html = "";
        let lastSection = undefined;
        for (const group of flat) {
            if (group.section && group.section !== lastSection) {
                html += `<h2>${group.section}</h2>`;
                lastSection = group.section;
            }
            const catPath = group.section
                ? `${group.section} / ${group.category}`
                : group.category;
            html += `<h3>${group.category}</h3>`;
            html += group.sketches
                .map(
                    ({ file, title, desc }) =>
                        `<div class="edit-row" data-file="${file}">` +
                        `<input class="edit-title" value="${escapeAttr(title)}" placeholder="Title">` +
                        `<input class="edit-desc" value="${escapeAttr(desc)}" placeholder="Description">` +
                        `<select class="edit-category">${categoryPaths.map((c) => `<option value="${c}"${c === catPath ? " selected" : ""}>${c}</option>`).join("")}</select>` +
                        `</div>`,
                )
                .join("");
        }

        html += `<div class="edit-actions"><button class="save-btn">Save</button><button class="cancel-btn">Cancel</button></div>`;
        listEl.innerHTML = html;

        listEl.querySelector(".save-btn").addEventListener("click", onSave);
        listEl.querySelector(".cancel-btn").addEventListener("click", onCancel);
    } else {
        let html = "";
        let lastSection = undefined;
        for (const group of flat) {
            if (group.section && group.section !== lastSection) {
                html += `<h2>${group.section}</h2>`;
                lastSection = group.section;
            }
            html += `<h3>${group.category}</h3>`;
            html += group.sketches
                .map(
                    ({ file, title, desc }) =>
                        `<a href="#${file}"><span class="sketch-title">${title}</span><span class="sketch-desc">${desc}</span></a>`,
                )
                .join("");
        }

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

        listEl.innerHTML = html;
    }
}
