<template>
  <div class="sidebar">
    <ul>
      <li></li>
      <li><a v-on:click="loadRoutes">Rutas</a></li>
      <li><a v-on:click="loadBook">Reservas</a></li>
      <li><a v-on:click="loadPrc">Compras</a></li>
    </ul>
  </div>
  <div class="greeting" v-if="greeting">
    <h1>¡Bienvenido!</h1>
  </div>
  <div class="b-component" v-if="Routes">
    <div class="search">
      <form class="boxes" v-on:submit.prevent="getData">
        <input type="text" v-model="t_from" placeholder="Origen" />
        <input type="text" v-model="t_to" placeholder="Destino" />
        <button type="submit">Buscar</button>
      </form>
      <div class="table-wrapper" v-if="find">
        <table class="fl-table">
          <tr>
            <th>ID Ruta</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha</th>
            <th>Duración</th>
            <th>Servicio</th>
            <th>Precio</th>
            <th>Empresa</th>
            <th>Reservar</th>
          </tr>
          <tr v-for="r in trips" :key="r">
            <td>{{ r.id_trip }}</td>
            <td>{{ r.from }}</td>
            <td>{{ r.to }}</td>
            <td>{{ r.date }}</td>
            <td>{{ r.duration }} Hs</td>
            <td>{{ r.service }}</td>
            <td>COP {{ r.rate }}</td>
            <td>{{ r.company }}</td>
            <td><button @click="bookTicket(r.id_trip)"></button></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <div class="b-component" v-if="bookn">
    <div class="table-wrapper">
      <table class="fl-table">
        <tr>
          <th>ID Ruta</th>
          <th>Origen</th>
          <th>Destino</th>
          <th>Fecha</th>
          <th>Duración</th>
          <th>Servicio</th>
          <th>Precio</th>
          <th>Empresa</th>
          <th>Vehiculo</th>
          <th>Comprar</th>
          <th>Eliminar</th>
        </tr>
        <tr v-for="r in book" :key="r">
          <td>{{ r.route.id_trip }}</td>
          <td>{{ r.route.from }}</td>
          <td>{{ r.route.to }}</td>
          <td>{{ r.route.date }}</td>
          <td>{{ r.route.duration }} Hs</td>
          <td>{{ r.route.service }}</td>
          <td>COP {{ r.route.rate }}</td>
          <td>{{ r.route.company }}</td>
          <td>{{ r.route.vehicle }}</td>
          <td>
            <button @click="buyTicket(r.id_ticket, r.route.id_trip)"></button>
          </td>
          <td><button @click="deleteTicket(r.id_ticket)"></button></td>
        </tr>
      </table>
    </div>
  </div>
  <div class="b-component" v-if="ok">
    <div class="table-wrapper">
      <table class="fl-table">
        <tr>
          <th>ID ticket</th>
          <th>ID Ruta</th>
          <th>Origen</th>
          <th>Destino</th>
          <th>Fecha</th>
          <th>Duración</th>
          <th>Servicio</th>
          <th>Precio</th>
          <th>Empresa</th>
          <th>Vehiculo</th>
        </tr>
        <tr v-for="r in tkOk" :key="r">
          <td>{{ r.id_ticket }}</td>
          <td>{{ r.route.id_trip }}</td>
          <td>{{ r.route.from }}</td>
          <td>{{ r.route.to }}</td>
          <td>{{ r.route.date }}</td>
          <td>{{ r.route.duration }} Hs</td>
          <td>{{ r.route.service }}</td>
          <td>COP {{ r.route.rate }}</td>
          <td>{{ r.route.company }}</td>
          <td>{{ r.route.vehicle }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data: function () {
    return {
      Routes: false,
      greeting: true,
      find: false,
      bookn: false,
      ok: false,
      t_from: "",
      t_to: "",
      trips: [],
      book: [],
      tkOk: [],
    };
  },
  methods: {
    loadRoutes() {
      this.Routes = true;
      this.greeting = false;
      this.bookn = false;
      this.find = false;
      this.ok = false;
    },
    loadBook() {
      let token = localStorage.getItem("token_access");
      axios
        .get(`https://bookingapp-back.herokuapp.com/ticket/get-del/False/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.book = result.data;
          console.log(result.data);
        })
        .catch(() => {
          alert("error");
          // this.$emit("logOut");
        });
      this.Routes = false;
      this.find = false;
      this.greeting = false;
      this.ok = false;
      this.bookn = true;
    },
    loadPrc: function() {
      let token = localStorage.getItem("token_access");
      axios
        .get(`https://bookingapp-back.herokuapp.com/ticket/get-del/True/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.tkOk = result.data;
          console.log(result.data);
        })
        .catch(() => {
          alert("error");
          // this.$emit("logOut");
        });
      this.Routes = false;
      this.find = false;
      this.greeting = false;
      this.bookn = false;
      this.ok = true;
    },
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
        .get(`https://bookingapp-back.herokuapp.com/route/user/${this.t_from}-${this.t_to}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.trips = result.data;
          console.log(result.data);
          this.find = true;
        })
        .catch(() => {
          alert("error");
          // this.$emit("logOut");
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
    bookTicket: function (id) {
      let ticket = {
        get_ticket: false,
        dni_User: localStorage.getItem("dniUser").toString(),
        id_trip: id,
      };
      let token = localStorage.getItem("token_access");
      let approve = confirm(`¿Quieres reservar el viaje ${id}?`);
      if (approve) {
        axios
          .post("https://bookingapp-back.herokuapp.com/ticket/", ticket, {
            headers: { Authorization: `Bearer ${token}`},
          })
          .then((result) => {
            alert("¡Reserva creada con éxito!");
          })
          .catch((error) => {
            console.log(error);
            alert("ERROR: Fallo en la reserva.");
          });
      } else {
        alert("Tienes muchas mas opciones para elegir.");
      }
      console.log(ticket);
    },
    buyTicket: async function (idTicket, idTrip) {
      let ticket = {
        id_ticket: idTicket,
        get_ticket: true,
        dni_User: localStorage.getItem("dniUser"),
        id_trip: idTrip,
      };
      console.log(ticket);
      if (
        localStorage.getItem("token_access") === null ||
        localStorage.getItem("token_refresh") === null
      ) {
        // this.$emit("logOut");
        alert("error");
        return;
      }
      await this.verifyToken();
      let token = localStorage.getItem("token_access");
      axios
        .put("https://bookingapp-back.herokuapp.com/ticket/", ticket, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          console.log(result);
          alert("¡Tiquete confirmado!")
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == "401")
            alert("ERROR 401: Credenciales Incorrectas.");
        });
    },
    deleteTicket: function (idTicket) {
      let approve = confirm("¿Estás seguro de eliminar la reserva?");
      if (approve) {
        if (
          localStorage.getItem("token_access") === null ||
          localStorage.getItem("token_refresh") === null
        ) {
          // this.$emit("logOut");
          alert("error")
          return;
        }
        let token = localStorage.getItem("token_access");
        return (
          axios.delete(
            `https://bookingapp-back.herokuapp.com/ticket/get-del/${localStorage.getItem("dniUser")}-${idTicket}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          alert("Reserva eliminada.")
        );
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@300&family=Fira+Sans&display=swap");
.sidebar {
  margin: 15px 0 15px 10px;
  position: absolute;
  width: 200px;
  height: 70vh;
  background: #152d35;
  border-radius: 5px;
}
.sidebar ul li {
  text-align: center;
  padding: 5px 5px;
  list-style: none;
  border-bottom: 1px solid rgba(100, 100, 100, 0.3);
  font-family: "Cairo", sans-serif;
}
.sidebar ul button {
  color: rgba(212, 236, 221, 0.9);
  background-color: #152d35;
  font-size: 20px;
  text-decoration: none;
  text-shadow: 1px 1px #0000;
}
.sidebar ul li a {
  color: rgba(212, 236, 221, 0.9);
  font-size: 20px;
  text-decoration: none;
  text-shadow: 1px 1px #0000;
  cursor: pointer;
}
.sidebar ul li a:hover {
  color: #6b7aa1;
  text-decoration: none;
  text-shadow: 1px 1px #368b85;
}
.logo {
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
.greeting {
  margin: 0 0 0 210px;
  padding: 0%;
  height: 100%;
  width: 84%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Cairo", sans-serif;
  font-size: xx-large;
}
.b-component {
  margin: 0 0 0 210px;
  padding: 0%;
  height: 100%;
  width: 84%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Cairo", sans-serif;
}
.b-component input {
  width: 300px;
  height: 40px;
  border-radius: 5px;
  font-size: 18px;
}
.b-component button {
  width: 70px;
  height: 40px;
  color: #e5e7e9;
  background: #283747;
  border: 1px solid #e5e7e9;
  border-radius: 5px;
  font-family: inherit;
}
.search {
  height: 50%;
}
/* ---Table---- */
.table-wrapper {
  margin: 10px 0px 0px;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
  justify-content: center;
  align-items: center;
}

.buy-button {
  display: flex;
  margin: 3px 40%;
}
.buy-button button {
  text-shadow: 1px 1px #368b85;
  font-size: 16px;
}

.buy-button button:hover {
  background: #63b4b8;
  color: #4b3869;
  text-shadow: 1px 1px #a5e1ad;
}

.fl-table {
  border-radius: 5px;
  font-size: 17px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  max-height: 50vh;
  white-space: nowrap;
  background-color: white;
}

.fl-table td,
.fl-table th {
  text-align: center;
  padding: 1px;
}

.fl-table td {
  border-right: 1px solid #f8f8f8;
  font-size: 17px;
}

.fl-table thead th {
  color: #ffffff;
  background: #4fc3a1;
}

.fl-table thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}

.fl-table tr:nth-child(even) {
  background: #f8f8f8;
}

.fl-table td button {
  width: 17px;
  height: 17px;
  border-radius: 50%;
}

.fl-table td button:hover {
  background: #63b4b8;
}

.fl-table input {
  width: 15px;
  height: 15px;
}

/* Responsive */

@media (max-width: 767px) {
  .fl-table {
    display: block;
    width: 100%;
  }
  .table-wrapper:before {
    content: "Scroll horizontally >";
    display: block;
    text-align: right;
    font-size: 11px;
    color: white;
    padding: 0 0 10px;
  }
  .fl-table thead,
  .fl-table tbody,
  .fl-table thead th {
    display: block;
  }
  .fl-table thead th:last-child {
    border-bottom: none;
  }
  .fl-table thead {
    float: left;
  }
  .fl-table tbody {
    width: auto;
    position: relative;
    overflow-x: auto;
  }
  .fl-table td,
  .fl-table th {
    padding: 20px 0.625em 0.625em 0.625em;
    height: 60px;
    vertical-align: middle;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    width: 120px;
    font-size: 13px;
    text-overflow: ellipsis;
  }
  .fl-table thead th {
    text-align: left;
    border-bottom: 1px solid #f7f7f9;
  }
  .fl-table tbody tr {
    display: table-cell;
  }
  .fl-table tbody tr:nth-child(odd) {
    background: none;
  }
  .fl-table tr:nth-child(even) {
    background: transparent;
  }
  .fl-table tr td:nth-child(odd) {
    background: #f8f8f8;
    border-right: 1px solid #e6e4e4;
  }
  .fl-table tr td:nth-child(even) {
    border-right: 1px solid #e6e4e4;
  }
  .fl-table tbody td {
    display: block;
    text-align: center;
  }
}
</style>