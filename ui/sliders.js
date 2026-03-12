const sliders = new Map();
let container = null;
let activationFrame = null;

function getContainer() {
    if (container) return container;

    container = document.getElementById("slider-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "slider-container";
        document.getElementById("sketch-view").appendChild(container);
    }

    return container;
}

function setContainerActive(isActive) {
    getContainer().classList.toggle("isActive", isActive);
    return container;
}

function scheduleContainerActivation() {
    if (activationFrame !== null) cancelAnimationFrame(activationFrame);

    activationFrame = requestAnimationFrame(() => {
        activationFrame = requestAnimationFrame(() => {
            setContainerActive(true);
            activationFrame = null;
        });
    });
}

/**
 * 슬라이더를 생성하거나 기존 슬라이더를 반환합니다.
 * @param {string} label - 슬라이더 이름
 * @param {number} defaultValue - 기본값
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @param {number} [step=0.01] - 스텝
 * @returns {{ value: number }} - .value로 현재 값을 읽을 수 있는 객체
 */
export function slider(label, defaultValue, min, max, step = 0.01) {
    if (sliders.has(label)) return sliders.get(label);

    const state = { value: defaultValue };

    const wrap = document.createElement("div");
    wrap.className = "slider-row";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;

    const valueEl = document.createElement("span");
    valueEl.className = "slider-value";
    valueEl.textContent = defaultValue;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = defaultValue;

    input.addEventListener("input", () => {
        state.value = parseFloat(input.value);
        valueEl.textContent = state.value;
    });

    wrap.append(labelEl, input, valueEl);
    getContainer().append(wrap);
    scheduleContainerActivation();

    sliders.set(label, state);
    return state;
}

/** 스케치 전환 시 슬라이더를 모두 제거합니다. */
export function clearSliders() {
    sliders.clear();

    if (activationFrame !== null) {
        cancelAnimationFrame(activationFrame);
        activationFrame = null;
    }

    if (container) {
        setContainerActive(false);
        container.innerHTML = "";
    }
}
