window.addEventListener("load", () => {
    //if(localStorage.getItem("user_role") === null || (window.localStorage.getItem("user_role")!=2)){
    if(false){
        window.location.replace("index.html");
        }
    else {
        //Get the bicycles list
        const bike_request = new XMLHttpRequest();
        bike_request.addEventListener("load", (event) => {
            if (bike_request.DONE == 4 && bike_request.status == 200) {
                bicicletas = JSON.parse(bike_request.response);
                append_json(bicicletas._embedded.bicicletas);
            } else {
                console.log("Não foi possível carregar a lista de bicicletas.")
            }
        });

        bike_request.addEventListener("error", (event) => {
                window.location.replace("index.html");
            }
        );
        // Set up our request
        bike_request.open("GET", "http://localhost:8082/bicicletas");
        bike_request.setRequestHeader("Authorization", window.localStorage.getItem('token'));
        bike_request.send()


        function append_json(data) {
            var table = document.getElementById('bicicletas_table');
            document.getElementById('bicicletas').style.display = 'inline';
            var count = 1;
            data.forEach(function (object) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<th scope="row" class="align-middle">' + count + '</th>' +
                    '<td class="align-middle">' + object.marca + '</td>' +
                    '<td class="align-middle">' + object.modelo + '</td>' +
                    '<td class="align-middle">' + object.descricao + '</td>' +
                    '<td class="align-middle">' + object.Acessorios + '</td>' +
                    '<td class="align-middle">' + object.Preco + '</td>' +
                    '<td class="align-middle">' + object.Desconto + '</td>'+
                    '<td class="align-middle"><button type="button" class="btn btn-outline-primary m-1 btn-sm">Selecionar</button></td>'
                table.appendChild(tr);
                count = count + 1;
            });
        }
    }
});