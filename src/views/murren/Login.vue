<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#"
         @click.prevent="switchLoginForm">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <div>
      <img src="@/assets/img/logo_in_circle.png" alt="circle_logo" class="murrengan-logo mb">
    </div>

    <h1 class="mb">Войти</h1>

    <form class="m-from"
          @submit.prevent="() => $refs.invisibleRecaptcha.execute()">

      <!-- Username field begin -->
      <div :class="{'m-form__group--invalid': validUserName}" class="m-form__group">
        <label class="m-form__label">
          <input type="text" placeholder="Имя в Мурренган" class="m-form__control"
                 v-model.trim="murren_username">

          <span v-if="validUserName && murren_username.length"
                @click="() => murren_username = ''"
                class="m-form__clear"></span>
        </label>

        <div v-if="validUserNameRequired" class="m-form__help">
          Какое у тебя имя в Мурренган?
        </div>
        <div v-if="!accountActivated" class="m-form__help">
          Активный Муррен с указанными данными не найден
        </div>
      </div>
      <!-- Username field end -->

      <!-- Password field begin -->
      <div :class="{'m-form__group--invalid': validPassword}" class="m-form__group">
        <label class="m-form__label">
          <input type="password" placeholder="Пароль" class="m-form__control"
                 v-model.trim="murren_password">
        </label>

        <div v-if="validPasswordRequired" class="m-form__help">
          Пароль нужен обязательно
        </div>
        <div v-if="validPasswordMinLength" class="m-form__help">
          Пароль минимум {{ $v.murren_password.$params.minLength.min }} символов
        </div>
      </div>
      <!-- Password field end -->

      <div class="m-form__group">
        <a href="#"
           @click.prevent="hideLoginAndShowSignUpForm">
          <small class="link">РЕГИСТРАЦИЯ</small>
        </a>

        <span> / </span>

        <a href="#"
           @click.prevent="hideLoginAndShowResetPasswordForm">
          <small class="link">ВОССТАНОВИТЬ ПАРОЛЬ</small>
        </a>
      </div>

      <vue-recaptcha ref="invisibleRecaptcha" size="invisible"
                     @verify="login"
                     :sitekey="siteKey"/>

      <el-button class="murr-button mb"
                 native-type="submit">
        Войти
      </el-button>

    </form>
  </div>
</template>

<script>
  import {required, minLength} from 'vuelidate/lib/validators';
  import VueRecaptcha from 'vue-recaptcha';
  import {siteKey} from '@/devAndProdVariables';

  export default {
    data: () => ({
      siteKey,
      murren_username: '',
      murren_password: '',
      accountActivated: true,
    }),
    methods: {
      switchLoginForm() {
        this.$store.dispatch('changeShowLoginForm_actions');
      },
      hideLoginAndShowResetPasswordForm() {
        this.$store.dispatch('changeShowLoginForm_actions');
        this.$store.dispatch('changeShowResetPasswordForm_actions');
      },
      hideLoginAndShowSignUpForm() {
        this.$store.dispatch('changeShowLoginForm_actions');
        this.$store.dispatch('changeShownSignUpForm_actions');
      },
      async login(recaptchaToken) {
        if (this.$v.$invalid) {
          this.$v.$touch();
          return;
        }

        const formData = {
          recaptchaToken,
          username: this.murren_username,
          password: this.murren_password,
        };

        try {
          await this.$store.dispatch('login', formData);
          await this.$store.dispatch('changeShowLoginForm_actions');
          await this.$router.push('/murren');
        } catch (e) {
          if (e.response.data.detail === 'No active account found with the given credentials') {
            this.accountActivated = false;
          }
        }
      },
    },
    computed: {
      validPasswordRequired() {
        return this.$v.murren_password.$dirty && !this.$v.murren_password.required;
      },
      validPasswordMinLength() {
        return this.$v.murren_password.$dirty && !this.$v.murren_password.minLength;
      },
      validPassword() {
        return this.validPasswordRequired || this.validPasswordMinLength;
      },
      validUserNameRequired() {
        return this.$v.murren_username.$dirty && !this.$v.murren_username.required;
      },
      validUserName() {
        return this.validUserNameRequired || !this.accountActivated;
      },
    },
    watch: {
      murren_username() {
        this.accountActivated = true;
      },
    },
    validations: {
      murren_username: {required},
      murren_password: {required, minLength: minLength(6)},
    },
    components: {
      VueRecaptcha
    },
  };
</script>
