window.onload = () => {

    const createTd = (data) => {
        const el = document.createElement('td');
        if (!data) el.innerHTML = ''; else el.innerHTML = data;

        return el;
    };

    const createTr = (date, name, data, className, tBody) => {

        const tr = document.createElement('tr');
        tr.classList.add(className);
        const dateF = new Date(date).toLocaleDateString();
        tr.appendChild(createTd(dateF));
        tr.appendChild(createTd(name));
        tr.appendChild(createTd(data.name));
        tr.appendChild(createTd(data.title));
        const image = document.createElement('img');
        image.setAttribute('src', data.image);
        image.classList.add('tableImage');
        const tdImage = createTd();
        tdImage.appendChild(image);
        tr.appendChild(tdImage);
        const tdA = createTd();
        const a = document.createElement('a');
        a.setAttribute('href', data.link);
        a.innerHTML = 'Go to lot';
        tdA.appendChild(a);
        tr.appendChild(tdA);
        tr.appendChild(createTd(data.price));
        tBody.appendChild(tr);

    }

    const server = 'http://localhost:8070/';
    fetch(server)
        .then(response => response.json())
        .then(json => {
                console.log(json);
                const tBody = document.getElementById('tBody');
                json.forEach(el => {
                    if (Array.isArray(el.removed)) {
                        el.removed.forEach(removedEl => {
                            createTr(el.date, el.name, removedEl, 'danger', tBody);

                        });
                    }

                    if (Array.isArray(el.added)) {
                        el.added.forEach(addedEl => {
                            createTr(el.date, el.name, addedEl, 'success', tBody);
                        });
                    }

                });
            }
        )
        .catch(alert);
};