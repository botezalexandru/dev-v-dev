import Model from './model.js';
import UserStatsUI from './components/user-stats.component.js';
import FinalResultUI from './components/final-result.component.js';

const addedInDom = {
    dev1: false,
    dev2: false
};

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
    navigator.serviceWorker.register("service-worker.js").then(swRegistration => {
        console.log("Service worker succesfully installed!");
        // swRegistration.showNotification("Notif", {});
    }, err => {
        console.error(`SW installation failed: ${err}`);
    })
}