<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#" @click.prevent="goHome">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <div>
      <img src="@/assets/img/logo_pink.png" alt="circle_logo" class="murrengan-logo mb">
    </div>

    <h1 class="mb">Войти</h1>

    <form class="m-from"
          @submit.prevent="() => $refs.invisibleRecaptcha.execute()">

      <!-- Username field begin -->
      <div :class="{'m-form__group--invalid': validUserName}" class="m-form__group">
        <label class="m-form__label">
          <input type="text" placeholder="Имя в Мурренган" class="m-form__control auth-input"
                 v-model.trim="murren_username">

          <span v-if="validUserName && murren_username.length"
                @click="() => murren_username = ''"
                class="m-form__clear"></span>
        </label>

        <div v-if="validUserNameRequired" class="m-form__help">
          Какое у тебя имя в Мурренган?
        </div>
        <div v-if="validUserNameMaxLength" class="m-form__help">
          Имя максимум {{ $v.murren_username.$params.maxLength.max }} символов
        </div>
        <div v-if="!accountActivated" class="m-form__help">
          Активный Муррен с указанными данными не найден
        </div>
      </div>
      <!-- Username field end -->

      <!-- Password field begin -->
      <div :class="{'m-form__group--invalid': validPassword}" class="m-form__group">
        <label class="m-form__label">
          <input type="password" placeholder="Пароль" class="m-form__control auth-input"
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
        <a href="#" class="hide-a-decoration" @click.prevent="handlerGoSignUp">
          <small class="link">РЕГИСТРАЦИЯ</small>
        </a>

        <span> / </span>

        <a href="#" class="hide-a-decoration" @click.prevent="handlerGoResetPassword">
          <small class="link">ВОССТАНОВИТЬ ПАРОЛЬ</small>
        </a>
      </div>

      <vue-recaptcha ref="invisibleRecaptcha" size="invisible"
                     @verify="handlerLogin"
                     :sitekey="siteKey"/>

      <el-button class="murr-button mb" native-type="submit"
                 :loading="loading">
        Войти
      </el-button>

    </form>
  </div>
</template>

<script>
  import { mapActions } from "vuex"
  import { maxLength, minLength, required } from 'vuelidate/lib/validators'
  import VueRecaptcha from 'vue-recaptcha'
  import { siteKey } from '@/devAndProdVariables'

  export default {
    data: () => ({
      siteKey,
      murren_username: '',
      murren_password: '',
      accountActivated: true,
      loading: false,
    }),
    methods: {
      ...mapActions({
        goHome: 'changeShowLoginForm_actions',
        goResetPassword: 'changeShowResetPasswordForm_actions',
        goSignUp: 'changeShownSignUpForm_actions',
        createToken: 'createToken',
      }),
      handlerGoResetPassword() {
        this.goHome()
        this.goResetPassword()
      },
      handlerGoSignUp() {
        this.goHome()
        this.goSignUp()
      },
      async handlerLogin(recaptchaToken) {
        this.$refs.invisibleRecaptcha.reset()
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        this.loading = true
        const result = await this.createToken({
          recaptchaToken,
          username: this.murren_username,
          password: this.murren_password,
        })
        this.loading = false
        this.accountActivated = result.accountActivated
        if (!result.error) {
          const dataForPopUpMessage = {
            message: this.murren_username + ', добро пожаловать 😘',
            customClass: 'element-ui-message__success',
            type: 'success'
          }
          await this.$store.dispatch('popUpMessage', dataForPopUpMessage)
          this.murren_username = ''
          this.murren_password = ''
          this.goHome()
        }
      },
    },
    computed: {
      validPasswordRequired() {
        return this.$v.murren_password.$dirty && !this.$v.murren_password.required
      },
      validPasswordMinLength() {
        return this.$v.murren_password.$dirty && !this.$v.murren_password.minLength
      },
      validPassword() {
        return this.validPasswordRequired || this.validPasswordMinLength
      },
      validUserNameRequired() {
        return this.$v.murren_username.$dirty && !this.$v.murren_username.required
      },
      validUserNameMaxLength() {
        return this.$v.murren_username.$dirty && !this.$v.murren_username.maxLength
      },
      validUserName() {
        return this.validUserNameRequired || this.validUserNameMaxLength || !this.accountActivated
      },
    },
    validations: {
      murren_username: { required, maxLength: maxLength(24) },
      murren_password: { required, minLength: minLength(6) },
    },
    components: {
      VueRecaptcha
    },
  }
</script>
