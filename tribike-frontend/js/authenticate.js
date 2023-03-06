
    const XHR = new XMLHttpRequest();
    
    XHR.addEventListener("load", (event) => {
        if(XHR.DONE==4 && XHR.status==200){
            console.log("Login correto.")
      }else{
          window.location.replace("./index.html");
      }
    });

    XHR.addEventListener("error", (event) => {
        alert("Usuario não autenticado.") ;
      }
    );

    // Set up our request
    XHR.open("GET", "http://localhost:8082/usuario");
    XHR.setRequestHeader("Authorization", window.localStorage.getItem('token'));
    
    XHR.send()
  ;