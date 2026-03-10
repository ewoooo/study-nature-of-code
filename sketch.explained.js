// p5.js 라이브러리를 npm 패키지에서 ES모듈 방식으로 가져온다
// p5는 크리에이티브 코딩(그래픽, 애니메이션)을 위한 라이브러리
import p5 from "p5";

// import.meta.glob()은 Vite 전용 기능이다
// sketches/ 폴더 안의 모든 .js 파일을 자동으로 찾아서 객체로 만든다
// 결과 예시: { "./sketches/00-random-walker.js": () => import("..."), ... }
// 값은 함수이며, 호출하면 그때 파일을 로드한다 (lazy loading, 지연 로딩)
const modules = import.meta.glob("./sketches/*.js");

// Object.keys(modules)로 경로 문자열 배열을 얻는다
// 예: ["./sketches/00-random-walker.js", "./sketches/01-vectors.js"]
const sketchNames = Object.keys(modules)
	// .map()은 배열의 각 요소를 변환하여 새 배열을 만든다
	.map((path) => {
		// 경로에서 폴더명과 확장자를 제거하여 파일명만 추출한다
		// "./sketches/00-random-walker.js" → "00-random-walker"
		const file = path.replace("./sketches/", "").replace(".js", "");
		// 원본 경로(path)와 정리된 파일명(file)을 객체로 묶어서 반환한다
		return { path, file };
	})
	// .sort()로 파일명 기준 알파벳순 정렬한다
	// localeCompare()는 문자열을 자연스러운 순서로 비교하는 메서드
	.sort((a, b) => a.file.localeCompare(b.file));

// document.getElementById()로 HTML에 미리 만들어둔 요소들을 JS 변수에 연결한다
// listView: 스케치 목록을 보여주는 전체 화면 영역
const listView = document.getElementById("list-view");
// sketchView: 스케치가 실행되는 화면 영역
const sketchView = document.getElementById("sketch-view");
// sketchList: 목록 링크들이 들어갈 <nav> 요소
const sketchList = document.getElementById("sketch-list");
// canvasContainer: p5 캔버스가 삽입될 <div> 요소
const canvasContainer = document.getElementById("canvas-container");
// backBtn: 목록으로 돌아가는 "← Back" 버튼
const backBtn = document.getElementById("back-btn");

// 현재 실행 중인 p5 인스턴스를 저장하는 변수
// 스케치 전환 시 이전 인스턴스를 정리(remove)하기 위해 필요하다
// let으로 선언했으므로 값을 나중에 바꿀 수 있다 (const는 불가)
let currentP5 = null;

// 스케치 목록을 HTML로 렌더링하는 함수
function renderList() {
	// 스케치 파일이 하나도 없으면 안내 메시지를 표시한다
	if (sketchNames.length === 0) {
		// innerHTML은 요소 안의 HTML을 통째로 교체한다
		sketchList.innerHTML =
			'<p class="empty">sketches/ 폴더에 스케치를 추가하세요</p>';
		// return으로 함수를 여기서 끝낸다 (아래 코드 실행 안 함)
		return;
	}
	// 스케치 배열을 <a> 태그 문자열로 변환하여 목록을 만든다
	sketchList.innerHTML = sketchNames
		// 각 스케치를 링크로 변환한다
		// 구조분해: ({ file })은 객체에서 file 속성만 꺼낸다
		// 템플릿 리터럴(``)로 HTML 문자열을 만든다
		// href="#00-random-walker" → 클릭하면 URL 해시가 바뀐다
		// .replace(/-/g, " ") → 정규식으로 모든 하이픈(-)을 공백으로 바꾼다
		//   g 플래그 = global, 첫 번째만이 아니라 전부 치환
		.map(({ file }) => `<a href="#${file}">${file.replace(/-/g, " ")}</a>`)
		// .join("")은 배열을 하나의 문자열로 합친다 (구분자 없이)
		.join("");
}

