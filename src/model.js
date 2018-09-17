import localforage from 'localforage';
import GitHubService from './GitHub.service';

const Model = (function modelIIFE() {
    let data = {
        dev1: undefined,
        dev2: undefined,
        result: undefined,
        past: []
    };
    let subscribersList = [];

    localforage.getItem('results').then(results => {
        data.past = JSON.parse(results) || [];
        notifySubscribers();
    });

    let publicAPI = {
        setDev: (property, username) => {
            resetScore();

            data[property] = undefined;
            notifySubscribers();

            GitHubService.getInfo(username).then(userInfo => {
                data[property] = userInfo;
                if (userInfo) {
                    data[property].score = undefined;
                    data[property].won = [];
                }
                notifySubscribers();
            });
        },

        fight: () => {
            data.dev1.score = 0;
            data.dev2.score = 0;

            compareStats(data.dev1, data.dev2);

            data.result = 'draw';
            if (data.dev1.score > data.dev2.score) {
                data.result = 'dev1';
            } else if (data.dev1.score < data.dev2.score) {
                data.result = 'dev2';
            }

            data.past.unshift({
                dev1: data.dev1.username,
                dev2: data.dev2.username,
                result: data.result
            });
            localforage.setItem('results', JSON.stringify(data.past));

            notifySubscribers();
        },

        subscribe(renderFunction, propertyToWatch) {
            let newSubscriber = {
                propertyToWatch,
                render: renderFunction
            };
            subscribersList.push(newSubscriber);

            if (propertyToWatch) {
                newSubscriber.render(data[propertyToWatch]);
            } else {
                newSubscriber.render(data);
            }
        }
    };

    return publicAPI;

    /** PRIVATE FUNCTIONS */
    function compareStats(dev1, dev2) {
        Object.keys(dev1.stats).forEach(key => {
            if (dev1.stats[key] > dev2.stats[key]) {
                hasWonStat(dev1, key);
                return;
            }
            if (dev1.stats[key] < dev2.stats[key]) {
                hasWonStat(dev2, key);
                return;
            }
            // Draw: both win
            hasWonStat(dev1, key);
            hasWonStat(dev2, key);
        });
    }

    function hasWonStat(dev, key) {
        dev.score++;
        dev.won.push(key);
    }

    function notifySubscribers() {
        subscribersList.forEach(subscriber => {
            if (!subscriber.propertyToWatch) {
                subscriber.render(data);
            } else {
                subscriber.render(data[subscriber.propertyToWatch]);
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
})();

export default Model;
