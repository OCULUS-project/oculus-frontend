<template>
  <v-container>
    <h1>Patients</h1>
    <v-row v-if="!error">
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
          no-data-text="You don't have any registered patients!"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-text-field
                v-model="search"
                label="Search current page"
                single-line
                hide-details
              ></v-text-field>
              <AddPatientModal @saved="getPatients" />
              <div class="flex-grow-1"></div>
              <v-switch
                v-model="dense"
                label="Dense table"
                class="mt-2"
                color="teal"
              ></v-switch>
            </v-toolbar>
          </template>

          <template v-slot:item.folder="{ item }">
            <v-icon
              color="teal"
              small
              class="mr-2"
              @click="goToFolder(item.id)"
            >
              mdi-folder
            </v-icon>
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
                  small
                  color="teal"
                  class="mr-1 white--text"
                  @click="formerPage"
                  :disabled="page == 0 || loadingData"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  fab
                  small
                  color="teal"
                  class="ml-1 white--text"
                  @click="nextPage"
                  :disabled="page == numberOfPages - 1 || loadingData"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <ErrorMessage
          message="Couldn't fetch Patients data. There are some problems with API."
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDataWithoutURL } from "../utils/fetch-functions.js";
import ErrorMessage from "../components/ErrorMessage.vue";
import AddPatientModal from "../components/AddPatientModal.vue";

export default {
  name: "Patients",
  data: () => ({
    patients: [],
    headers: [
      //{ text: "ID", value: "id" },
      { text: "Name", value: "firstName" },
      { text: "Surname", value: "lastName" },
      { text: "PESEL", value: "pesel" },
      { text: "Email", value: "email" },
      { text: "Phone", value: "phone" },
      { text: "Password", value: "password" },
      { text: "Patient Folder", value: "folder", sortable: false }
    ],
    dense: true,
    search: "",
    loadingData: false,

    //Footer Data
    itemsPerPageArray: [30, 60, 90, 120, 240],
    page: 0,
    itemsPerPage: 30,
    numberOfPages: 1,
    numberOfPatients: 0,
    error: ""
  }),
  components: {
    ErrorMessage,
    AddPatientModal
  },
  methods: {
    async getPatients() {
      this.loadingData = true;

      await getDataWithoutURL(
        "patients/all?page=" + this.page + "&size=" + this.itemsPerPage
      )
        .then(response => {
          this.patients = response.data.patients ? response.data.patients : [];
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
    },
    goToFolder(id) {
      this.$router.push("/patient/" + id);
    }
  },
  mounted() {
    this.getPatients();
  }
};
</script>
