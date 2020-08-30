<template>
  <g-signin-button
    :params="googleSignInParams"
    @success="onGoogleSignInSuccess"
    @error="onGoogleSignInError"
    class="m-form__oauth-item m-form__oauth-item_google"
  >
  </g-signin-button>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "axios";

import { murrOauthGoogle } from "../../../devAndProdVariables";
export default {
  name: "GoogleOauth",
  data: () => ({
    user: {},
    googleSignInParams: {
      client_id: murrOauthGoogle,
    },
  }),
  methods: {
    ...mapMutations({
      setAccessToken_mutations: "setAccessToken_mutations",
      setMurrenName_mutations: "setMurrenName_mutations",
      setMurrenId_mutations: "setMurrenId_mutations",
    }),
    async onGoogleSignInSuccess(resp) {
      const token = resp.wc.access_token;
      const murrBackResponse = await axios.post("/api/murren/oauth/google/", {
        access_token: token,
      });
      try {
        this.$store.commit(
          "setAccessToken_mutations",
          murrBackResponse.data.token
        );
        this.$store.commit(
          "setMurrenName_mutations",
          murrBackResponse.data.user.username
        );
        this.$store.commit(
          "setMurrenId_mutations",
          murrBackResponse.data.user.pk
        );
        this.$emit("success");
      } catch (err) {
        // todo remove to 1.0.0
        const dataForPopUpMessage = {
          message: err,
          customClass: "element-ui-message__error",
          type: "error",
        };
        await this.$store.dispatch("popUpMessage", dataForPopUpMessage);
      }
    },
    onGoogleSignInError(error) {
      const dataForPopUpMessage = {
        message: error,
        customClass: "element-ui-message__error",
        type: "error",
      };
      this.$store.dispatch("popUpMessage", dataForPopUpMessage);
    },
  },
};
</script>
