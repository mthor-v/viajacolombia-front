<template>
  <div id="app" class="app">
    <div class="header">
      <img src="./assets/bus.png" width="82" height="62" />
      <h1>Viaja Colombia</h1>
      <nav>
        <button v-if="is_auth" v-on:click="loadHome">Inicio</button>
        <button v-if="is_company_auth" v-on:click="loadCompanyHome">Inicio</button>
        <button v-if="button_active" v-on:click="loadAccount">Cuenta</button>
        <button v-if="button_active" v-on:click="logOut">Cerrar Sesión</button>
        <button v-if="!button_active" v-on:click="loadLogIn">Iniciar Sesión</button>
        <button v-if="!button_active" v-on:click="loadSignUp">Registrarse</button>
      </nav>
    </div>
    <div class="main-component">
      <router-view
        v-on:completedLogIn="completedLogIn"
        v-on:completedSignUp="completedSignUp"
        v-on:completedPut="completedPut"
        v-on:completeDelete="completeDelete"
        v-on:logOut="logOut"
        v-on:completedHunt="completedHunt"
        v-on:completedRoute="completedRoute"
      >
      </router-view>
    </div>
    <div class="footer">
      <h2>Transporte terrestre de pasajeros - Misión TIC 2022</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function () {
    return {
      button_active: false,
      is_auth: false,
      is_company_auth: false,
    };
  },
  components: {},
  methods: {
    verifyMain: function() {
      this.is_auth = localStorage.getItem("isAuth") || false;
      this.is_company_auth = localStorage.getItem("isCompanyAuth") || false;
      if (this.is_auth == false && this.is_company_auth == false) {this.$router.push({ name: "signUp" })}
      this.verifyAuth();
    },
    verifyAuth: function () {
      this.is_auth = localStorage.getItem("isAuth") || false;
      if (this.is_auth == false) this.verifyCompanyAuth();//this.$router.push({ name: "signUp" });
      else {
        this.button_active = true;
        this.$router.push({ name: "home" })};
    },
    verifyCompanyAuth: function () {
      this.is_company_auth = localStorage.getItem("isCompanyAuth") || false;
      if (this.is_company_auth == false) this.$router.push({ name: "signUp" });
      else {
        this.button_active = true;
        this.$router.push({ name: "company" })};
    },
    loadLogIn: function () {
      this.$router.push({ name: "logIn" });
    },
    loadSignUp: function () {
      this.$router.push({ name: "signUp" });
    },
    loadHome: function () {
      this.$router.push({ name: "home" });
    },
    loadCompanyHome: function () {
      this.$router.push({ name: "company" });
    },
    logOut: function () {
      localStorage.clear();
      alert("Sesión Cerrada");
      this.button_active = false;
      this.is_company_auth = false;
      this.verifyMain();
    },
    loadAccount: function () {
      this.$router.push({ name: "account" });
    },
    completedLogIn: function (data) {
      // localStorage.setItem("isAuth", true);
      localStorage.setItem("dniUser", data.dniUser);
      localStorage.setItem("role", data.role);
      localStorage.setItem("token_access", data.token_access);
      localStorage.setItem("token_refresh", data.token_refresh);
      // alert("Autenticación Exitosa");
      this.verifyRole();
    },
    verifyRole: function() {
      let role = localStorage.getItem("role");
      if (role === 'Usuario'){
        localStorage.setItem("isAuth", true);
        this.verifyMain();
      } 
      else if (role === 'Empresa') {
        localStorage.setItem("isCompanyAuth", true);
        console.log('empresa')
        this.verifyMain();
      }
    },
    completedSignUp: function (data) {
      alert("Registro Exitoso");
      this.completedLogIn(data);
    },
    completedPut: function (){
      alert("¡Actualización exitosa!");
      this.logOut()
    },
    completeDelete: function (){
      alert("¡Tu cuenta se ha dado de baja!");
      this.logOut()
    },
    completedHunt: function(){
      alert("Ok");
    },
    completedRoute: function(data) {
      alert(data.message);
      this.verifyCompanyAuth();
    }
  },
  created: function () {
    this.verifyMain();
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Georama:wght@600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@200&display=swap");
*{
  margin: 0;
  padding: 0;
}
body {
  margin: 0 0 0 0;
  border: 0;
  padding: 0;
}
.header {
  margin: 0%;
  padding: 0;
  width: 100%;
  height: 10vh;
  min-height: 100px;
  background-color: #368b85;
  color: #f1e9e5;
  display: flex;
  align-items: center;
  box-shadow: inset 0px -5px 5px #57cc99, inset 0px -10px 5px #38a3a5;
  
}
.header h1 {
  width: 70%;
  text-align: left;
  font-family: "Georama", sans-serif;
  font-size: 37pt;
}
.header nav {
  margin: 40px 10px 0 0 ;
  height: 100%;
  width: 30%;
  display: flex;
  /* justify-content: space-around; */
  align-items: right;
  font-size: 20px;
  justify-content:right;
}
.header nav button {
  color: #e5e7e9;
  background: #464660;
  /* border: 1px solid #e5e7e9; */
  border-radius: 5px;
  height: 45px;
  /* padding: 5px 20px; */
  font-family: "Cairo", sans-serif;
  font-size: 18px;

  background-color: #368b85;
  /* box-shadow: inset 0px -5px 5px #57cc99, inset 0px -10px 5px #38a3a5; */
}
.header nav button:hover {
  color: #e5e7e9;
  background: #345b63;
  border: 1px solid #e5e7e9;
}
.main-component {
  
  height:78vh;
  margin: 0%;
  padding: 0%;
  background: #fdfefe;
  background-image: url(https://image.freepik.com/foto-gratis/resumen-borroso-e-interior-terminal-aeropuerto-changi-desenfocado_74190-6378.jpg);
  background-size: cover;
  background-position-y: center;
  margin-bottom: 0;
}
.footer {
  padding: -5px;
  width: 100%;
  height: 9vh;
  min-height: 45px;
  background-color: #368b85;
  color: #beecdf;
  box-shadow: inset 0px 5px 5px #57cc99, inset 0px 10px 5px #38a3a5;
  font-family: "Cairo", sans-serif;
  
}
.footer h2 {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: larger;
}
</style>

