import Model from './model';
import UserStatsUI from './components/user-stats.component';
import FinalResultUI from './components/final-result.component';
import PreviousResultsUI from './components/previous-results.component';
import APP_CONFIG from './app-config.js';

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

/** PWA */
function setupPWA() {
    const notificationEl = document.querySelector("header button");

    navigator.serviceWorker.register("service-worker.js").then(swRegistration => {
        console.log("Service worker succesfully registered!");
        setupPushNotifications(swRegistration);
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

    function setupPushNotifications(registration) {
        if (Notification.permission === "denied") {
            return;
        }

        firebase.initializeApp(APP_CONFIG.FIREBASE);
        const messaging = firebase.messaging();
        messaging.useServiceWorker(registration);
        messaging.usePublicVapidKey("BKVNAss4X_lajWgfZfs0hle2Rk_2UQQ0UmvBArseNaauN4M9jGOvvBOQytCX-rCB51XnsMtXipd_fSmAH93nSm4");

        if (Notification.permission === "default") {
            notificationEl.classList.remove("hidden");
            notificationEl.addEventListener("click", () => {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        messaging.getToken().then(token => {
                            console.log(token);

                            firebase
                                .database()
                                .ref(`tokens/${token}`)
                                .set(true);

                            notificationEl.remove();
                        }, err => {
                            console.log(err);
                        });
                    } else if (permission === "denied") {
                        notificationEl.remove();
                    }

                });
            })
        }

    }
}