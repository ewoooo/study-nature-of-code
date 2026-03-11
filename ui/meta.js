let sketchMeta = {};

export async function fetchMeta() {
    const res = await fetch("/api/sketch-meta");
    sketchMeta = await res.json();
}

export function getMeta() {
    return sketchMeta;
}

// 중첩 구조를 플랫한 [section, category, sketches[]] 목록으로 변환
export function flattenMeta(meta) {
    const result = [];
    for (const [key, value] of Object.entries(meta)) {
        if (Array.isArray(value)) {
            result.push({ section: null, category: key, sketches: value });
        } else {
            for (const [subKey, arr] of Object.entries(value)) {
                result.push({ section: key, category: subKey, sketches: arr });
            }
        }
    }
    return result;
}

// 모든 스케치 파일명 추출
export function allSketchFiles(meta) {
    return flattenMeta(meta).flatMap((g) => g.sketches.map((s) => s.file));
}

// 편집용 카테고리 목록 (section/category 결합 경로)
export function allCategoryPaths(flat) {
    return flat.map((g) =>
        g.section ? `${g.section} / ${g.category}` : g.category,
    );
}

export async function saveMeta(listEl) {
    const rows = listEl.querySelectorAll(".edit-row");
    const newMeta = {};

    rows.forEach((row) => {
        const file = row.dataset.file;
        const title = row.querySelector(".edit-title").value.trim();
        const desc = row.querySelector(".edit-desc").value.trim();
        const catPath = row.querySelector(".edit-category").value;

        // "Section / Category" 형식이면 중첩 구조로 복원
        if (catPath.includes(" / ")) {
            const [section, category] = catPath.split(" / ");
            if (!newMeta[section]) newMeta[section] = {};
            if (!newMeta[section][category]) newMeta[section][category] = [];
            newMeta[section][category].push({ file, title, desc });
        } else {
            if (!newMeta[catPath]) newMeta[catPath] = [];
            newMeta[catPath].push({ file, title, desc });
        }
    });

    const res = await fetch("/api/sketch-meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeta),
    });

    if (!res.ok) throw new Error("저장에 실패했습니다.");

    sketchMeta = newMeta;
    return newMeta;
}
