export function initRouter(onLoad, onShowList) {
    function handleRoute() {
        const hash = location.hash.slice(1);
        if (hash) {
            onLoad(hash);
        } else {
            onShowList();
        }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}
