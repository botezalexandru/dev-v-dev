function UserStatsUI(property, model) {
    let container = document.createElement("div");
    container.classList.add("user-stats");

    container.innerHTML = `
        <img />
        <p class="name"></p>
        <p class="score"></p>
        <ul class="hidden">
            <li> 
                <span></span> followers 
            </li>
            <li> 
                <span></span> following 
            </li>
            <li> 
                <span></span> public_repos 
            </li>
            <li> 
                <span></span> public_gists 
            </li>
        </ul> 
        <p class="loading">Loading...</p>
    `;

    let imgEl = container.querySelector("img");
    let nameEl = container.querySelector(".name");
    let scoreEl = container.querySelector(".score");
    let resultsEl = container.querySelector("ul");



    container.render = (devInfo) => {
        console.log(devInfo);
        if (devInfo === undefined) {
            container.classList.add("is-loading");
            imgEl.src = null;
            return;
        }

        container.classList.remove("is-loading");
        if (devInfo === null) {
            show404();
        } else {
            imgEl.src = devInfo.avatar_url;
            imgEl.alt = `${devInfo.username} avatar`;

            nameEl.innerText = devInfo.name || devInfo.username;

            if (devInfo.score !== undefined) {
                showScore(devInfo);
            } else {
                scoreEl.innerText = null;
                resultsEl.classList.add("hidden");
            }

        }
    };

    model.subscribe(container.render, property);

    return container;

    function show404() {
        imgEl.src = "src/icons/404.gif";
        nameEl.innerText = "User not found!";
        scoreEl.innerText = null;
        resultsEl.classList.add("hidden");
    }

    function showScore(devInfo) {
        scoreEl.innerText = `${devInfo.score}/4`;
        resultsEl.classList.remove("hidden");


        Object.keys(devInfo.stats).forEach((key, index) => {
            if (devInfo.won.includes(key)) {
                resultsEl.children[index].className = "win";
            } else {
                resultsEl.children[index].className = "lose";
            }

            resultsEl.children[index].querySelector("span").innerText = devInfo.stats[key];
        });
    }
}

export default UserStatsUI;