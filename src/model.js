import GithubService from "./services/GitHub.service.js";

const Model = (function modelIIFE() {
    let data = {
        dev1: undefined,
        dev2: undefined,
        result: undefined,
        past: []
    };

    let subscribersList = [];



    return {
        setDev: (property, username) => {
            resetScore();

            data[property] = undefined;
            notifySubscribers();

            GithubService.getInfo(username).then(userInfo => {
                data[property] = userInfo;
                if (userInfo) {
                    data[property].score = undefined;
                    data[property].won = [];
                };
                checkIfBothSet();
                notifySubscribers();
            });
        },

        fight: () => {
            data.dev1.score = 0;
            data.dev2.score = 0;

            Object.keys(data.dev1.stats).forEach(key => {
                if (data.dev1.stats[key] > data.dev2.stats[key]) {
                    hasWonStat(data.dev1, key);
                } else if (data.dev1.stats[key] < data.dev2.stats[key]) {
                    hasWonStat(data.dev2, key);
                } else {
                    hasWonStat(data.dev1, key);
                    hasWonStat(data.dev2, key);
                }
            })
            if (data.dev1.score > data.dev2.score) {
                data.result = "dev1";
            } else if (data.dev1.score < data.dev2.score) {
                data.result = "dev2";
            } else {
                data.result = "draw";
            }
            notifySubscribers();
        },

        subscribe(notifyFunction, property) {
            subscribersList.push({
                property,
                notify: notifyFunction
            });
            if (property) {
                notifyFunction(data[property]);
            } else {
                notifyFunction(data);
            }

        }
    };

    function checkIfBothSet() {
        const {
            dev1,
            dev2
        } = data;

        if (data.dev1 && data.dev2) {
            data.past.push({
                dev1,
                dev2
            })
        }
    }

    function hasWonStat(dev, key) {
        dev.score++;
        dev.won.push(key);
    }

    function notifySubscribers() {
        subscribersList.forEach(subscriber => {
            if (!subscriber.property) {
                subscriber.notify(data);
            } else {
                subscriber.notify(data[subscriber.property]);
            }
        });
    }

    function resetScore() {
        if (data.dev1) {
            data.dev1.score = undefined;
            data.dev1.won = [];
        }
        if (data.dev2) {
            data.dev2.score = undefined;
            data.dev2.won = [];
        }
        data.result = undefined;
    }
}());

export default Model;