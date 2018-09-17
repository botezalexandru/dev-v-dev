function PreviousResultsUI(model) {
    let container = document.createElement("div");
    container.classList.add("previous-results-wrapper");

    container.innerHTML = `
        <h1 class="warning"> You are offline! </h1>
        <ol></ol>
    `;

    let resultsListEl = container.querySelector("ol");

    container.render = (past) => {
        resultsListEl.innerHTML = null;
        past.forEach(resultData => {
            let resultEl = document.createElement("li");
            let resultText = "wins over";

            if (resultData.result === 'dev2') {
                resultText = "loses to";
            } else if (resultData.result === 'draw') {
                resultText = "draws"
            }

            resultEl.innerHTML = `
                <p>${resultData.dev1} </p>
                <p class="score">${resultText} </p>
                <p>${resultData.dev2} </p>
            `;
            resultsListEl.appendChild(resultEl);
        });
    };

    model.subscribe(container.render, "past");

    return container;
}

export default PreviousResultsUI;