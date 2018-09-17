import Model from './model';
import UserStatsUI from './components/user-stats.component';
import FinalResultUI from './components/final-result.component';
import PreviousResultsUI from './components/previous-results.component';

const addedInDom = {
    dev1: false,
    dev2: false
};

const mainEl = document.querySelector("main");
const resultsEl = document.getElementById("results");
resultsEl.appendChild(FinalResultUI(Model, Model.fight));

document.addEventListener("submit", function (e) {
    e.preventDefault();

    let form = e.target;

    if (form.checkValidity()) {
        Model.setDev(form.dataset["dev"], form.username.value);

        if (!addedInDom[form.dataset["dev"]]) {
            addedInDom[form.dataset["dev"]] = true;
            resultsEl.querySelector(`.results__${form.dataset["dev"]}`).appendChild(UserStatsUI(form.dataset["dev"], Model));
        }
    }
});

if ('serviceWorker' in navigator) {
    setupPWA();
}

function setupPWA() {
    navigator.serviceWorker.register("service-worker.js").then(swRegistration => {
        console.log("Service worker succesfully installed!");
    }, err => {
        console.error(`SW installation failed: ${err}`);
    });

    let previousResults;
    let controlsEl = document.querySelector(".controls");

    if (!navigator.onLine) {
        onOffline();
    }
    window.addEventListener("online", () => {
        controlsEl.classList.remove("hidden");
        resultsEl.classList.remove("hidden");
        previousResults.remove();
    });
    window.addEventListener("offline", onOffline);

    function onOffline() {
        previousResults = PreviousResultsUI(Model);
        controlsEl.classList.add("hidden");
        resultsEl.classList.add("hidden");
        mainEl.appendChild(previousResults);
    }
}