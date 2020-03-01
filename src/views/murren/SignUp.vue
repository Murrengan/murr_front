<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#"
         @click.prevent="switchSignUpForm">
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
                 v-model.trim="murren_email">

          <span v-if="validEmail && murren_email.length"
                @click="() => murren_email = ''"
                class="m-form__clear"></span>
        </label>

        <div v-if="validEmailRequired" class="m-form__help">
          Почта нужна для восстановления пароля
        </div>
        <div v-if="validEmailIsEmail" class="m-form__help">
          Почта указана не верно
        </div>
        <div v-if="!uniqueMurrenEmail" class="m-form__help">
          Эта почта уже используется
        </div>
      </div>
      <!-- Email field end -->

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
          У каждого члена Мурренган есть имя
        </div>
        <div v-if="!uniqueMurrenName" class="m-form__help">
          Это имя уже используется
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
        <div v-else-if="validPasswordMinLength" class="m-form__help">
          Пароль минимум {{ $v.murren_password.$params.minLength.min }} символов
        </div>
        <div v-else-if="validPasswordIsNumeric" class="m-form__help">
          Пароль не должен состоять только из цифр
        </div>
        <div v-else-if="passwordIsTooCommon" class="m-form__help">
          Пароль слишком простой
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
  import VueRecaptcha from 'vue-recaptcha';
  import axios from 'axios';
  import {email, required, minLength, helpers} from 'vuelidate/lib/validators';
  import {siteKey} from '@/devAndProdVariables';

  export default {
    data: () => ({
      siteKey,
      murren_email: '',
      murren_username: '',
      murren_password: '',
      uniqueMurrenEmail: true,
      uniqueMurrenName: true,
      loading: false,
      passwordIsTooCommon: false
    }),
    methods: {
      async signUp(recaptchaToken) {
        if (this.$v.$invalid) {
          this.$v.$touch();
          this.loading = false;
          return;
        }

        this.loading = true;

        const formData = {
          recaptchaToken,
          email: this.murren_email,
          username: this.murren_username,
          password: this.murren_password
        };

        const murrBackResponse = await axios.post('/murren/register/', formData);

        if (murrBackResponse.data.is_murren_created === 'true') {
          await this.$store.dispatch('changeShownSignUpForm_actions');
          await this.$store.dispatch('changeCheckEmail_actions');
          this.loading = false;

          const dataForPopUpMessage = {
            message: 'Письмо для активации отправлено на почту 😘',
            customClass: 'element-ui-message__success',
            type: 'success',
          };

          await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
        } else {
          if (murrBackResponse.data.recaptcha_response_problem === true) {
            this.loading = false;

            const dataForPopUpMessage = {
              message: murrBackResponse.data.recaptcha_response_text,
              customClass: 'element-ui-message__error',
              type: 'warning',
            };

            await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
          }

          if (murrBackResponse.data.hasOwnProperty('username')) {
            if (murrBackResponse.data.username[0] === 'A user with that username already exists.') {
              this.uniqueMurrenName = false;
              this.loading = false;
            }
          }

          if (murrBackResponse.data.hasOwnProperty('email')) {
            if (murrBackResponse.data.email[0] === 'User with this Email already exists.') {
              this.uniqueMurrenEmail = false;
              this.loading = false;
            }
          }

          if (murrBackResponse.data.hasOwnProperty('password')) {
            if (murrBackResponse.data.password[0] === 'This password is too common.') {
              this.passwordIsTooCommon = true;
              this.loading = false;
            }
          }
        }
      },
      switchSignUpForm() {
        this.$store.dispatch('changeShownSignUpForm_actions');
      },
    },
    computed: {
      validEmailRequired() {
        return this.$v.murren_email.$dirty && !this.$v.murren_email.required;
      },
      validEmailIsEmail() {
        return this.$v.murren_email.$dirty && !this.$v.murren_email.email;
      },
      validEmail() {
        return this.validEmailRequired || this.validEmailIsEmail || !this.uniqueMurrenEmail;
      },
      validUserNameRequired() {
        return this.$v.murren_username.$dirty && !this.$v.murren_username.required;
      },
      validUserName() {
        return this.validUserNameRequired || !this.uniqueMurrenName;
      },
      validPasswordRequired() {
        return this.$v.murren_password.$dirty && !this.$v.murren_password.required;
      },
      validPasswordMinLength() {
        return this.$v.murren_password.$dirty && !this.$v.murren_password.minLength;
      },
      validPasswordIsNumeric() {
        return this.$v.murren_password.$dirty && !this.$v.murren_password.is_numeric;
      },
      validPassword() {
        return this.validPasswordRequired || this.validPasswordMinLength || this.validPasswordIsNumeric ||
            this.passwordIsTooCommon;
      },
    },
    watch: {
      murren_email() {
        this.uniqueMurrenEmail = true;
      },
      murren_username() {
        this.uniqueMurrenName = true;
      },
      murren_password() {
        this.passwordIsTooCommon = false
      },
    },
    validations: {
      murren_email: {email, required},
      murren_username: {required},
      murren_password: {
        required,
        minLength: minLength(6),
        is_numeric: helpers.regex('alpha', /^(?=.*?[^0-9])/)
      },
    },
    components: {
      VueRecaptcha
    },
  };
</script>
