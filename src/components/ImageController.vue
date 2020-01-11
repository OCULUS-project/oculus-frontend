<template>
  <div>
    <v-data-table
      :v-if="imageFiles"
      :headers="headers"
      :items="imageFiles"
      class="elevation-1"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      dense
      multi-sort
      :loading="loadingData"
      loading-text="Fetching data..."
      :key="imageFiles.id"
      show-expand
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Image Files</v-toolbar-title>
          <AddImagesModal :id="id" />
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
              <v-col cols="12">
                <v-card class="pa-2">
                  <div class="ml-2 mb-3">
                    <span class="v-toolbar__title">Images</span>
                  </div>

                  <lightbox
                    id="mylightbox"
                    ref="lightbox"
                    :images="images"
                    :directory="imagesStoreURL"
                    :timeoutDuration="5000"
                  />

                  <transition-group name="thumbnailfade" tag="div">
                    <img
                      v-for="image in item.images"
                      :key="image.id"
                      @click="showLightbox(image, item.images)"
                      :src="image._links.canonicalScaledM.href"
                      :alt="image.date"
                      :title="image.date"
                      :height="100"
                      class="mr-2"
                    />
                  </transition-group>
                  <p v-if="item.notes">
                    <strong>Notes: </strong> {{ item.notes }}
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from "moment";
import AddImagesModal from "../components/AddImagesModal.vue";
import { getDataWithoutURL } from "../utils/fetch-functions.js";
import { config } from "../config/constants.js";

export default {
  name: "ImageController",
  props: ["id"],
  data() {
    return {
      images: [],
      galleryFilter: "all",

      //ImageFiles - Teczki
      imageFiles: [],
      imagesStoreURL: config.URL + "img/static/",
      headers: [
        { text: "Id", value: "id" },
        { text: "Date", value: "date" },
        { text: "Doctor", value: "author" },
        { text: "Images Count", value: "imagesCount" },
        { text: "", value: "data-table-expand" }
      ],
      loadingData: false,
      expanded: [],
      singleExpand: true,
      error: null
    };
  },
  components: {
    AddImagesModal
  },
  methods: {
    showLightbox: function(imageName, images) {
      this.images = images.map(image => {
        let timestamp = moment(image.date).format("DD MMM YYYY HH:mm:ss");

        return {
          name: "f_" + image.fileId + "/img_" + image.id + ".jpg",
          alt: timestamp + " " + image.notes,
          id: image.fileId
        };
      });

      this.$refs.lightbox.show(imageName);
    },
    //Spaghetti Start ( ͡° ͜ʖ ͡°)
    async getImageFiles() {
      this.loadingData = true;

      await getDataWithoutURL("img/files?patientId=" + this.id)
        .then(async response => {
          await Promise.all(
            response.data.imageFiles.map(async element => {
              let images = [];
              await getDataWithoutURL("img?fileId=" + element.id)
                .then(singleFileResponse => {
                  images =
                    singleFileResponse.status == 200
                      ? singleFileResponse.data.images
                      : [];
                })
                .catch(error => {
                  this.error = error;
                });

              return {
                ...element,
                images,
                imagesCount: images.length ? images.length : "0",
                date: moment(element.date).format("DD MMM YYYY HH:mm:ss")
              };
            })
          ).then(results => (this.imageFiles = results));
        })
        .catch(error => {
          this.error = error;
        });

      this.loadingData = false;
      //Spaghetti Stop ( ͡° ͜ʖ ͡°)
    }
  },
  computed: {
    filteredImages: function() {
      if (this.galleryFilter === "all") {
        return this.images;
      } else {
        return this.images.filter(image => image.filter === this.galleryFilter);
      }
    }
  },
  mounted() {
    this.getImageFiles();
  }
};
</script>
