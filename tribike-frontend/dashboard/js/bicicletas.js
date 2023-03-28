window.addEventListener("load", () => {
    if(localStorage.getItem("user_role") === null || (window.localStorage.getItem("user_role")!=1 && window.localStorage.getItem("user_role")!=3)){
        window.location.replace("index.html");
        }
    else {
        //Get the bicycles list
        const bike_request = new XMLHttpRequest();
        bike_request.addEventListener("load", (event) => {
            if (bike_request.DONE == 4 && bike_request.status == 200) {
                let bicicletas = JSON.parse(bike_request.response);
                if(bicicletas.length>0){
                    append_json(bicicletas);
                }else{
                    document.getElementById('bicicletas').className += ' d-none';
                    document.getElementById('bike-warning').className = '';
                }
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

        //Fill the list of bikes with dynamic content
        function append_json(data) {
            var table = document.getElementById('bicicletas_table');
            //document.getElementById('bicicletas').style.display = 'inline';
            var count = 1;
            data.forEach(function (object) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<th scope="row">' + count + '</th>' +
                    '<td>' +
                        '<a href="' + object.urlFoto + '" target="_blank">'+
                        '<img  class="img-fluid img-table" src="' + object.urlFoto + '" alt="" ></img></a>'+
                    '</td>'+
                    '<td class="align-middle">' + object.marca + '</td>' +
                    '<td class="align-middle">' + object.modelo + '</td>' +
                    '<td class="align-middle">' + object.descricao + '</td>' +
                    '<td class="align-middle">' + object.acessorios + '</td>' +
                    '<td class="align-middle">' + object.preco + '</td>' +
                    '<td class="align-middle">' + object.desconto + '</td>'+
                    '<td class="align-middle">' + object.bairro + '</td>'+
                    '<td class="d-none">' + object.id + '</td>'+
                    '<td class="align-middle"><button type="button" class="btn btn-outline-danger m-1 btn-sm bicicleta" data-bs-toggle="modal" data-bs-target="#confirmModal"  value="'+count+'" >Excluir</button></td>'
                table.appendChild(tr);
                count = count + 1;
            });
        }


        //Show confirmation modal
        $("#confirmModal").on('shown.bs.modal', function(){
            var confirm_str="Confirmar exclusão da bicicleta "
                +chosed_marca+" / "+chosed_modelo;
            document.getElementById("modal-text").innerHTML = confirm_str;
        });

        if (document.addEventListener) {
            document.addEventListener("click", handleClick, false);
        }
        else if (document.attachEvent) {
            document.attachEvent("onclick", handleClick);
        }

        //Get infos on button click
        function handleClick(event) {
            event = event || window.event;
            event.target = event.target || event.srcElement;

            var element = event.target;

            var i=0;
            // Climb up the document tree from the target of the event
            while (element) {
                if (element.nodeName === "BUTTON" && /bicicleta/.test(element.className)) {
                    // The user clicked on a <button> or clicked on an element inside a <button>
                    get_bike_atributtes(element);
                    break;
                }
                element = element.parentNode;
            }
        }
        var chosed_modelo= "";
        var chosed_marca= "";
        var chosed_bike=0
        //Fill variables of selected row on the table
        function get_bike_atributtes(button) {
            let bike_row=document.getElementById("bicicletas").rows[button.value].cells
            chosed_bike= bike_row[9].innerHTML
            chosed_marca=bike_row[2].innerHTML
            chosed_modelo=bike_row[3].innerHTML
        }

        //Act on operation confirmation
        $("#confirma-exclusão").click(function(){
            const exclude_bike = new XMLHttpRequest();

            exclude_bike.addEventListener("load", (event) => {

                if (exclude_bike.DONE == 4 && exclude_bike.status == 200) {
                    alert("Bicicleta excluída com sucesso!");
                    window.location.replace("bicicletas.html");
                } else {
                    console.log("A exclusão não pode ser efeutada")
                }
            });
            exclude_bike.addEventListener("error", (event) => {
                alert("A exclusão não pode ser efeutada");
            });
            // Set up our request
            exclude_bike.open("DELETE", "http://localhost:8082/bicicleta/"+chosed_bike.toString());
            exclude_bike.setRequestHeader("Authorization", window.localStorage.getItem('token'));
            exclude_bike.send();
        });
    }
});