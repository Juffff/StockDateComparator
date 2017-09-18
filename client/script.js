window.onload = () => {

    const server = 'http://localhost:8070/grandStock';
    fetch(server)
        .then(response => response.json())
        .then(json => {
                const tbody = document.getElementById('tbody');
                json.forEach(el => {
                    const tr = document.createElement('tr');
                    if (Array.isArray(el.removed)){
                        el.removed.forEach(removedEl => {
                            tr.classList.add('danger');
                            
                        });
                    }
                    tbody.appendChild(tr);
                });
            }
        )
        .catch(alert);
};