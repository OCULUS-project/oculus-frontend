<template>
  <v-card color="red darken-2" dark class="pa-2">
    <strong>Error: </strong>{{ message }} Please refresh application or contact
    administrator.
  </v-card>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: ["message"]
};
</script>
