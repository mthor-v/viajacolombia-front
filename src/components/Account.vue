<template>
  <div v-if="loaded" class="information">
    <div class="inter">
      <h1>Información de Usuario:</h1>
      <h2>Identificación: <span>{{ dniUser }}</span></h2>
      <h2>Nombre: <span>{{ name }}</span></h2>
      <h2>Teléfono: <span>{{ phone }}</span></h2>
      <h2>Correo electrónico: <span>{{ email }}</span></h2>
    </div>
    <div>
      <button v-on:click="loadPutUser">Editar Datos</button>
      <button v-on:click="deleteUser">Eliminar cuenta</button>
    </div>
  </div>
</template>

<script>

// import jwt_decode from "jwt-decode";
import axios from "axios";

export default {
  name: "Account",
  emits: ["logout","completeDelete"],
  data: function () {
    return {
      dniUser: "",
      name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      loaded: false,
    };
  },
  methods: {
    getData: async function () {
      if (
        localStorage.getItem("token_access") === null ||
        localStorage.getItem("token_refresh") === null
      ) {
        this.$emit("logOut");
        return;
      }
      await this.verifyToken();
      let token = localStorage.getItem("token_access");
      // let userId = jwt_decode(token).user_id.toString();
      axios
        .get(
          `https://bookingapp-back.herokuapp.com/user/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((result) => {
          this.dniUser = result.data.dniUser;
          this.name = result.data.name;
          this.last_name = result.data.last_name;
          this.email = result.data.email;
          this.phone = result.data.phone;
          this.role = result.data.role;
          this.loaded = true;
        })
        .catch(() => {
          this.$emit("logOut");
        });
    },
    loadPutUser: function () {
      this.$router.push({ name: "putUser" });
    },
    deleteUser: function() {
      let approve = confirm("¿Estás seguro de eliminar tu cuenta?")
      if (approve){
        if (
        localStorage.getItem("token_access") === null ||
        localStorage.getItem("token_refresh") === null
        ) {
        this.$emit("logOut");
        return;
        }
        let token = localStorage.getItem("token_access");
        return axios
          .delete(
            `https://bookingapp-back.herokuapp.com/user/del/${localStorage.getItem("dniUser")}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          this.$emit("completeDelete")
        }
        else{
          alert("Gracias por permanecer con nosotros")
        }
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
  },
  created: async function () {
    this.getData();
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&family=Yanone+Kaffeesatz:wght@300;400&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@200&display=swap");

.information {
  margin: 0;
  padding: 0%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.inter{
  display: flex;
  align-items: center;
}
.information h1 {
  font-size: 60px;
  color: rgba(212, 236, 221, .9);
  font-family: 'IBM Plex Sans', sans-serif;
  text-shadow: 4px 4px #0000;
}
.information h2 {
  font-size: 40px;
  color: #283747;
  font-family: 'Yanone Kaffeesatz', sans-serif;
  text-shadow: 1px 1px rgba(212, 236, 221, .9);
}
.information span {
  color: crimson;
  font-weight: bold;
  font-family: 'Yanone Kaffeesatz', sans-serif;
  font-weight: lighter;
}
.information button{
  margin: 10px;
  color: #e5e7e9;
  background: #464660;
  border-radius: 8px 0px;
  width: 130px;
  height: 40px;
  font-family: "Cairo", sans-serif;
  font-size: 17px;
}
.information button:hover{
  color: #00A19D;
  text-decoration: none;
  text-shadow: 1px 1px #368B85;
}
</style>