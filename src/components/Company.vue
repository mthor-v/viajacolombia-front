<template>
  <div class="main">
    <div class="sidebar">
      <ul>
        <li></li>
        <li><a v-on:click="createRoutes">Crear ruta</a></li>
        <li><a v-on:click="loadRoute">Consultar ruta</a></li>
        <li><a v-on:click="allRoutes">Mis rutas</a></li>
      </ul>
    </div>
    <div class="greeting" v-if="greeting">
        <h1>¡Bienvenido!</h1>
    </div>
    <div class="operation-box" v-if="create">
      <div class="container_about">
        <h2>Regístra tus rutas:</h2>
        <div>
          <p>
            - ID de ruta: (ej.BT487) las iniciales de la empresa en mayuscula mas un codigo unico interno. <br>
            - Fecha y hora: Formato recomendado AAAA-MM-DD HH:MM. <br>
            - Duración: Expresada en horas, formato recomendado HH:MM. <br>
            - Tipo de servicio: Basic, Premium y Elite. <br>
            - Valor del tiquete: Sin puntos ni simbolos. <br>
          </p>
        </div>
      </div>
      <div class="container_create">
        <form v-on:submit.prevent="processRoute">
          <input type="text" v-model="route.id_trip" placeholder="ID Ruta" required />
          <br />
          <input
            type="text"
            v-model="route.t_from"
            placeholder="Origen"
            required
          />
          <br />
          <input
            type="text"
            v-model="route.t_to"
            placeholder="Destino"
            required
          />
          <br />
          <input
            type="text"
            v-model="route.date"
            placeholder="Fecha y Hora"
            required
          />
          <br />
          <input type="text" v-model="route.duration" placeholder="Duración" />
          <br />
          <select name="service" v-model="route.service" required>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Elite">Elite</option>
          </select>
          <input
            type="number"
            v-model="route.rate"
            placeholder="Valor tiquete"
            required
          />
          <br />
          <input
            type="text"
            v-model="route.id_vehicle"
            placeholder="Placa vehiculo"
            required
          />
          <br />
          <input
            type="text"
            v-model="route.company"
            placeholder="Nombre de Empresa"
            required
          />
          <br />
          <button type="submit">¡Crear!</button>
        </form>
      </div>
    </div>
    <div class="operation-box" v-if="allR">
      <div class="table-wrapperr">
        <table class="flr-table">
          <tr>
            <th>ID Ruta</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha</th>
            <th>Duración</th>
            <th>Servicio</th>
            <th>Precio</th>
            <th>Vehiculo</th>
            <th>Eliminar</th>
          </tr>
          <tr v-for="r in routes" :key="r">
            <td>{{ r.id_trip }}</td>
            <td>{{ r.from }}</td>
            <td>{{ r.to }}</td>
            <td>{{ r.date }}</td>
            <td>{{ r.duration }} Hs</td>
            <td>{{ r.service }}</td>
            <td>COP {{ r.rate }}</td>
            <td>{{ r.vehicle }}</td>
            <td><button id="butt" @click="deleteRoute(r.id_trip)"></button></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="operation-box" v-if="loadR">
        <div class="search">
      <form class="boxes" v-on:submit.prevent="getTickets">
        <input type="text" v-model="id_trip" placeholder="ID de ruta" />
        <button type="submit">Buscar</button>
      </form>
      <div class="table-wrapper" v-if="find">
        <table class="fl-table">
          <tr>
            <th>No.Ticket</th>
            <th>Estado</th>
            <th>Doc.Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
          </tr>
          <tr v-for="r in tickets" :key="r">
            <td>{{ r.ticket }}</td>
            <td>{{ r.get }}</td>
            <td>{{ r.user.dniUser }}</td>
            <td>{{ r.user.name }}</td>
            <td>{{ r.user.last }} Hs</td>
            <td>{{ r.user.phone }}</td>
          </tr>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "company",
  data: function () {
    return {
      create: false,
      allR: false,
      loadR: false,
      find: false,
      greeting: true,
      route: {
        id_trip: "",
        t_from: "",
        t_to: "",
        date: "",
        duration: "",
        service: "",
        rate: "",
        id_vehicle: "",
        company: "",
        id_company: localStorage.getItem("dniUser"),
      },
      id_trip: "",
      routes: [],
      tickets: [],
    };
  },
  methods: {
    createRoutes: function () {
      this.allR = false;
      this.loadR = false;
      this.greeting = false;
      this.create = true;
    },
    processRoute: function () {
      let token = localStorage.getItem("token_access");
      axios
        .post("https://bookingapp-back.herokuapp.com/route/", this.route, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          let dataCreate = {
            message: result.data.message,
          };
          this.$emit("completedRoute", dataCreate);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == "400") alert("Error al crear.");
          else {
            alert("ERROR: Fallo en el registro.");
          }
        });
    },
    allRoutes: function () {
      let token = localStorage.getItem("token_access");
      axios
        .get("https://bookingapp-back.herokuapp.com/route/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.routes = result.data;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == "400") alert("Usuario ya existe.");
          else {
            alert("ERROR: Fallo en la operación.");
          }
        });
        this.create = false;
        this.greeting = false;
        this.allR = true;
    },
    loadRoute: function () {
        this.allR = false;
        this.create = false;  
        this.greeting = false;      
        this.loadR = true;
    },
    deleteRoute:function (data){
      let approve = confirm("¿Estás seguro de eliminar la ruta?");
      let token = localStorage.getItem("token_access");
      if (approve) {
        axios
          .delete(
            `https://bookingapp-back.herokuapp.com/route/del/${localStorage.getItem("dniUser")}-${data}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((result) => {
            alert(result.data.message);
          })
          .catch((error) => {
            console.log(error);
            alert("ERROR: Fallo al eliminar la ruta.");
          });
      } else {
        alert("No se ha eliminado la ruta.");
      }
    },
    getTickets: function() {
        let token = localStorage.getItem("token_access");
        axios
        .get(`https://bookingapp-back.herokuapp.com/ticket/${this.id_trip}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.tickets = result.data;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == "401")
            alert("No está autorizado para ver esta ruta.");else {
              alert("ERROR: Fallo en la busqueda.");
            }
        });
        this.find = true;
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@300&family=Fira+Sans&display=swap");

.main {
  background-image: url(https://images.pexels.com/photos/210647/pexels-photo-210647.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=750&amp;w=1260);
  background-size: cover;
  background-position-y: center;
  /* margin-bottom: 0; */
  width: 100%;
  height: 100%;
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

/* -------------------- */
.operation-box {
  margin: 0 0 0 210px;
  padding: 0%;
  height: 100%;
  width: 84%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Cairo", sans-serif;
}
.container_about {
  border-radius: 5px;
  width: 35%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(212, 236, 221, 0.6);
}
.container_about h2 {
  color: antiquewhite;
  font-family: "Fira Sans", sans-serif;
  font-size: xx-large;
  text-shadow: 2px 2px #152d35;
}
.container_about p {
  color: #112031;
  text-align: left;
  font-size: 20px;
  font-family: "Mukta", sans-serif;
  text-shadow: 1px 1px #627488;
  font-style: 2px;
}
.container_create {
  border-radius: 10px;
  width: 35%;
  height: 93%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  margin: 0 40px;
  padding: 10px 0 0 0;
}
.operation-box form {
  width: 80%;
  padding: 1px 1px;
  margin-inline: 3px;
}
.operation-box form button{
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
.operation-box form button:hover{ 
  color: #d4ecdd;
  background: #22577a;
  border: 1px solid #283747;
  text-shadow: 3px 3px #152d35;
}
.operation-box input {
  height: 35px;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  margin: 4px 0;
  font-family: "Cairo", sans-serif;
  font-size: 16px;
}
.operation-box select {
  height: 35px;
  width: 100%;
  box-sizing: border-box;
  margin: 5px 0;
  font-family: "Cairo", sans-serif;
  text-shadow: 1px 1px #152d35;
}

/* ---Table---- */
.table-wrapperr {
  margin: 0px 0px 0px;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
  justify-content: center;
  align-items: center;
}

.flr-table {
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

.flr-table td,
.flr-table th {
  text-align: center;
}

.flr-table td {
  border-right: 1px solid #f8f8f8;
  font-size: 17px;
}

.flr-table thead th {
  color: #ffffff;
  background: #4fc3a1;
}

.flr-table thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}

.flr-table tr:nth-child(even) {
  background: #f8f8f8;
}

.flr-table td button {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #283747;
}

.flr-table td button:hover {
  background: #63b4b8;
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