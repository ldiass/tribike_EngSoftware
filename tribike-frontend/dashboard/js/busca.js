window.addEventListener("load", () => {
    //if(localStorage.getItem("user_role") === null || (window.localStorage.getItem("user_role")!=2)){
    if(false){
        window.location.replace("index.html");
        }
    else {//Fill the date filter with inputed dates or default. Save dates on localStorage
        if(localStorage.getItem("rent_start_date") === null || localStorage.getItem("rent_end_date") === null){
            const form_date = new Date();
            let day = form_date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let month = form_date.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let year = form_date.getFullYear();
            let start_date=year.toString()+"-"+month.toString()+"-"+day.toString();
            window.localStorage.setItem('rent_start_date', start_date);

            form_date.setDate(form_date.getDate() + 7);
            let day_end = form_date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let month_end = form_date.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            let year_end = form_date.getFullYear();
            let end_date=year_end.toString()+"-"+month_end.toString()+"-"+day_end.toString();
            window.localStorage.setItem('rent_end_date', end_date);
        }
        let rent_start_date=localStorage.getItem("rent_start_date")
        let rent_end_date=localStorage.getItem("rent_end_date")
        const start_date_input = document.getElementById('start_date');
        start_date_input.value = rent_start_date;
        const end_date_input = document.getElementById('end_date');
        end_date_input.value = rent_end_date;
        get_bikes(rent_start_date,rent_end_date);



        //GET the bicycles list on the dates
        function get_bikes(start_date, end_date) {
            console.log("Bicicletas p"+start_date.toString()+" - "+ end_date.toString());
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
                        '<a href="' + object.urlFoto + '" target="_blank">'+
                        '<img  class="img-fluid img-table" src="' + object.urlFoto + '" alt="" ></img></a>'+
                    '</td>'+
                    '<td class="align-middle">' + object.marca + '</td>' +
                    '<td class="align-middle">' + object.modelo + '</td>' +
                    '<td class="align-middle">' + object.descricao + '</td>' +
                    '<td class="align-middle">' + object.acessorios + '</td>' +
                    '<td class="align-middle">' + object.preco + '</td>' +
                    '<td class="align-middle">' + object.bairro + '</td>'+
                    '<td class="align-middle"><button type="button" class="btn btn-outline-primary m-1 btn-sm bicicleta" data-bs-toggle="modal" data-bs-target="#confirmModal"  value="'+count+'" >Selecionar</button></td>'
                table.appendChild(tr);
                count = count + 1;
            });
        }

        //Handle date input by user - Reload page
        const date_form= document.getElementById("filtro_data");
        date_form.addEventListener("submit", (event) => {
            event.preventDefault();
            let start_date=document.getElementById("start_date").value;
            window.localStorage.setItem('rent_start_date', start_date);
            let end_date=document.getElementById("end_date").value;
            window.localStorage.setItem('rent_end_date', end_date);
            window.location.replace("busca.html");
        });


        //Show confirmation modal
        $("#confirmModal").on('shown.bs.modal', function(){
            var confirm_str="Confirmar reserva da bicicleta "+
                +chosed_marca+"/"+chosed_modelo+" de "+
                rent_start_date+ " à "+rent_end_date
                +" em "+chosed_region;
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

        //Fill variables of selected row on the table
        var chosed_marca= "";
        var chosed_modelo= "";
        var chosed_region= "";
        var chosed_price= 0;
        function get_bike_atributtes(button) {
            let bike_row=document.getElementById("bicicletas").rows[button.value].cells
            chosed_marca= bike_row[1].innerText
            chosed_modelo=bike_row[2].innerText
            chosed_region=bike_row[7].innerText
            chosed_price=parseInt(bike_row[5].innerText)-parseInt(bike_row[6].innerText)
        }

        //Act on operation confirmation
        $("#confirma-reserva").click(function(){
            const create_reserva = new XMLHttpRequest();

            create_reserva.addEventListener("load", (event) => {

                if (create_reserva.DONE == 4 && create_reserva.status == 200) {
                    alert("Sua reserva foi confirmada com sucesso!");
                    window.location.replace("index.html");
                } else {
                    console.log("A reserva não pode ser efeutada, por favor selecione novamente a sua opção.")
                }
            });


            create_reserva.addEventListener("error", (event) => {
                alert("A reserva não pode ser efeutada, por favor selecione novamente a sua opção");
            });

            // Set up our request
            create_reserva.open("POST", "http://localhost:8082/aluguel");
            create_reserva.setRequestHeader("Authorization", window.localStorage.getItem('token'));
            create_reserva.setRequestHeader("Content-type", "application/json");

            data='{\"dataInicio\": \"';
            data=data+rent_start_date;
            data=data+'\",    \"dataFim\" : \"';
            data=data+rent_end_date;
            data=data+'\",    \"bicicleta\": { \"id\": \"';
            data=data+"15";
            data=data+'\"},    \"locatario\": { \"id\": \"';
            data=data+localStorage.getItem("user_id");
            data=data+'\"},    \"locador\": { \"id\": \"';
            data=data+"1"
            data=data+'\"}}';
            console.log(data);
            create_reserva.send(data);
        });
    }
});

