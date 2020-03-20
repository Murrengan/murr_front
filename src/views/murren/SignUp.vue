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

    <h1 class="mb">Создать аккаунт</h1>

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
        <div v-if="uniqueEmail" class="m-form__help">
          Эта почта уже используется
        </div>
      </div>
      <!-- Email field end -->

      <!-- Username field begin -->
      <div :class="{'m-form__group--invalid': validUserName}" class="m-form__group">
        <label class="m-form__label">
          <input type="text" placeholder="Имя в Мурренган" class="m-form__control"
                 v-model.trim="username">

          <span v-if="validUserName && username.length"
                @click="() => username = ''"
                class="m-form__clear"></span>
        </label>

        <div v-if="validUserNameRequired" class="m-form__help">
          У каждого члена Мурренган есть имя
        </div>
        <div v-if="uniqueName" class="m-form__help">
          Это имя уже используется
        </div>
        <div v-if="validUserNameMaxLength" class="m-form__help">
          Имя максимум {{ $v.username.$params.maxLength.max }} символов
        </div>
      </div>
      <!-- Username field end -->

      <!-- Password field begin -->
      <div :class="{'m-form__group--invalid': validPassword}" class="m-form__group">
        <label class="m-form__label">
          <input type="password" placeholder="Пароль" class="m-form__control"
                 v-model.trim="password">
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
      <!-- Password field end -->

      <div class="m-form__group">
        <small>
          Регистрирация подтверждает, что ты согласен с нашими <a href="#" class="link">правилами</a>
        </small>
      </div>

      <vue-recaptcha ref="invisibleRecaptcha" size="invisible"
                     @verify="signUp"
                     :sitekey="siteKey"/>

      <el-button class="murr-button mb" native-type="submit"
                 :loading="loading">
        Создать
      </el-button>
    </form>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import VueRecaptcha from 'vue-recaptcha';
  import {email, required, maxLength, minLength, helpers} from 'vuelidate/lib/validators';
  import {siteKey} from '@/devAndProdVariables';

  export default {
    data: () => ({
      siteKey,
      email: '',
      username: '',
      password: '',
      uniqueEmail: false,
      uniqueName: false,
      passwordIsTooCommon: false,
      passwordIsTooSimilarToUsername: false,
      passwordIsTooSimilarToEmail: false,
      loading: false,
    }),
    methods: {
      ...mapActions({
        createMurren: 'createMurren',
        notification: 'popUpMessage',
        goHome: 'changeShownSignUpForm_actions',
      }),
      async signUp(recaptchaToken) {

        this.$refs.invisibleRecaptcha.reset()

        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }

        this.loading = true
        const result = await this.createMurren({
          recaptchaToken,
          email: this.email,
          username: this.username,
          password: this.password,
        })
        this.loading = false

        if (result.recaptchaError || result.error) {
          this.notification({
            message: 'Ошибка на сервере',
            type: 'error',
          })
          return
        }

        if (result.murrenIsCreated) {
          this.notification({
            message: 'Письмо для активации отправлено на почту 😘',
            type: 'success',
          })
          this.goHome()
          return
        }

        this.uniqueName = result.uniqueName
        this.uniqueEmail = result.uniqueEmail
        this.passwordIsTooCommon = result.passwordIsTooCommon
        this.passwordIsTooSimilarToUsername = result.passwordIsTooSimilarToUsername
        this.passwordIsTooSimilarToEmail = result.passwordIsTooSimilarToEmail
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
        return this.validEmailRequired || this.validEmailIsEmail || this.uniqueEmail
      },
      validUserNameRequired() {
        return this.$v.username.$dirty && !this.$v.username.required
      },
      validUserNameMaxLength() {
        return this.$v.username.$dirty && !this.$v.username.maxLength;
      },
      validUserName() {
        return this.validUserNameRequired || this.validUserNameMaxLength || this.uniqueName
      },
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
        return this.validPasswordRequired || this.validPasswordMinLength || this.validPasswordIsNumeric ||
          this.passwordIsTooCommon || this.passwordIsTooSimilarToUsername || this.passwordIsTooSimilarToEmail
      },
    },
    watch: {
      email() {
        this.uniqueEmail = false
      },
      username() {
        this.uniqueName = false
      },
      password() {
        this.passwordIsTooCommon = false
      },
    },
    validations: {
      email: {email, required},
      username: {required, maxLength: maxLength(24)},
      password: {
        required,
        minLength: minLength(6),
        is_numeric: helpers.regex('alpha', /^(?=.*?[^0-9])/),
      },
    },
    components: {
      VueRecaptcha,
    },
  };
</script>
