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

    <form @submit.prevent="() => $refs.invisibleRecaptcha.execute()">

      <div class="mb">

        <label>
          <input
            type="text"
            placeholder="Почта"
            v-model.trim="email"
            :class="{invalid_field: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
          >
        </label>

        <div
          class="error-text"
          v-if="$v.email.$dirty && !$v.email.required">
          Почта нужна для восстановления пароля
        </div>

        <div
          class="error-text"
          v-else-if="$v.email.$dirty && !$v.email.email">
          Почта указана не верно
        </div>

      </div>

      <div class="terms mb">
        <small>Эта почта была указана при регистрации</small>
      </div>

      <div>
        <vue-recaptcha
          ref="invisibleRecaptcha"
          size="invisible"
          @verify="handlerResetPassword"
          :sitekey="siteKey"
        />

        <el-button
          class="murr-button mb"
          native-type="submit"
          :loading="loading"
        >
          Жду письмо
        </el-button>

      </div>

    </form>

  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import VueRecaptcha from 'vue-recaptcha';
  import {email, required} from 'vuelidate/lib/validators';
  import {siteKey} from '@/devAndProdVariables';

  export default {
    components: {VueRecaptcha},
    data: () => ({
      siteKey,
      email: '',
      loading: false,
    }),
    validations: {
      email: {email, required},
    },
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
  };
</script>

<style scoped>

</style>
