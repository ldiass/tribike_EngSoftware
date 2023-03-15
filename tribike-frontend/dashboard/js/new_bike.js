if(localStorage.getItem("user_name") === null || (window.localStorage.getItem('user_role')!=1 && window.localStorage.getItem('user_role')!=3)){
    window.location.replace("index.html");
}
;


window.addEventListener("load", () => {
    function sendData() {
        const create_bicicleta = new XMLHttpRequest();

        // Bind the FormData object and the form element
        const FD = new FormData(form);

        // Define what happens on successful data submission
        create_bicicleta.addEventListener("load", (event) => {
            alert("Sua bicicleta " + document.getElementById("bike_marca").value+" foi cadastrada com sucesso!");
        });

        // Define what happens in case of error
        create_bicicleta.addEventListener("error", (event) => {
            alert('Oops! Something went wrong.');
        });

        // Set up our request
        create_bicicleta.open("POST", "http://localhost:8082/bicicleta");
        create_bicicleta.setRequestHeader("Authorization", window.localStorage.getItem('token'));
        create_bicicleta.setRequestHeader("Content-type", "application/json");

        data='{\"marca\": \"';
        data=data+document.getElementById("bike_marca").value;
        data=data+'\",    \"modelo\" : \"';
        data=data+document.getElementById("bike_modelo").value;
        data=data+'\",    \"descricao\": \"';
        data=data+document.getElementById("bike_descricao").value;
        data=data+'\",    \"preco\": \"';
        data=data+document.getElementById("bike_preco").value;
        data=data+'\",    \"url_foto\": \"';
        data=data+document.getElementById("bike_url").value;
        data=data+'\",    \"peso\": \"';
        data=data+document.getElementById("bike_peso").value;
        data=data+'\",    \"acessorios\": \"';
        data=data+document.getElementById("bike_acessorios").value;
        data=data+'\",    \"desconto\": \"';
        data=data+document.getElementById("bike_desconto").value;
        data=data+'\"}';
        console.log(data);
        create_bicicleta.send(data);
    }

    // Get the form element
    const form = document.getElementById("newbike-form");

    // Add 'submit' event handler
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        sendData();
    });
});