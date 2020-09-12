<template>
  <div>
    <vue-recaptcha
      v-if="!DISABLE_RECAPTCHA"
      ref="invisibleRecaptcha"
      size="invisible"
      @verify="onVerify"
      :sitekey="siteKey"
    />
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import { siteKey, DISABLE_RECAPTCHA } from "../../devAndProdVariables.js";

export default {
  name: "Recaptcha",
  components: {
    VueRecaptcha,
  },
  data: () => ({
    siteKey,
    DISABLE_RECAPTCHA,
  }),
  methods: {
    execute() {
      if (!this.DISABLE_RECAPTCHA) {
        this.$refs.invisibleRecaptcha.execute();
      } else {
        this.onVerify();
      }
    },
    async onVerify(token = null) {
      if (!this.DISABLE_RECAPTCHA) {
        await this.$refs.invisibleRecaptcha.reset();
      }

      this.$emit("verify", token);
    },
  },
};
</script>
