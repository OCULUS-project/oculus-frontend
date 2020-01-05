<template>
  <v-container>
    <h1>Patients</h1>
    <v-row>
      <v-col cols="12">
        <v-card color="red darken-2" dark v-if="error" class="pa-2">
          <strong>Error: </strong>There are some problems with API. Please
          refresh application or contact administrator.
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="patients"
          :items-per-page="itemsPerPage"
          class="elevation-1"
          :dense="dense"
          multi-sort
          :loading="loadingData"
          loading-text="Fetching data..."
          :search="search"
          :key="patients.id"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-text-field
                v-model="search"
                label="Search current page"
                single-line
                hide-details
              ></v-text-field>
              <div class="flex-grow-1"></div>
              <v-switch
                v-model="dense"
                label="Dense table"
                class="mt-2"
                color="teal"
              ></v-switch>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <v-container>
              <v-row class="ml-2 mr-2" align="center" justify="center">
                <span class="grey--text">Items per page</span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn dark text color="teal" class="ml-2" v-on="on">
                      {{ itemsPerPage }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(number, index) in itemsPerPageArray"
                      :key="index"
                      @click="updateItemsPerPage(number)"
                    >
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-spacer></v-spacer>

                <span
                  class="mr-4 grey--text"
                  v-if="page != null && numberOfPages != null"
                >
                  Page {{ page + 1 }} of {{ numberOfPages }}
                </span>
                <v-btn
                  fab
                  dark
                  small
                  color="teal"
                  class="mr-1"
                  @click="formerPage"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  fab
                  dark
                  small
                  color="teal"
                  class="ml-1"
                  @click="nextPage"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDataWithoutURL } from "../utils/fetch-functions.js";

export default {
  data: () => ({
    patients: [],
    headers: [
      //{ text: "ID", value: "id" },
      { text: "Name", value: "firstName" },
      { text: "Surname", value: "lastName" },
      { text: "PESEL", value: "pesel" },
      { text: "Email", value: "email" },
      { text: "Phone", value: "phone" },
      { text: "Password", value: "password" }
    ],
    dense: true,
    search: "",
    loadingData: false,

    //Footer Data
    itemsPerPageArray: [30, 60, 90],
    page: 0,
    itemsPerPage: 30,
    numberOfPages: null,
    numberOfPatients: null,
    error: ""
  }),
  methods: {
    async getPatients() {
      this.loadingData = true;

      await getDataWithoutURL(
        "patients/all?page=" + this.page + "&size=" + this.itemsPerPage
      )
        .then(response => {
          this.patients = response.data.patients;
          this.page = response.data.n;
          this.itemsPerPage = response.data.size;
          this.numberOfPages = response.data.numberOfPages;
        })
        .catch(error => {
          this.error = error;
        });

      this.loadingData = false;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
      this.getPatients();
    },
    nextPage() {
      if (this.page < this.numberOfPages) {
        this.page++;
        this.getPatients();
      }
    },
    formerPage() {
      if (this.page > 0) {
        this.page--;
        this.getPatients();
      }
    }
  },
  mounted() {
    this.getPatients();
  }
};
</script>
