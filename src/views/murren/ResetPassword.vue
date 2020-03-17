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
  import {mapActions} from 'vuex'
  import VueRecaptcha from 'vue-recaptcha'
  import {email, required} from 'vuelidate/lib/validators'
  import {siteKey} from '@/devAndProdVariables'

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
        setTimeRestriction: 'restrictedAccess/runRestriction',
        isWaiting: 'restrictedAccess/isWaiting',
        notification: 'popUpMessage',
      }),
      async handlerResetPassword(recaptchaToken) {

        this.$refs.invisibleRecaptcha.reset()

        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }

        if (await this.isWaiting(5 * 60)) {
          this.notification({
            message: 'Попробуйте попытку чуть позже',
            type: 'warning',
          })
          return
        }

        this.loading = true
        const result = await this.resetPassword({
          email: this.email,
          recaptchaToken,
        })
        this.loading = false

        if (result.error) {
          this.notification({
            message: 'Ошибка на сервере',
            type: 'error',
          })
          return
        }

        this.notification({
          message: 'Вы получите письмо с востановлением данных на эту почту, ' +
            'если она была подтверждена',
          type: 'success',
        })

        this.goHome()
        this.setTimeRestriction()
      },
    },
    computed: {
      validEmailRequired() {
        return this.$v.email.$dirty && !this.$v.email.required
      },
      validEmailIsEmail() {
        return this.$v.email.$dirty && !this.$v.email.email
      },
      validEmail() {
        return this.validEmailRequired || this.validEmailIsEmail
      },
    },
    validations: {
      email: {email, required},
    },
    components: {
      VueRecaptcha,
    },
  };
</script>

<style scoped>

</style>
