<template>
  <div class="put_user">
    <div class="container_put_user">
      <form v-on:submit.prevent="processPutUser">
        <input
          type="password"
          v-model="user.password"
          placeholder="Contraseña" required
        />
        <br />
        <input type="text" v-model="user.name" placeholder="Nombre" required/>
        <br />
        <input type="text" v-model="user.last_name" placeholder="Apellido" />
        <br />
        <input type="email" v-model="user.email" placeholder="Email" required/>
        <br />
        <input type="number" v-model="user.phone" placeholder="Celular" required/>
        <br />
        <button type="submit">Cambiar</button>
      </form>
    </div>
    <div class="container_index">
      <h2>Edita tus datos de contacto</h2>
      <div>
        <p>
          Actualiza los datos que están el formulario y listo... <br />
          Solo tienes que iniciar sesión de nuevo <br />Adelante...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "putUser",
  emits: ["logOut","completedPut"],
  data: function () {
    return {
      user: {
        password: "",
        name: "",
        last_name: "",
        email: "",
        phone: "",
        role: localStorage.getItem("role"),
      },
    };
  },
  methods: {
    processPutUser: async function () {
      console.log(this.user);
      if (
        localStorage.getItem("token_access") === null ||
        localStorage.getItem("token_refresh") === null
      ) {
        this.$emit("logOut");
        return;
      }
      await this.verifyToken();
      let token = localStorage.getItem("token_access");
      axios
        .put("https://bookingapp-back.herokuapp.com/user/", this.user, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          let dataPut = {
            dniUser: result.data.dniUser,
          };
          this.$emit("completedPut", dataPut);
        })
        .catch((error) => {
          if (error.response.status == "401")
            alert("ERROR 401: Credenciales Incorrectas.");
        });
    },
    verifyToken: function () {
      return axios
        .post(
          "https://bookingapp-back.herokuapp.com/refresh/",
          { refresh: localStorage.getItem("token_refresh") },
          { headers: {} }
        )
        .then((result) => {
          localStorage.setItem("token_access", result.data.access);
        })
        .catch(() => {
          this.$emit("logOut");
        });
    },
    // created: async function () {
    //   this.processPutUser();
    // },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@300&family=Fira+Sans&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Mukta:wght@300&display=swap");

.put_user {
  margin: 0;
  padding: 0%;
  height: 100%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
}
.container_index {
  border-radius: 5px;
  width: 35%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.container_index h2 {
  color: antiquewhite;
  font-family: "Fira Sans", sans-serif;
  font-size: xx-large;
  text-shadow: 2px 2px #152d35;
}
.container_index p {
  color: #d4ecdd;
  text-align: center;
  font-size: 23px;
  font-family: "Mukta", sans-serif;
  text-shadow: 1px 1px #152d35;
}
.container_put_user {
  border-radius: 10px;
  width: 25%;
  height: 93%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.put_user form {
  width: 70%;
}
.put_user input {
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  margin: 5px 0;
  border: 1px solid #283747;
  font-family: "Cairo", sans-serif;
}
.put_user button {
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
.put_user button:hover {
  color: #D4ECDD;
  background: #22577A;
  border: 1px solid #283747;
  text-shadow: 3px 3px #152D35;
}
</style>