function FinalResultUI(model, onFightCb) {
    let container = document.createElement('div');
    container.classList.add('final-result');

    container.innerHTML = `
        <h1></h1>
        <button class="hidden"> FIGHT! </button>
    `;

    let h1 = container.querySelector('h1');
    let buttonEl = container.querySelector('button');
    buttonEl.addEventListener('click', onFightCb);

    container.render = data => {
        const {
            dev1,
            dev2
        } = data;

        if (data.result) {
            switch (data.result) {
                case 'dev1':
                    h1.innerText = `${dev1.username} wins`;
                    break;
                case 'dev2':
                    h1.innerText = `${dev2.username} wins`;
                    break;
                default:
                    h1.innerText = 'draw';
                    break;
            }
            buttonEl.classList.add('hidden');
        } else if (dev1 && dev2) {
            h1.innerText = null;
            buttonEl.classList.remove('hidden');
        } else {
            buttonEl.classList.add('hidden');
        }
    };

    model.subscribe(container.render);

    return container;
}

export default FinalResultUI;