<template>
  <div>
    <vue-recaptcha
      ref="invisibleRecaptcha"
      size="invisible"
      @verify="onVerify"
      :sitekey="siteKey"
    />
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import { siteKey } from "../../devAndProdVariables.js";

export default {
  name: "Recaptcha",
  components: {
    VueRecaptcha,
  },
  data: () => ({
    siteKey,
  }),
  methods: {
    execute() {
      this.$refs.invisibleRecaptcha.execute();
    },
    async onVerify(token) {
      await this.$refs.invisibleRecaptcha.reset();
      this.$emit("verify", token);
    },
  },
};
</script>
