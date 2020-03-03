<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#" @click.prevent="goHome">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <div>
      <img src="@/assets/img/logo_in_circle.png" alt="circle_logo" class="murrengan-logo mb">
    </div>

    <h1 class="mb">Новый пароль</h1>

    <form class="m-form"
          @submit.prevent="() => $refs.invisibleRecaptcha.execute()">

      <!-- Password field begin -->
      <div :class="{'m-form__group--invalid': validPassword}" class="m-form__group">
        <label class="m-form__label">
          <input type="password" placeholder="Новый пароль" class="m-form__control"
                 v-model.trim="password">
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
      <!-- Password field end -->

      <!-- PasswordConfirm field begin -->
      <div :class="{'m-form__group--invalid': validPasswordRepeat}" class="m-form__group">
        <label class="m-form__label">
          <input type="password" placeholder="Повторить новый пароль" class="m-form__control"
                 v-model.trim="passwordRepeat">
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
      <!-- PasswordConfirm field end -->

      <vue-recaptcha ref="invisibleRecaptcha" size="invisible"
                     @verify="setNewPassword"
                     :sitekey="siteKey"/>

      <el-button class="murr-button mb" native-type="submit"
                 :loading="loading">
        Готово
      </el-button>

    </form>

  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import VueRecaptcha from 'vue-recaptcha'
  import {required, minLength, helpers, sameAs} from 'vuelidate/lib/validators'
  import {siteKey} from '@/devAndProdVariables'

  export default {
    data: () => ({
      siteKey,
      password: '',
      passwordRepeat: '',
      passwordIsTooCommon: false,
      loading: false,
      toke: null,
    }),
    created() {
      if (!this.$route.query.activation_code) {
        this.notification({
          message: 'Вы пришли без токена.', type: 'warning',
        })
        this.$router.push('/')
        return
      }

      this.token = this.$route.query.activation_code
    },
    methods: {
      ...mapActions({
        notification: 'popUpMessage',
        goLogin: 'changeShowLoginForm_actions',
      }),
      async setNewPassword(recaptchaToken) {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }

        this.loading = true
        const result = await this.$store.dispatch('setNewPassword', {
          password: this.password,
          passwordRepeat: this.passwordRepeat,
          token: this.token,
          recaptchaToken,
        })
        this.loading = false

        if (result.otherError || result.error) {
          this.notification({
            message: 'Ошибка на сервере',
            type: 'error',
          })
          return
        }

        if (result.passwordIsChanged) {
          this.notification({
            message: 'Пароль успешно изменен. Добро пожаловать 😎',
            type: 'success',
          })
          this.goHome()
          this.goLogin()
          return
        }

        this.passwordIsTooCommon = result.passwordIsTooCommon
      },
      async goHome() {
        await this.$router.push('/')
      },
    },
    computed: {
      validPasswordRequired() {
        return this.$v.password.$dirty && !this.$v.password.required
      },
      validPasswordMinLength() {
        return this.$v.password.$dirty && !this.$v.password.minLength
      },
      validPasswordIsNumeric() {
        return this.$v.password.$dirty && !this.$v.password.is_numeric
      },
      validPassword() {
        return this.validPasswordRequired || this.validPasswordMinLength ||
            this.validPasswordIsNumeric || this.passwordIsTooCommon
      },
      validPasswordRepeatRequired() {
        return this.$v.passwordRepeat.$dirty && !this.$v.passwordRepeat.required
      },
      validPasswordRepeatMinLength() {
        return this.$v.passwordRepeat.$dirty && !this.$v.passwordRepeat.minLength
      },
      validPasswordRepeatNoMatch() {
        return this.$v.passwordRepeat.$dirty && !this.$v.passwordRepeat.noMatch
      },
      validPasswordRepeat() {
        return this.validPasswordRepeatRequired || this.validPasswordRepeatMinLength ||
            this.validPasswordRepeatNoMatch || this.passwordIsTooCommon
      },
    },
    watch: {
      password() {
        this.passwordIsTooCommon = false
      },
    },
    validations: {
      password: {
        required,
        minLength: minLength(6),
        is_numeric: helpers.regex('alpha', /^(?=.*?[^0-9])/),
      },
      passwordRepeat: {
        required,
        minLength: minLength(6),
        noMatch: sameAs('password'),
      },
    },
    components: {
      VueRecaptcha,
    },
  }
</script>
