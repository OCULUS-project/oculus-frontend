<template>
  <v-data-table
    :v-if="metrics"
    :headers="headers"
    :items="metrics"
    class="elevation-1"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    dense
    multi-sort
    :loading="loadingData"
    loading-text="Fetching data..."
    :key="metrics.id"
    show-expand
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Metrics</v-toolbar-title>
        <AddMetricsModal :id="id" @saved="getMetrics" />
        <div class="flex-grow-1"></div>
        <v-switch
          v-model="singleExpand"
          label="Single expand"
          class="mt-2"
          color="teal"
        ></v-switch>
      </v-toolbar>
    </template>

    <template v-slot:expanded-item="{ item, headers }">
      <td :colspan="headers.length">
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="6">
              <v-card class="pa-2">
                <div class="ml-2 mb-3">
                  <span class="v-toolbar__title">Metrics Info</span>
                </div>
                <v-simple-table dense>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td><strong>Metrics Id: </strong></td>
                        <td>{{ item.id }}</td>
                      </tr>
                      <tr>
                        <td><strong>Doctor: </strong></td>
                        <td>{{ item.doctor }}</td>
                      </tr>
                      <tr>
                        <td><strong>Date: </strong></td>
                        <td>{{ item.date }}</td>
                      </tr>
                      <tr>
                        <td><strong>Notes: </strong></td>
                        <td>{{ item.notes }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-card class="pa-2">
                <div class="ml-2 mb-3">
                  <span class="v-toolbar__title">Attributes</span>
                </div>
                <v-simple-table dense>
                  <template v-slot:default>
                    <tbody>
                      <tr
                        v-for="(attribute, property) in item.attributes"
                        :key="property"
                      >
                        <td>
                          <strong>{{ property }}</strong>
                        </td>
                        <td>{{ attribute }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
import { getDataWithoutURL } from "../utils/fetch-functions.js";
import AddMetricsModal from "../components/AddMetricsModal.vue";

export default {
  name: "Metrics",
  props: ["id"],
  data: () => ({
    headers: [
      { text: "Id", value: "id" },
      { text: "Date", value: "date" },
      { text: "Doctor", value: "doctor" },
      { text: "", value: "data-table-expand" }
    ],
    metrics: [],
    loadingData: true,
    expanded: [],
    singleExpand: true
  }),
  components: {
    AddMetricsModal
  },
  methods: {
    async getMetrics() {
      this.loadingData = true;
      await getDataWithoutURL("patients/metrics?patientId=" + this.id)
        .then(response => {
          this.metrics = response.data.map(element => {
            return {
              ...element,
              date: moment(element.date).format("DD MMM YYYY HH:mm:ss")
            };
          });
        })
        .catch(error => {
          this.error = error;
        });
      this.loadingData = false;
    }
  },
  mounted() {
    this.getMetrics();
  }
};
</script>

<style lang="scss">
.v-data-table__expanded__content {
  background-color: teal;
}
</style>
