window.addEventListener("load", () => {
    if(localStorage.getItem("user_role") === null || localStorage.getItem("token") === null){
        window.location.replace("../index.html");
        }
    else {
        //Get the bicycles list
        const aluguel_request = new XMLHttpRequest();
        aluguel_request.addEventListener("load", (event) => {
            if (aluguel_request.DONE == 4 && aluguel_request.status == 200) {
                let alugueis = JSON.parse(aluguel_request.response);
                if(alugueis.length>0){
                    //Fill the table
                    append_json(alugueis);
                    //Fill the chart
                    set_chart(alugueis);
                }else{
                    document.getElementById('worldwide-sales').className += ' d-none';
                    document.getElementById('bike-warning').className = '';
                }
            } else {
                console.log("Não foi possível carregar a lista de bicicletas.")
            }
        });

        aluguel_request.addEventListener("error", (event) => {
                window.location.replace("index.html");
            }
        );
        // Set up our request
        if(window.localStorage.getItem('user_role')==2){
            var aluguel_qry='?locatario='+window.localStorage.getItem('user_id')
        }else{
            var aluguel_qry='?locador='+window.localStorage.getItem('user_id')
        }
        aluguel_request.open("GET", "http://localhost:8082/aluguel"+aluguel_qry);
        aluguel_request.setRequestHeader("Authorization", window.localStorage.getItem('token'));
        aluguel_request.send()

        //Fill the list of bikes with dynamic content
        function append_json(data) {
            var table = document.getElementById('reservas_table');
            var count = 1;
            data.forEach(function (object) {
                if(user_json.papel==3){
                    var nome_table=object.locatario.nome
                    var mail_table=object.locatario.email
                }else{
                    var nome_table=object.locador.nome
                    var mail_table=object.locador.email
                }
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<th scope="col"><input className="form-check-input" type="checkbox" value='+object.id.toString()+'></th>'+
                    '<td class="align-middle">' + object.dataInicio.toString().replaceAll(',','/') + '</td>' +
                    '<td class="align-middle">' + object.dataFim.toString().replaceAll(',','/') + '</td>' +
                    '<td class="align-middle">' + object.bicicleta.modelo + '</td>' +
                    '<td class="align-middle">' + nome_table + '</td>' +
                    '<td class="align-middle">' + object.precoTotal + '</td>' +
                    '<td class="d-none">' + object.id + '</td>'+
                    '<td class="d-none">' + mail_table + '</td>'+
                    '<td class="d-none">' + object.bicicleta.marca + '</td>'+
                    '<td class="d-none">' + object.bicicleta.bairro + '</td>'+
                    '<td class="align-middle"><button type="button" class="btn btn-outline-primary m-1 btn-sm aluguel-btn" data-bs-toggle="modal" data-bs-target="#confirmModal"  value="'+count+'" >Detalhes</button>'+
                        '<button type="button" class="btn btn-outline-danger  m-1 btn-sm aluguel-btn" data-bs-toggle="modal" data-bs-target="#cancelModal"  value="'+count+'" >Cancelar</button>'+
                    '</td>'
                table.appendChild(tr);
                count = count + 1;
            });
        }

        function set_chart(alugueis){
            var aggregated = [];

            //make aggregated array
            alugueis.reduce(function(res, value) {
                if (!res[value.dataInicio.slice(0,2).toString().replace(',','/')]) {
                    res[value.dataInicio.slice(0,2).toString().replace(',','/')] = { dataInicio: value.dataInicio.slice(0,2).toString().replace(',','/'), precoTotal: 0 };
                    aggregated.push(res[value.dataInicio.slice(0,2).toString().replace(',','/')])
                }
                res[value.dataInicio.slice(0,2).toString().replace(',','/')].precoTotal += value.precoTotal;
                return res;
            }, {});

            //order aggregated array
            aggregated = aggregated.sort((a, b) => {
                if (a.dataInicio < b.dataInicio) {
                    return -1;
                }
            });

            var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
            var myChart1 = new Chart(ctx1, {
                type: "bar",
                data: {
                    labels: aggregated.map(aluguel => aluguel.dataInicio),
                    datasets: [
                        {
                            data: aggregated.map(aluguel => aluguel.precoTotal),
                            backgroundColor: "rgba(0, 156, 255, .5)",
                            maxBarThickness: 100
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';

                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('pt-PT', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }

        //Show detail modal
        $("#confirmModal").on('shown.bs.modal', function(){
            var confirm_str="Bicicleta alugada: "
                +chosed_brand+" / "+chosed_model+"<br>"
                +"De: "+chosed_sd+" até: "+chosed_ed+"<br>"
            if(window.localStorage.getItem('user_role')==2){
                confirm_str=confirm_str+"Você deve transferir "+chosed_value+
                    " para "+chosed_name+"("+chosed_mail+")"+
                    " para confirmar sua reserva"
            }else {
                confirm_str = confirm_str + "Você tem " + chosed_value +
                    " a receber de " + chosed_name + " (" + chosed_mail + ")"
            };
            document.getElementById("modal-text").innerHTML = confirm_str;
        });

        //Show cancel modal
        $("#cancelModal").on('shown.bs.modal', function(){
            var confirm_str="Bicicleta Reservada: "
                +chosed_brand+" / "+chosed_model+"<br>"
                +"De: "+chosed_sd+" até: "+chosed_ed+"<br>"
            if(window.localStorage.getItem('user_role')==2){
                confirm_str=confirm_str+"Biciclata disponibilizada por "+
                    " para "+chosed_name+"("+chosed_mail+") por "+
                    chosed_value+" reais."
            }else {
                confirm_str = confirm_str + "Reserva feita por " + chosed_name + " (" + chosed_mail + ")"
            };
            document.getElementById("cancel-modal-text").innerHTML = confirm_str;
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
                if (element.nodeName === "BUTTON" && /aluguel-btn/.test(element.className)) {
                    // The user clicked on a <button> or clicked on an element inside a <button>
                    get_aluguel_attributes(element);
                    break;
                }
                element = element.parentNode;
            }
        }

        var chosed_id="";
        var chosed_sd="";
        var chosed_ed="";
        var chosed_model="";
        var chosed_name="";
        var chosed_value="";
        var chosed_mail="";
        var chosed_brand="";
        var chosed_region="";        
        // //Fill variables of selected row on the table
         function get_aluguel_attributes(button) {
             let aluguel_row=document.getElementById("reservas").rows[button.value].cells
             chosed_sd= aluguel_row[1].innerHTML
             chosed_ed=aluguel_row[2].innerHTML
             chosed_model=aluguel_row[3].innerHTML
             chosed_name=aluguel_row[4].innerHTML
             chosed_value=aluguel_row[5].innerHTML
             chosed_id= aluguel_row[6].innerHTML
             chosed_mail=aluguel_row[7].innerHTML
             chosed_brand=aluguel_row[8].innerHTML
             chosed_region=aluguel_row[9].innerHTML
         }


        //Act on operation confirmation
        $("#confirma-cancelar").click(function(){
            const exclude_book = new XMLHttpRequest();

            exclude_book.addEventListener("load", (event) => {

                if (exclude_book.DONE == 4 && exclude_book.status == 200) {
                    alert("Reserva cancelada com sucesso!");
                    window.location.replace("index.html");
                } else {
                    console.log("A exclusão não pode ser efeutada")
                }
            });
            exclude_book.addEventListener("error", (event) => {
                alert("A exclusão não pode ser efeutada");
            });
            // Set up our request
            exclude_book.open("DELETE", "http://localhost:8082/aluguel/"+chosed_id.toString());
            exclude_book.setRequestHeader("Authorization", window.localStorage.getItem('token'));
            exclude_book.send();
        });

    }
});