window.addEventListener("load", () => {
    //Funções para validação das informações abaixo

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para validar o formato do e-mail
        return regex.test(email);
    }

    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g,''); // Remove tudo que não é número
        if (cpf.length !== 11 || /^\d{11}$/.test(cpf) === false) {
            return false; // CPF deve ter 11 dígitos
        }

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        // Verifica o primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let mod = sum % 11;
        let firstDigitVerifier = mod < 2 ? 0 : 11 - mod;

        if (parseInt(cpf.charAt(9)) !== firstDigitVerifier) {
            return false;
        }

        // Verifica o segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }

        mod = sum % 11;
        let secondDigitVerifier = mod < 2 ? 0 : 11 - mod;

        if (parseInt(cpf.charAt(10)) !== secondDigitVerifier) {
            return false;
        }

        return true; // CPF válido
    }

    function validateBirthDate(date) {
        const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(19|20)\d{2}$/; // Expressão regular para validar o formato da data de nascimento
        return regex.test(date);
    }

    function validateAddress(string) {
        const regex = /^[a-zA-Z0-9\s.,-]+$/; // Expressão regular para validar o endereço
        return regex.test(string);
    }

    function validateBankBranch(branch) {
        const regex = /^[0-9]{4}-?[0-9]{1}$/; // Expressão regular para validar o número da agência bancária
        return regex.test(branch);
    }

    function validateBankAccount(account) {
        const regex = /^[0-9]{1,12}-?[0-9]{1}$/; // Expressão regular para validar o número da conta bancária
        return regex.test(account);
    }


  function signUp(usr_role) {
      const XHR = new XMLHttpRequest();
  
      // Define what happens on successful data submission
      XHR.addEventListener("load", (event) => {
        alert('Cadastrado com sucesso!');
        window.location.replace("index.html");
      });
  
      // Define what happens in case of error
      XHR.addEventListener("error", (event) => {
        alert('Não foi possível completar o cadastro.');
      });
  
      // Set up our request
      XHR.open("POST", "http://localhost:8082/usuario");
      XHR.setRequestHeader("Content-type", "application/json");
      
      data='{\"username\": \"';
      data=data+document.getElementById("sign_user").value;
      data=data+'\",    \"email\" : \"';
      data=data+document.getElementById("sign_mail").value;
      data=data+'\",    \"password\": \"';
      data=data+document.getElementById("sign_pwd").value;
      data=data+'\",    \"cpf\": \"';
      data=data+document.getElementById("sign_cpf").value;
      data=data+'\",    \"agenciaBancaria\": \"';
      data=data+document.getElementById("sign_ag").value;
      data=data+'\",    \"contaaBancaria\": \"';
      data=data+document.getElementById("sign_cc").value;
      data=data+'\",    \"dataNascimento\": \"';
      data=data+document.getElementById("sign_dob").value;
      data=data+'\",    \"endereco\": \"';
      data=data+document.getElementById("sign_end").value;
      /*data=data+'\",    \"papel\": \"';
      data=data+usr_role;*/
      data=data+'\"}';
      console.log(data);
      XHR.send(data);

      // The data sent is what the user provided in the form
      //XHR.send(FD);
    }

    function login() {
      const XHR = new XMLHttpRequest();
  
      // Define what happens on successful data submission
      XHR.addEventListener("load", (event) => {
        resposta=JSON.parse(XHR.response)
        if(resposta.hasOwnProperty('token')){
          token=resposta.token
          email=document.getElementById("login_mail").value
          window.localStorage.setItem('user_mail', email)
          window.localStorage.setItem('token', token);
          window.location.replace("./dashboard/index.html");
          //window.localStorage.getItem(token);
      }else{
          alert("Login incorreto.")
      }
       
      });
  
      // Define what happens in case of error
      XHR.addEventListener("error", (event) => {
        alert(target.responseText);
      });
  
      // Set up our request
      XHR.open("POST", "http://localhost:8082/login");
      XHR.setRequestHeader("Content-type", "application/json");
      
      data='{\"email\": \"';
      data=data+document.getElementById("login_mail").value;
      data=data+'\",    \"senha\": \"';
      data=data+document.getElementById("login_pwd").value;
      data=data+'\"}';
      console.log(data);
      XHR.send(data);

      // The data sent is what the user provided in the form
      //XHR.send(FD);
    }
  
    // Get the form element
    const signup_form = document.getElementById("signup-form");
    const login_form= document.getElementById("login-form");
  
    // Add 'submit' event handler
    signup_form.addEventListener("submit", (event) => {
      event.preventDefault();

      //Extract user role
      var ele = document.getElementsByName('role');
      for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)
              usr_role=ele[i].value;
      }

      //Validate the form here previous to the signup call
        if(document.getElementById("sign_pwd").value!=document.getElementById("confirm_pwd").value)
            alert('As senhas não são iguais!');

            // Validação do e-mail
            else if (!validateEmail(document.getElementById("sign_mail").value))
                alert('E-mail inválido!');

            // Validação do CPF
            else if (!validateCPF(document.getElementById("sign_cpf").value))
                alert('CPF inválido!');

            // Validação da data de nascimento
            else if (!validateBirthDate(document.getElementById("sign_dob").value))
                alert('Data de nascimento inválida!');

            // Validação do endereço
            else if (!validateAddress(document.getElementById("sign_end").value))
                alert('Endereço inválido!');

            // Validação da agência bancária
            else if (!validateBankBranch(document.getElementById("sign_ag").value))
                alert('Agência bancária inválida!');

            // Validação da conta corrente
            else if (!validateBankAccount(document.getElementById("sign_cc").value))
                alert('Conta corrente inválida!');

            // Se todas as validações ocorreram, segue com o cadastro
            else
                signUp(usr_role);
    });

    login_form.addEventListener("submit", (event) => {
      event.preventDefault();
      login();
    });
  });