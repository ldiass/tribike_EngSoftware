
    const XHR = new XMLHttpRequest();
    
    XHR.addEventListener("load", (event) => {
        if(XHR.DONE==4 && XHR.status==200){
            console.log("Login correto.")
            user_json=JSON.parse(XHR.response)
            window.localStorage.setItem('user_name', user_json.nome);
            $("#user_name").html(user_json.nome);
        }else{
          window.location.replace("../index.html");
      }
    });

    XHR.addEventListener("error", (event) => {
        window.location.replace("../index.html");
      }
    );

    // Set up our request
    XHR.open("GET", "http://localhost:8082/usuario/logado");
    XHR.setRequestHeader("Authorization", window.localStorage.getItem('token'));
    
    XHR.send()
  ;