<template>
  <v-container>
    <h1>Jobs</h1>
    <v-row v-if="!error">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="jobs"
          :items-per-page="itemsPerPage"
          class="elevation-1"
          :dense="dense"
          multi-sort
          :loading="loadingData"
          loading-text="Fetching data..."
          :search="search"
          :key="jobs.id"
          no-data-text="You don't have any created jobs!"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-text-field
                v-model="search"
                label="Search current page"
                single-line
                hide-details
              ></v-text-field>
              <AddPatientModal @saved="getJobs" />
              <div class="flex-grow-1"></div>
              <v-switch
                v-model="dense"
                label="Dense table"
                class="mt-2"
                color="teal"
              ></v-switch>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              color="teal"
              small
              class="mr-2"
              @click="goToFolder(item.patient)"
            >
              mdi-folder
            </v-icon>
            <v-icon color="teal" small class="mr-2" @click="runJob(item.id)">
              mdi-play
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <ErrorMessage
          message="Couldn't fetch jobs data. There are some problems with API."
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
  name: "Jobs",
  data: () => ({
    jobs: [],
    headers: [
      //{ text: "ID", value: "id" },
      { text: "Id", value: "id" },
      { text: "Doctor", value: "doctor" },
      { text: "Patient", value: "patient" },
      { text: "Metrics", value: "metrics" },
      { text: "Image File", value: "imageFile" },
      { text: "Created", value: "created" },
      { text: "Updated", value: "Updated" },
      { text: "Status", value: "status" },
      { text: "Job Actions", value: "actions", sortable: false }
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
    async getJobs() {
      this.loadingData = true;

      await getDataWithoutURL("jobs")
        .then(response => {
          this.jobs = response.data ? response.data : [];
        })
        .catch(error => {
          this.error = error;
        });

      this.loadingData = false;
    },
    goToFolder(id) {
      this.$router.push("/patient/" + id);
    },
    runJob(id) {
      console.log("runJob", id);
    }
  },
  mounted() {
    this.getJobs();
  }
};
</script>
