<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#" @click.prevent="goHome">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <div>
      <img src="@/assets/img/logo_in_circle.png" alt="Logo" class="murrengan-logo mb">
    </div>

    <h1 class="mb">Восстановить пароль</h1>

    <form class="m-form"
          @submit.prevent="() => $refs.invisibleRecaptcha.execute()">

      <!-- Email field begin -->
      <div :class="{'m-form__group--invalid': validEmail}" class="m-form__group">
        <label class="m-form__label">
          <input type="text" placeholder="Почта" class="m-form__control"
                 v-model.trim="email">

          <span v-if="validEmail && email.length"
                @click="() => email = ''"
                class="m-form__clear"></span>
        </label>

        <div v-if="validEmailRequired" class="m-form__help">
          Почта нужна для восстановления пароля
        </div>
        <div v-if="validEmailIsEmail" class="m-form__help">
          Почта указана не верно
        </div>
      </div>
      <!-- Email field end -->

      <div class="m-form__group">
        <small class="m-form__help">Эта почта была указана при регистрации</small>
      </div>

      <vue-recaptcha ref="invisibleRecaptcha" size="invisible"
                     @verify="handlerResetPassword"
                     :sitekey="siteKey"/>

      <el-button class="murr-button mb" native-type="submit"
                 :loading="loading">
        Жду письмо
      </el-button>
    </form>

  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import VueRecaptcha from 'vue-recaptcha';
  import {email, required} from 'vuelidate/lib/validators';
  import {siteKey} from '@/devAndProdVariables';

  export default {
    data: () => ({
      siteKey,
      email: '',
      loading: false,
    }),
    methods: {
      ...mapActions({
        resetPassword: 'requestResetPassword',
        goHome: 'changeShowResetPasswordForm_actions',
      }),
      async handlerResetPassword(recaptchaToken) {

        if (this.$v.$invalid) {
          this.$v.$touch();
          return;
        }

        this.loading = true;

        const isRedirect = await this.resetPassword({
          email: this.email,
          recaptchaToken
        });

        this.loading = false;

        !isRedirect || this.goHome();
      },
    },
    computed: {
      validEmailRequired() {
        return this.$v.email.$dirty && !this.$v.email.required;
      },
      validEmailIsEmail() {
        return this.$v.email.$dirty && !this.$v.email.email;
      },
      validEmail() {
        return this.validEmailRequired || this.validEmailIsEmail;
      },
    },
    validations: {
      email: {email, required},
    },
    components: {
      VueRecaptcha
    },
  };
</script>

<style scoped>

</style>
