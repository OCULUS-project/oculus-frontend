<template>
  <v-container>
    <v-row v-if="patient && !error">
      <v-col cols="12">
        <h1>Patient folder: {{ patient.firstName }} {{ patient.lastName }}</h1>
      </v-col>

      <v-col cols="6" sm="12" md="6">
        <v-card class="pa-3">
          <div class="ml-2 mb-3">
            <span class="v-toolbar__title">Personal Data</span>
          </div>
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

      <v-col cols="12">
        <Metrics :id="id" />
      </v-col>

      <v-col cols="12">
        <ImageController :id="id" />
      </v-col>
    </v-row>
    <v-row v-if="error">
      <v-col cols="12">
        <ErrorMessage
          message="Couldn't fetch Patient data. There are some problems with API."
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDataWithoutURL } from "../utils/fetch-functions.js";
import Metrics from "../components/Metrics.vue";
import ImageController from "../components/ImageController.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

export default {
  name: "Patient",
  props: ["id"],
  data: () => ({
    patient: null,
    error: null
  }),
  components: {
    Metrics,
    ImageController,
    ErrorMessage
  },
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

<style lang="scss" scoped>
.table-header {
  font-size: 1.25rem;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
