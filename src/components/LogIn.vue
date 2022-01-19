<template>
  <div class="logIn_user">
    <div class="container_logIn_user">
      <h2>Iniciar sesión</h2>
      <form v-on:submit.prevent="processLogInUser">
        <input type="text" v-model="user.dniUser" placeholder="Username" />
        <br />
        <input type="password" v-model="user.password" placeholder="Password" />
        <br />
        <button type="submit">¡Vamos!</button>
      </form>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from "axios";
export default {
  name: "LogIn",
  emits: ["completedLogIn"],
  data: function () {
    return {
      user: {
        dniUser: "",
        password: "",
      },
      token_access: "",
      token_refresh: "",
    };
  },
  methods: {
    processLogInUser: function () {
      console.log(this.user);

      axios
        .post("https://bookingapp-back.herokuapp.com/login/", this.user, {
          headers: {},
        })
        .then((result) => {
          console.log("hasta aqui bien");
          this.token_access = result.data.access;
          this.token_refresh = result.data.refresh;
          
          this.obtainRole();
          console.log(result);
        })
        .catch((error) => {
          if (error.response.status == "401")
            alert("ERROR 401: Credenciales Incorrectas.");
        });
    },
    obtainRole: function() {
      let token = this.token_access;
      // let userId = jwt_decode(token).user_id.toString();
      axios
        .get(
          `https://bookingapp-back.herokuapp.com/user/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((result) => {
          let dataLogIn = {
            role: result.data.role,
            token_access: this.token_access,
            token_refresh: this.token_refresh,
            dniUser: result.data.dniUser,
          } 
          console.log(dataLogIn);
          this.$emit("completedLogIn", dataLogIn);
        })
        .catch(() => {
          this.$emit("logOut");
        });
    }
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300&family=Fira+Sans&display=swap');

.logIn_user {
  margin: 0;
  padding: 0;
  border: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Cairo", sans-serif;
}
.container_logIn_user {
  border-radius: 10px;
  width: 25%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.logIn_user h2 {
  color: #D4ECDD;
  text-shadow: 1px 1px #152D35;
  font-size: 30px;
}
.logIn_user form {
  width: 70%;
}
.logIn_user input {
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  margin: 5px 0;
  border: 1px solid #283747;
  font-family: inherit;
}
.logIn_user button {
  width: 100%;
  height: 40px;
  line-height: 15px;
  color: #e5e7e9;
  background: #283747;
  border: 1px solid #e5e7e9;
  border-radius: 5px;
  padding: 10px 25px;
  margin: 5px 0;
  font-family: inherit;
  font-size: 17px;
  text-shadow: 1px 1px #152D35;
}
.logIn_user button:hover {
  color: #D4ECDD;
  background: #22577A;
  border: 1px solid #283747;
  text-shadow: 3px 3px #152D35;
}
</style>