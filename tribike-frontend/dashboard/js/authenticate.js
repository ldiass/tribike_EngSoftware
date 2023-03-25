const XHR = new XMLHttpRequest();

XHR.addEventListener("load", (event) => {
    if(XHR.DONE==4 && XHR.status==200){
        console.log("Login correto.")
        user_json=JSON.parse(XHR.response)
        window.localStorage.setItem('user_name', user_json.nome);
        window.localStorage.setItem('user_role', user_json.papel);
        window.localStorage.setItem('user_id', user_json.id);
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
XHR.send();

window.addEventListener("load", () => {
    function logout() {
        localStorage.clear();
        window.location.replace("../index.html");
    }
    $('#logout').click(function(){logout(); return false; });
    });
