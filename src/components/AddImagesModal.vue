<template>
  <v-row class="ml-2">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="teal" dark v-on="on">
          Add Images
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Images</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="error">
              <v-col cols="12">
                <ErrorMessage
                  message="Couldn't add images. Please try again."
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="py-0">
                <v-file-input
                  v-model="files"
                  color="teal"
                  counter
                  label="File input*"
                  multiple
                  placeholder="Select your files"
                  prepend-icon="mdi-paperclip"
                  outlined
                  :show-size="1000"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip v-if="index < 2" color="teal" dark label small>
                      {{ text }}
                    </v-chip>

                    <span
                      v-else-if="index === 2"
                      class="overline grey--text text--darken-3 mx-2"
                    >
                      +{{ files.length - 2 }} File(s)
                    </span>
                  </template>
                </v-file-input>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-textarea
                  v-model="notes"
                  label="Notes"
                  prepend-icon="mdi-pencil"
                  counter
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <v-text-field
                  v-model="doctor"
                  label="Doctor*"
                  prepend-icon="mdi-pencil"
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
            @click="saveImages"
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
  name: "AddImagesModal",
  props: ["id"],
  data: () => ({
    dialog: false,
    files: [],
    doctor: "",
    notes: "",
    fileId: "",

    //ButtonData
    loading: false,
    disabled: false,

    error: null
  }),
  components: {
    ErrorMessage
  },
  methods: {
    saveImages() {
      this.loading = true;
      this.disabled = true;

      let payload = {
        author: this.doctor,
        notes: this.notes,
        patient: this.id
      };

      postDataWithoutURL("img/files", payload)
        .then(result => {
          console.log("DONE", result);
          this.fileId = result.data.id;

          this.dialog = false;
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