// 특정 스케치를 로드하여 실행하는 함수
// async 키워드: 이 함수 안에서 await(비동기 대기)를 사용할 수 있게 한다
// name 매개변수: 로드할 스케치의 파일명 (예: "00-random-walker")
async function loadSketch(name) {
	// .find()는 배열에서 조건에 맞는 첫 번째 요소를 찾는다
	// 이름이 일치하는 스케치 정보 객체를 찾는다
	const entry = sketchNames.find((s) => s.file === name);
	// 해당 이름의 스케치가 없으면 아무것도 하지 않고 종료한다
	if (!entry) return;

	// 이미 실행 중인 p5 인스턴스가 있으면 정리한다
	if (currentP5) {
		// .remove()는 p5 인스턴스가 만든 캔버스, 이벤트 리스너 등을 모두 제거한다
		currentP5.remove();
		// 참조를 null로 초기화한다 (메모리 정리)
		currentP5 = null;
	}
	// 캔버스 컨테이너의 내용을 비운다 (혹시 남아있는 요소 제거)
	canvasContainer.innerHTML = "";

	// modules[entry.path]는 함수이다 — 호출하면 해당 JS 파일을 동적으로 import한다
	// await로 파일 로드가 완료될 때까지 기다린다
	// mod는 로드된 모듈 객체이다
	const mod = await modules[entry.path]();
	// 스케치 파일에서 export default로 내보낸 함수를 가져온다
	const sketchFn = mod.default;

	// 목록 화면을 숨긴다 (display: none → 화면에서 완전히 사라짐)
	listView.style.display = "none";
	// 스케치 화면을 보여준다 (display: flex → flexbox 레이아웃으로 표시)
	sketchView.style.display = "flex";
	// 브라우저 탭 제목을 현재 스케치 이름으로 변경한다
	document.title = `${name.replace(/-/g, " ")} — Nature of Code`;

	// p5 인스턴스 모드로 스케치를 실행한다
	// 첫 번째 인자: 스케치 함수 (setup, draw 등을 정의하는 함수)
	// 두 번째 인자: 캔버스를 넣을 부모 DOM 요소
	// new 키워드로 p5 인스턴스를 생성하면 즉시 setup()이 호출되고 draw() 루프가 시작된다
	currentP5 = new p5(sketchFn, canvasContainer);
}

// 스케치를 종료하고 목록 화면으로 돌아가는 함수
function showList() {
	// 실행 중인 p5 인스턴스가 있으면 제거한다
	if (currentP5) {
		currentP5.remove();
		currentP5 = null;
	}
	// 캔버스 컨테이너를 비운다
	canvasContainer.innerHTML = "";
	// 스케치 화면을 숨기고
	sketchView.style.display = "none";
	// 목록 화면을 표시한다
	listView.style.display = "block";
	// 탭 제목을 기본값으로 되돌린다
	document.title = "Nature of Code — p5.js Sketches";
}

// URL 해시(#뒤의 값)를 읽어서 어떤 화면을 보여줄지 결정하는 함수
// 이것이 간단한 "해시 라우터" 역할을 한다 (페이지 새로고침 없이 화면 전환)
function handleRoute() {
	// location.hash는 "#00-random-walker" 형태이다
	// .slice(1)로 앞의 "#"을 제거한다 → "00-random-walker"
	const hash = location.hash.slice(1);
	// 해시 값이 있으면 해당 스케치를 로드한다
	if (hash) {
		loadSketch(hash);
	// 해시 값이 없으면 (빈 문자열 = falsy) 목록을 보여준다
	} else {
		showList();
	}
}

// "← Back" 버튼에 클릭 이벤트를 등록한다
// addEventListener("이벤트명", 콜백함수)는 이벤트 발생 시 콜백을 실행한다
// () => {} 는 화살표 함수 (arrow function) 문법이다
backBtn.addEventListener("click", () => {
	// history.pushState()는 URL을 변경하되 페이지를 새로고침하지 않는다
	// 해시(#...)를 제거하고 기본 경로만 남긴다
	// 이렇게 하면 hashchange 이벤트가 발생하지 않아서 직접 showList()를 호출한다
	history.pushState(null, "", location.pathname);
	showList();
});

// URL 해시가 변경될 때마다 handleRoute를 실행한다
// 예: 목록에서 링크 클릭, 브라우저 뒤로가기/앞으로가기 등
window.addEventListener("hashchange", handleRoute);

// === 페이지 로드 시 최초 실행 ===

// 스케치 목록을 화면에 렌더링한다
renderList();
// 현재 URL 해시를 확인하여 적절한 화면을 표시한다
// (북마크나 새로고침으로 해시가 있는 URL로 접속했을 때 바로 스케치 실행)
handleRoute();
