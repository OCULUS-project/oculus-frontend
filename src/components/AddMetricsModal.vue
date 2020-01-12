<template>
  <v-row class="ml-2">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="teal" dark v-on="on" @click="buttonCheck">
          Add Metrics
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Metrics</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="error">
              <v-col cols="12">
                <ErrorMessage
                  :message="
                    'Couldn\'t validate or add metrics. Please check your data and try again(' +
                      error +
                      ').'
                  "
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="6" class="py-0">
                <v-text-field
                  v-model="sex"
                  label="Sex*"
                  prepend-icon="mdi-pencil"
                  required
                  :rules="[rules.required]"
                  @keyup="buttonCheck"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6" class="py-0">
                <v-text-field
                  v-model="height"
                  label="Height*"
                  type="number"
                  prepend-icon="mdi-pencil"
                  required
                  :rules="[rules.required]"
                  @keyup="buttonCheck"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6" class="py-0">
                <v-text-field
                  v-model="score"
                  label="Score*"
                  type="number"
                  step="0.01"
                  prepend-icon="mdi-pencil"
                  required
                  :rules="[rules.required]"
                  @keyup="buttonCheck"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6" class="py-0">
                <v-text-field
                  v-model="weight"
                  label="Weight*"
                  type="number"
                  step="0.01"
                  prepend-icon="mdi-pencil"
                  required
                  :rules="[rules.required]"
                  @keyup="buttonCheck"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-textarea
                  v-model="notes"
                  label="Notes"
                  prepend-icon="mdi-pencil"
                  counter
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="12" md="6" class="py-0">
                <v-text-field
                  v-model="doctor"
                  label="Doctor*"
                  prepend-icon="mdi-pencil"
                  required
                  :rules="[rules.required]"
                  @keyup="buttonCheck"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6" class="py-0">
                <v-text-field
                  v-model="initials"
                  label="Initials*"
                  prepend-icon="mdi-pencil"
                  required
                  :rules="[rules.required]"
                  @keyup="buttonCheck"
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
            @click="saveMetrics"
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
  name: "AddMetricsModal",
  props: ["id"],
  data: () => ({
    dialog: false,
    doctor: "",
    notes: "",
    sex: "",
    height: "",
    weight: "",
    initials: "",
    score: "",

    rules: {
      required: value => !!value || "Required."
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
    saveMetrics() {
      this.loading = true;
      this.disabled = true;

      let payload = {
        patient: this.id,
        doctor: this.doctor,
        date: new Date(),
        notes: this.notes,
        attributes: {
          sex: this.sex ? this.sex : "",
          height: this.height ? parseInt(this.height) : "",
          weight: this.weight ? parseFloat(this.weight) : "",
          initials: this.initials ? this.initials : "",
          score: this.score ? parseFloat(this.score) : ""
        }
      };

      postDataWithoutURL("facts/attributes/validate", {
        attributes: payload.attributes
      })
        .then(result => {
          console.log("DONE", result);

          let validationErrors = [];

          result.data.attributes.forEach(element => {
            if (element.errors != []) {
              element.errors.forEach(single => {
                validationErrors.push(single);
              });
            }
          });

          try {
            if (validationErrors) {
              console.log("ok");
              postDataWithoutURL("/patients/metrics", payload)
                .then(addResponse => {
                  console.log(addResponse);

                  this.dialog = false;
                  this.$emit("saved", this.fileId);
                })
                .catch(err => {
                  this.error = err;
                });
            } else {
              throw validationErrors;
            }
          } catch (err) {
            console.log("Error", err);
            this.error = err;
          }
        })
        .catch(err => {
          this.error = err;
          console.log(err);
        });

      this.loading = false;
      this.disabled = false;
    },
    buttonCheck() {
      this.disabled = !(
        this.sex &&
        this.doctor &&
        this.height &&
        this.weight &&
        this.initials &&
        this.score
      );
    }
  }
};
</script>
