const XHR = new XMLHttpRequest();

XHR.addEventListener("load", (event) => {
    if(XHR.DONE==4 && XHR.status==200){
        console.log("Login correto.")
        user_json=JSON.parse(XHR.response)
        window.localStorage.setItem('user_name', user_json.nome);
        window.localStorage.setItem('user_role', user_json.papel);
        window.localStorage.setItem('user_id', user_json.id);
        $("#user_name").html(user_json.nome)
        $("#user_name_opt").html(user_json.nome);
        if(user_json.papel==3){
            var locat_only_itms = document.getElementsByClassName('locat_only');
            for (var i = 0; i < locat_only_itms.length; i ++) {
                locat_only_itms[i].className += ' d-none';
            }
        }else if(user_json.papel==2){
            var locad_only_itms = document.getElementsByClassName('locad_only');
            for (var i = 0; i < locad_only_itms.length; i ++) {
                locad_only_itms[i].className += ' d-none';
            }
        }
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
