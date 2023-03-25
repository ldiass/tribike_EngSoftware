window.addEventListener("load", () => {
    if(localStorage.getItem("user_role") === null || (window.localStorage.getItem("user_role")!=1 && window.localStorage.getItem("user_role")!=3)){
        window.location.replace("index.html");
        }
    else {
        //Get the bicycles list
        const bike_request = new XMLHttpRequest();
        bike_request.addEventListener("load", (event) => {
            if (bike_request.DONE == 4 && bike_request.status == 200) {
                bicicletas = JSON.parse(bike_request.response);
                append_json(bicicletas);
            } else {
                console.log("Não foi possível carregar a lista de bicicletas.")
            }
        });

        bike_request.addEventListener("error", (event) => {
                window.location.replace("index.html");
            }
        );
        // Set up our request
        bike_request.open("GET", "http://localhost:8082/bicicleta?usuario="+window.localStorage.getItem('user_id'));
        bike_request.setRequestHeader("Authorization", window.localStorage.getItem('token'));
        bike_request.send()


        function append_json(data) {
            var table = document.getElementById('bicicletas_table');
            document.getElementById('bicicletas').style.display = 'inline';
            var count = 1;
            data.forEach(function (object) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<th scope="row">' + count + '</th>' +
                    '<td>' + object.marca + '</td>' +
                    '<td>' + object.modelo + '</td>' +
                    '<td>' + object.descricao + '</td>' +
                    '<td>' + object.acessorios + '</td>' +
                    '<td>' + object.preco + '</td>' +
                    '<td>' + object.desconto + '</td>'
                table.appendChild(tr);
                count = count + 1;
            });
        }
    }
});