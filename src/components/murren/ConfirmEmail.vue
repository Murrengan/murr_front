<template>
  <div class="main-slide-fade-container">
    <div class="hide__main-slide-fade-container">
      <a href="#" @click.prevent="switchMurrenEmailActivate">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <h1 class="mb">Замечательно!</h1>
    <p class="mb">Почта успешно подтверждена</p>

    <div>
      <el-button
        class="murr-button"
        native-type="submit"
        @click="shownLoginForm"
      >
        Войти
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  async created() {
    let uid = this.$route.query.murr_code.split("___")[1];
    let token = this.$route.query.murr_code.split("___")[2];

    if (!uid || !token) {
      this.notification({
        message: "Нужны секретные данные!",
        type: "warning",
      });
      await this.$router.push("/");
      return;
    }

    const result = await this.$store.dispatch("mailConfirmation", {
      uid,
      token,
    });

    if (result.error) {
      this.notification({
        message: "Ошибка на сервере",
        type: "error",
      });
      return;
    }

    this.notification({
      message: "Почта успешно подтверждена. Добро пожаловать 😎",
      type: "success",
    });
  },
  methods: {
    ...mapActions({
      notification: "popUpMessage",
    }),
    async shownLoginForm() {
      await this.$router.push("/");
      await this.$store.dispatch("changeShowLoginForm_actions");
    },
    async switchMurrenEmailActivate() {
      await this.$router.push("/");
    },
  },
};
</script>
