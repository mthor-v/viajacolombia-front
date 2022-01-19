<template>
  <div class="signUp_user">
    <div class="container_greeting">
      <h2>¡Regístrate! Es muy fácil...</h2>
      <div>
        <p>Solo diligencia tus datos en el formulario y podrás conocer una nueva forma 
          rápida y segura de adquirir tus tiquetes de viaje. <br>Adelante...</p>
      </div>
    </div>
    <div class="container_signUp_user">
      <form v-on:submit.prevent="processSignUp">
        <input type="text" v-model="user.dniUser" placeholder="Documento/NIT" required/>
        <br />
        <input type="password" v-model="user.password" placeholder="Contraseña" required/>
        <br />
        <input type="text" v-model="user.name" placeholder="Nombre" required>
        <br />
        <input type="text" v-model="user.last_name" placeholder="Apellido" />
        <br />
        <input type="email" v-model="user.email" placeholder="Email" required/>
        <br />
        <input type="number" v-model="user.phone" placeholder="Celular" required/>
        <br />
        <select name="role" v-model="user.role" required>
          <option value="Usuario">Usuario</option>
          <option value="Empresa">Empresa</option>
        </select>
        <br />
        <button type="submit">¡Estoy listo!</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SignUp",
  emits: ["completedSignUp"],
  data: function () {
    return {
      user: {
        dniUser: "",
        password: "",
        name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
      },
    };
  },
  methods: {
    processSignUp: function () {
      axios
        .post("https://bookingapp-back.herokuapp.com/create/", this.user, {
          headers: {},
        })
        .then((result) => {
          let dataSignUp = {
            dniUser: this.user.dniUser,
            role: this.user.role,
            token_access: result.data.access,
            token_refresh: result.data.refresh,
          };
          this.$emit("completedSignUp", dataSignUp);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == "400")
            alert("Usuario ya existe.");else {
              alert("ERROR: Fallo en el registro.");
            }
          
        });
    },
  },
};
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300&family=Fira+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300&display=swap');

.signUp_user {
  margin: 0;
  padding: 0%;
  height: 100%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content:space-evenly;
}
.container_greeting {
  border-radius: 5px;
  width: 35%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.container_greeting h2{
  color:antiquewhite;
  font-family: 'Fira Sans', sans-serif;
  font-size: xx-large;
  text-shadow: 2px 2px #152D35;
}
.container_greeting p{
  color: #D4ECDD;
  text-align: center;
  font-size: 23px;
  font-family: 'Mukta', sans-serif;
  text-shadow: 1px 1px #152D35;
}
.container_signUp_user {
  border-radius: 10px;
  width: 25%;
  height: 93%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.signUp_user form {
  width: 70%;
  
}
.signUp_user input {
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  margin: 5px 0;
  border: 1px solid #283747;
  font-family: "Cairo", sans-serif;
}
.signUp_user select {
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  margin: 5px 0;
  border: 1px solid #283747;
  font-family: "Cairo", sans-serif;
  text-shadow: 1px 1px #152D35;
}
.signUp_user button {
  width: 100%;
  height: 40px;
  line-height: 15px;
  color: #e5e7e9;
  background: #283747;
  border: 1px solid #e5e7e9;
  border-radius: 5px;
  padding: 10px 25px;
  margin: 5px 0 25px 0;
  font-size: 17px;
  font-family: "Cairo", sans-serif;
}
.signUp_user button:hover {
  color: #D4ECDD;
  background: #22577A;
  border: 1px solid #283747;
  text-shadow: 3px 3px #152D35;
}
</style>