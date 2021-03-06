<template>
  <div class="main-slide-fade-container">
    <div class="hide__main-slide-fade-container">
      <a href="#" @click.prevent="goHome">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <form class="m-form" @submit.prevent="$refs.recaptcha.execute">
      <img
        src="@/assets/img/logo_pink.png"
        alt="circle_logo"
        class="murrengan-logo mb"
      />

      <h1 class="mb">Новый пароль</h1>
      <!-- Password field begin -->
      <div
        :class="{ 'm-form__group--invalid': validPassword }"
        class="m-form__group"
      >
        <label class="m-form__label">
          <input
            type="password"
            placeholder="Новый пароль"
            class="m-form__control auth-input"
            v-model.trim="password"
          />
        </label>

        <div v-if="validPasswordRequired" class="m-form__help">
          Пароль нужен обязательно
        </div>
        <div v-if="validPasswordMinLength" class="m-form__help">
          Пароль минимум {{ $v.password.$params.minLength.min }} символов
        </div>
        <div v-else-if="validPasswordIsNumeric" class="m-form__help">
          Пароль не должен состоять только из цифр
        </div>
        <div v-else-if="passwordIsTooCommon" class="m-form__help">
          Пароль слишком простой
        </div>
      </div>

      <!-- PasswordConfirm field begin -->
      <div
        :class="{ 'm-form__group--invalid': validPasswordRepeat }"
        class="m-form__group"
      >
        <label class="m-form__label">
          <input
            type="password"
            placeholder="Повторить новый пароль"
            class="m-form__control auth-input"
            v-model.trim="passwordRepeat"
          />
        </label>

        <div v-if="validPasswordRepeatRequired" class="m-form__help">
          Пароль нужен обязательно
        </div>
        <div v-else-if="validPasswordRepeatMinLength" class="m-form__help">
          Пароль минимум {{ $v.passwordRepeat.$params.minLength.min }} символов
        </div>
        <div v-else-if="validPasswordRepeatNoMatch" class="m-form__help">
          Пароли не совпадают
        </div>
      </div>

      <recaptcha ref="recaptcha" @verify="setNewPassword" />

      <el-button class="murr-button mb" native-type="submit" :loading="loading">
        Готово
      </el-button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Recaptcha from "../common/Recaptcha";
import { helpers, minLength, required, sameAs } from "vuelidate/lib/validators";

export default {
  data: () => ({
    password: "",
    passwordRepeat: "",
    passwordIsTooCommon: false,
    loading: false,
    token: null,
    uid: null,
  }),
  created() {
    let uid = this.$route.query.murr_code.split("___")[1];
    let token = this.$route.query.murr_code.split("___")[2];

    if (!uid || !token) {
      this.notification({
        message: "Нужны секретные данные!",
        type: "warning",
      });
      this.$router.push("/");
      return;
    }

    this.uid = uid;
    this.token = token;
  },
  methods: {
    ...mapActions({
      notification: "popUpMessage",
      goLogin: "changeShowLoginForm_actions",
    }),
    async setNewPassword(recaptchaToken) {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      this.loading = true;
      const result = await this.$store.dispatch("setNewPassword", {
        password: this.password,
        passwordRepeat: this.passwordRepeat,
        token: this.token,
        uid: this.uid,
        recaptchaToken,
      });
      this.loading = false;

      if (result.error) {
        this.notification({
          message: "Ошибка на сервере",
          type: "error",
        });
        return;
      }

      if (result.passwordIsChanged) {
        this.notification({
          message: "Пароль успешно изменен. Добро пожаловать 😎",
          type: "success",
        });
        this.goHome();
        this.goLogin();
        return;
      }

      this.passwordIsTooCommon = result.passwordIsTooCommon;
    },
    async goHome() {
      await this.$router.push("/");
    },
  },
  computed: {
    validPasswordRequired() {
      return this.$v.password.$dirty && !this.$v.password.required;
    },
    validPasswordMinLength() {
      return this.$v.password.$dirty && !this.$v.password.minLength;
    },
    validPasswordIsNumeric() {
      return this.$v.password.$dirty && !this.$v.password.is_numeric;
    },
    validPassword() {
      return (
        this.validPasswordRequired ||
        this.validPasswordMinLength ||
        this.validPasswordIsNumeric ||
        this.passwordIsTooCommon
      );
    },
    validPasswordRepeatRequired() {
      return this.$v.passwordRepeat.$dirty && !this.$v.passwordRepeat.required;
    },
    validPasswordRepeatMinLength() {
      return this.$v.passwordRepeat.$dirty && !this.$v.passwordRepeat.minLength;
    },
    validPasswordRepeatNoMatch() {
      return this.$v.passwordRepeat.$dirty && !this.$v.passwordRepeat.noMatch;
    },
    validPasswordRepeat() {
      return (
        this.validPasswordRepeatRequired ||
        this.validPasswordRepeatMinLength ||
        this.validPasswordRepeatNoMatch ||
        this.passwordIsTooCommon
      );
    },
  },
  watch: {
    password() {
      this.passwordIsTooCommon = false;
    },
  },
  validations: {
    password: {
      required,
      minLength: minLength(6),
      is_numeric: helpers.regex("alpha", /^(?=.*?[^0-9])/),
    },
    passwordRepeat: {
      required,
      minLength: minLength(6),
      noMatch: sameAs("password"),
    },
  },
  components: {
    Recaptcha,
  },
};
</script>
