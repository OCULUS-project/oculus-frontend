<template>
  <v-row class="ml-2">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="teal" dark v-on="on">
          Add Patient
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Patient</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="error">
              <v-col cols="12">
                <ErrorMessage
                  message="Couldn't create Patient. Please try again."
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="patient.firstName"
                  label="First name*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="patient.lastName"
                  label="Last name*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="patient.email"
                  label="Email*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="patient.password"
                  label="Password*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="patient.pesel"
                  label="PESEL*"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="patient.phone"
                  label="Phone*"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal" class="px-2" text @click="dialog = false"
            >Close</v-btn
          >
          <v-btn
            color="teal"
            class="px-3"
            :dark="!disabled"
            @click="savePatient"
            :disabled="disabled"
          >
            <span v-if="!loading">Save</span>
            <v-icon v-else>mdi-spin mdi-loading</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { postDataWithoutURL } from "../utils/fetch-functions.js";
import ErrorMessage from "../components/ErrorMessage.vue";

export default {
  name: "AddPatientModal",
  data: () => ({
    dialog: false,
    patient: {
      password: "",
      firstName: "",
      lastName: "",
      pesel: null,
      email: "",
      phone: ""
    },

    //ButtonData
    loading: false,
    disabled: false,

    error: null
  }),
  components: {
    ErrorMessage
  },
  methods: {
    savePatient() {
      this.loading = true;
      this.disabled = true;

      this.patient.pesel = parseInt(this.patient.pesel);
      console.log(this.patient);

      postDataWithoutURL("patients", this.patient)
        .then(result => {
          console.log("DONE", result);
          this.dialog = false;
          this.$emit("saved", this.fileId);
        })
        .catch(err => {
          this.error = err;
          console.log(err);
        });

      this.loading = false;
      this.disabled = false;
    }
  }
};
</script>
