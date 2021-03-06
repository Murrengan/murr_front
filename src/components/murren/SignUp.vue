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
        class="murrengan-logo"
      />
      <h1>Регистрация</h1>
      <h4>Через социальные сети</h4>

      <div class="flex-centered">
        <GoogleOauth @success="goHome" />
      </div>

      <h4>С паролем</h4>

      <!-- Email field begin -->
      <div
        :class="{ 'm-form__group--invalid': validEmail }"
        class="m-form__group"
      >
        <label class="m-form__label">
          <input
            type="text"
            placeholder="Почта"
            class="m-form__control auth-input"
            v-model.trim="email"
          />

          <span
            v-if="validEmail && email.length"
            @click="() => (email = '')"
            class="m-form__clear"
          ></span>
        </label>

        <div v-if="validEmailRequired" class="m-form__help">
          Почта нужна для восстановления пароля
        </div>
        <div v-if="validEmailIsEmail" class="m-form__help">
          Почта указана не верно
        </div>
        <div v-if="emailWhitelistAbort" class="m-form__help">
          Ваш почтовый провайдер не входит в whitelist. <br />
          Попробуйте войти через социальные сети
        </div>
        <div v-if="uniqueEmail" class="m-form__help">
          Эта почта уже используется
        </div>
      </div>

      <!-- Username field begin -->
      <div
        :class="{ 'm-form__group--invalid': validUserName }"
        class="m-form__group"
      >
        <label class="m-form__label">
          <input
            type="text"
            placeholder="Имя в Мурренган"
            class="m-form__control auth-input"
            v-model.trim="username"
          />

          <span
            v-if="validUserName && username.length"
            @click="() => (username = '')"
            class="m-form__clear"
          ></span>
        </label>

        <div v-if="validUserNameRequired" class="m-form__help">
          У каждого члена Мурренган есть имя
        </div>
        <div v-if="uniqueName" class="m-form__help">
          Это имя уже используется
        </div>

        <div v-if="validMurrenNameAlphaValidator" class="m-form__help">
          Имя на латинице и вместо пробелов _
        </div>

        <div v-if="validUserNameMaxLength" class="m-form__help">
          Имя максимум {{ $v.username.$params.maxLength.max }} символов
        </div>
      </div>

      <!-- Password field begin -->
      <div
        :class="{ 'm-form__group--invalid': validPassword }"
        class="m-form__group"
      >
        <label class="m-form__label">
          <input
            type="password"
            placeholder="Пароль"
            class="m-form__control auth-input"
            v-model.trim="password"
          />
        </label>

        <div v-if="validPasswordRequired" class="m-form__help">
          Пароль нужен обязательно
        </div>
        <div v-else-if="validPasswordMinLength" class="m-form__help">
          Пароль минимум {{ $v.password.$params.minLength.min }} символов
        </div>
        <div v-else-if="validPasswordIsNumeric" class="m-form__help">
          Пароль не должен состоять только из цифр
        </div>
        <div v-else-if="passwordIsTooCommon" class="m-form__help">
          Пароль слишком простой
        </div>
        <div v-else-if="passwordIsTooSimilarToUsername" class="m-form__help">
          Пароль слишком похож на имя
        </div>
        <div v-else-if="passwordIsTooSimilarToEmail" class="m-form__help">
          Пароль слишком похож на почту
        </div>
      </div>

      <div class="m-form__group">
        <small>
          Регистрация подтверждает, что ты согласен с нашими
          <span class="link pointer" @click="goToAboutPage">
            правилами
          </span>
        </small>
      </div>

      <recaptcha ref="recaptcha" @verify="signUp" />

      <el-button class="murr-button mb" native-type="submit" :loading="loading">
        Создать
      </el-button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import GoogleOauth from "./oauth/GoogleOauth";
import Recaptcha from "../common/Recaptcha";
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "vuelidate/lib/validators";
import { whitelistEmails } from "./whitelistEmails";

const murrenNameAlphaValidator = helpers.regex(
  "murrenNameAlphaValidator",
  /^[\d\w]*$/
);

export default {
  data: () => ({
    email: "",
    username: "",
    password: "",
    uniqueEmail: false,
    uniqueName: false,
    passwordIsTooCommon: false,
    passwordIsTooSimilarToUsername: false,
    passwordIsTooSimilarToEmail: false,
    loading: false,
    emailWhitelistAbort: false,
  }),
  methods: {
    ...mapActions({
      createMurren: "createMurren",
      notification: "popUpMessage",
      goHome: "changeShownSignUpForm_actions",
    }),
    async signUp(recaptchaToken) {
      if (!whitelistEmails.includes(this.$v.email.$model.split("@")[1])) {
        this.emailWhitelistAbort = true;
        this.$v.$touch();
        return;
      }

      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      this.loading = true;
      const result = await this.createMurren({
        recaptchaToken,
        email: this.email,
        username: this.username,
        password: this.password,
      });
      this.loading = false;

      if (result.recaptchaError) {
        this.notification({
          message: "Ошибка на сервере",
          type: "error",
        });
        return;
      }

      if (result.murrenIsCreated) {
        this.notification({
          message: "Письмо для активации отправлено на почту 😘",
          type: "success",
        });
        this.goHome();
        return;
      }

      this.uniqueName = result.uniqueName;
      this.uniqueEmail = result.uniqueEmail;
      this.passwordIsTooCommon = result.passwordIsTooCommon;
      this.passwordIsTooSimilarToUsername =
        result.passwordIsTooSimilarToUsername;
      this.passwordIsTooSimilarToEmail = result.passwordIsTooSimilarToEmail;
    },

    async goToAboutPage() {
      await this.$store.dispatch("changeShownSignUpForm_actions");
      await this.$router.push("/about");
    },
  },
  computed: {
    validEmailRequired() {
      return this.$v.email.$dirty && !this.$v.email.required;
    },
    validEmailIsEmail() {
      return this.$v.email.$dirty && !this.$v.email.email;
    },
    emailInWhiteList() {
      return this.$v.email.$dirty && this.emailWhitelistAbort;
    },
    validEmail() {
      return (
        this.validEmailRequired ||
        this.validEmailIsEmail ||
        this.uniqueEmail ||
        this.emailInWhiteList
      );
    },
    validUserNameRequired() {
      return this.$v.username.$dirty && !this.$v.username.required;
    },
    validUserNameMaxLength() {
      return this.$v.username.$dirty && !this.$v.username.maxLength;
    },
    validMurrenNameAlphaValidator() {
      return (
        this.$v.username.$dirty && !this.$v.username.murrenNameAlphaValidator
      );
    },
    validUserName() {
      return (
        this.validUserNameRequired ||
        this.validUserNameMaxLength ||
        this.uniqueName ||
        this.validMurrenNameAlphaValidator
      );
    },
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
        this.passwordIsTooCommon ||
        this.passwordIsTooSimilarToUsername ||
        this.passwordIsTooSimilarToEmail
      );
    },
  },
  watch: {
    email() {
      this.uniqueEmail = false;
      this.emailWhitelistAbort = false;
    },
    username() {
      this.uniqueName = false;
    },
    password() {
      this.passwordIsTooCommon = false;
    },
  },
  validations: {
    email: { email, required },
    username: { required, maxLength: maxLength(24), murrenNameAlphaValidator },
    password: {
      required,
      minLength: minLength(6),
      is_numeric: helpers.regex("alpha", /^(?=.*?[^0-9])/),
    },
  },
  components: {
    Recaptcha,
    GoogleOauth,
  },
};
</script>
