<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="3">
        <div class="d-flex justify-center">
          <h1>Sing in:</h1>
        </div>
        <div class="d-flex justify-center">
          <v-text-field label="Login" />
        </div>
        <div class="d-flex justify-center">
          <v-text-field label="Password" type="password" />
        </div>
        <div class="d-flex justify-center">
          <v-btn color="teal" class="white--text">Login</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "home"
};
</script>
