window.onload = () => {

  const server = 'http://localhost:8070/grandStock';
    fetch(server)
        .then(response => response.json())
        .then(json => console.log(JSON.stringify(json)))
        .catch( alert );  
};