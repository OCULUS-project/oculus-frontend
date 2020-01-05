<template>
  <v-container>
    <v-row v-if="patient">
      <v-col cols="12">
        <h1>Patient folder: {{ patient.firstName }} {{ patient.lastName }}</h1>
      </v-col>

      <v-col cols="6" sm="12" md="6">
        <v-card class="pa-3">
          <h3 class="mb-3">Personal Data:</h3>
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><strong>Id: </strong></td>
                  <td>{{ patient.id }}</td>
                </tr>
                <tr>
                  <td><strong>Pesel: </strong></td>
                  <td>{{ patient.pesel }}</td>
                </tr>
                <tr>
                  <td><strong>First Name: </strong></td>
                  <td>{{ patient.firstName }}</td>
                </tr>
                <tr>
                  <td><strong>Last Name: </strong></td>
                  <td>{{ patient.lastName }}</td>
                </tr>
                <tr>
                  <td><strong>Phone: </strong></td>
                  <td>{{ patient.phone }}</td>
                </tr>
                <tr>
                  <td><strong>Email: </strong></td>
                  <td>{{ patient.email }}</td>
                </tr>
                <tr>
                  <td><strong>Password: </strong></td>
                  <td>{{ patient.password }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <v-col cols="12" v-if="error">
      <v-card color="red darken-2" dark class="pa-2">
        <strong>Error: </strong>There are some problems with API. Please refresh
        application or contact administrator.
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import { getDataWithoutURL } from "../utils/fetch-functions.js";

export default {
  name: "Patient",
  props: ["id"],
  data: () => ({
    patient: null,
    error: null
  }),
  methods: {
    async getPatient() {
      await getDataWithoutURL("patients?id=" + this.id)
        .then(response => {
          this.patient = response.data;
        })
        .catch(error => {
          this.error = error;
        });
    }
  },
  mounted() {
    this.getPatient();
  }
};
</script>
