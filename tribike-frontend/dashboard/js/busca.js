window.addEventListener("load", () => {
    //if(localStorage.getItem("user_role") === null || (window.localStorage.getItem("user_role")!=2)){
    if (false) {
        window.location.replace("index.html");
    } else {//Fill the date filter with inputed dates or default. Save dates on localStorage
        if (localStorage.getItem("rent_start_date") === null || localStorage.getItem("rent_end_date") === null) {
            const form_date = new Date();
            let day = form_date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
            let month = (form_date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
            let year = form_date.getFullYear();
            let start_date = year.toString() + "-" + month.toString() + "-" + day.toString();
            window.localStorage.setItem('rent_start_date', start_date);

            form_date.setDate(form_date.getDate() + 7);
            let day_end = form_date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
            let month_end = (form_date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
            let year_end = form_date.getFullYear();
            let end_date = year_end.toString() + "-" + month_end.toString() + "-" + day_end.toString();
            window.localStorage.setItem('rent_end_date', end_date);
        }else{
            if(!(localStorage.getItem("region_search")===null)){
                document.getElementById("region_in").value=localStorage.getItem("region_search")
            }
        }
        let rent_start_date = localStorage.getItem("rent_start_date")
        let rent_end_date = localStorage.getItem("rent_end_date")
        const start_date_input = document.getElementById('start_date');
        start_date_input.value = rent_start_date;
        const end_date_input = document.getElementById('end_date');
        end_date_input.value = rent_end_date;
        get_bikes(rent_start_date, rent_end_date);

        const date_start = new Date(rent_start_date);
        const date_end = new Date(rent_end_date);
        const diffTime = Math.abs(date_end - date_start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        //GET the bicycles list on the dates
        function get_bikes(start_date, end_date) {
            console.log("Bicicletas p" + start_date.toString() + " - " + end_date.toString());
            const bike_request = new XMLHttpRequest();
            bike_request.addEventListener("load", (event) => {
                if (bike_request.DONE == 4 && bike_request.status == 200) {
                    bicicletas = JSON.parse(bike_request.response);
                    console.log(bicicletas)
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
            let url_busca = "http://localhost:8082/bicicleta/busca?"
            if(!(localStorage.getItem("region_search") === null || localStorage.getItem("region_search") == '')){
                url_busca=url_busca+"bairro="+localStorage.getItem("region_search")
                url_busca=url_busca+"&"
            }
            url_busca=url_busca+"dataInicio="+localStorage.getItem("rent_start_date").replace(/-/g, '')
            url_busca=url_busca+"&dataFim="+localStorage.getItem("rent_end_date").replace(/-/g, '')
            bike_request.open("GET", url_busca);
            bike_request.setRequestHeader("Authorization", window.localStorage.getItem('token'));
            bike_request.send()
        }

        //Fill the list of bikes with dynamic content
        function append_json(data) {
            var table = document.getElementById('bicicletas_table');
            document.getElementById('bicicletas').style.display = 'inline';
            var count = 1;
            data.forEach(function (object) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<th scope="row" class="align-middle" value="' + object.id + '">' + count + '</th>' +
                    '<td>' +
                    '<a href="' + object.urlFoto + '" target="_blank">' +
                    '<img  class="img-fluid img-table" src="' + object.urlFoto + '" alt="" ></img></a>' +
                    '</td>' +
                    '<td class="align-middle">' + object.marca + '</td>' +
                    '<td class="align-middle">' + object.modelo + '</td>' +
                    '<td class="align-middle">' + object.descricao + '</td>' +
                    '<td class="align-middle">' + object.acessorios + '</td>' +
                    '<td class="align-middle">' + object.preco + '</td>' +
                    '<td class="align-middle">' + object.bairro + '</td>' +
                    '<td class="d-none">' + object.id + '</td>'+
                    '<td class="align-middle"><button type="button" class="btn btn-outline-primary m-1 btn-sm bicicleta" data-bs-toggle="modal" data-bs-target="#confirmModal"  value="' + count + '" >Reservar</button></td>'
                table.appendChild(tr);
                count = count + 1;
            });
        }

        //Handle date input by user - Reload page
        const date_form = document.getElementById("filtro_data");
        date_form.addEventListener("submit", (event) => {
            event.preventDefault();
            let start_date = new Date(document.getElementById("start_date").value);
            let end_date = new Date(document.getElementById("end_date").value);
            let region_in = document.getElementById("region_in").value;
            start_date.setDate(start_date.getDate() + 1)
            end_date.setDate(end_date.getDate() + 1)
            if(is_valid_search(start_date,end_date)){
                let day = start_date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
                let month = (start_date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
                let year = start_date.getFullYear();
                let day_end = end_date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
                let month_end = (end_date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
                let year_end = end_date.getFullYear();

                window.localStorage.setItem('rent_start_date', year.toString() + "-" + month.toString() + "-" + day.toString());
                window.localStorage.setItem('rent_end_date', year_end.toString() + "-" + month_end.toString() + "-" + day_end.toString());
                window.localStorage.setItem('region_search', region_in);
                window.location.replace("busca.html");
            }else{
                console.log("Dados invalidos")
            }
        });

        function is_valid_search(start_date,end_date){
            let today=new Date()
            if(start_date<today){
                alert("Data de início não pode ser anterior a hoje")
                return false;
            }else if(end_date<start_date){
                alert("Data de fim não pode ser anterior a data de início")
                return false;
            }else{
                return true;
            }
        }

        //Show confirmation modal
        $("#confirmModal").on('shown.bs.modal', function () {
            var confirm_str = "Confirmar reserva da bicicleta "
                +chosed_marca + "/" + chosed_modelo + " de "
                +rent_start_date + " à " + rent_end_date
                + " em " + chosed_region;
            document.getElementById("modal-text").innerHTML = confirm_str;
        });


        //Get infos on button click
        if (document.addEventListener) {
            document.addEventListener("click", handleClick, false);
        } else if (document.attachEvent) {
            document.attachEvent("onclick", handleClick);
        }
        function handleClick(event) {
            event = event || window.event;
            event.target = event.target || event.srcElement;
            var element = event.target;
            var i = 0;
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


        //Fill variables of selected row on the table
        var chosed_marca = "";
        var chosed_modelo = "";
        var chosed_region = "";
        var chosed_bike = 0;
        var chosed_price = 0;
        function get_bike_atributtes(button) {
            let bike_row = document.getElementById("bicicletas").rows[button.value].cells
            chosed_marca = bike_row[2].innerText
            chosed_modelo = bike_row[3].innerText
            chosed_region = bike_row[7].innerText
            chosed_bike = bike_row[8].innerText
            chosed_price = parseInt(bike_row[6].innerText) //- parseInt(bike_row[9].innerText) incluir desconto
            chosed_price = chosed_price * (diffDays+1)
        }


        //Act on operation confirmation
        $("#confirma-reserva").click(function () {
            const create_reserva = new XMLHttpRequest();
            create_reserva.addEventListener("load", (event) => {
                if (create_reserva.DONE == 4 && create_reserva.status == 200) {
                    alert("Sua reserva foi confirmada com sucesso!");
                    window.location.replace("index.html");
                } else {
                    alert("A reserva não pode ser efeutada, por favor selecione novamente a sua opção.")
                }
            });
            create_reserva.addEventListener("error", (event) => {
                alert("A reserva não pode ser efeutada, por favor selecione novamente a sua opção");
            })
            // Set up our request
            create_reserva.open("POST", "http://localhost:8082/aluguel");
            create_reserva.setRequestHeader("Authorization", window.localStorage.getItem('token'));
            create_reserva.setRequestHeader("Content-type", "application/json");
            data = '{\"dataInicio\": \"';
            data = data + rent_start_date;
            data = data + '\",    \"dataFim\" : \"';
            data = data + rent_end_date;
            data = data + '\",    \"bicicleta\" : \"';
            data = data + chosed_bike.toString();
            data = data + '\",    \"locatario\" : \"';
            data = data + localStorage.getItem("user_id");
            data = data + '\",    \"precoTotal\" : \"';
            data = data + chosed_price.toString();
            data = data + '\"}';
            console.log(data);
            create_reserva.send(data);
        });
    }
});