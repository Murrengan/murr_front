<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#"
         @click.prevent="switchSetNewPasswordForm">
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
                 v-model.trim="murren_password_1">
        </label>

        <div v-if="validPasswordRequired" class="m-form__help">
          Пароль нужен обязательно
        </div>
        <div v-if="validPasswordMinLength" class="m-form__help">
          Пароль минимум {{ $v.murren_password_1.$params.minLength.min }} символов
        </div>
        <div v-else-if="validPasswordIsNumeric" class="m-form__help">
          Пароль не должен состоять только из цифр
        </div>
        <div v-else-if="newPasswordTooCommon" class="m-form__help">
          Пароль слишком простой
        </div>
      </div>
      <!-- Password field end -->

      <!-- PasswordConfirm field begin -->
      <div :class="{'m-form__group--invalid': validPasswordConfirm}" class="m-form__group">
        <label class="m-form__label">
          <input type="password" placeholder="Повторить новый пароль" class="m-form__control"
                 v-model.trim="murren_password_2">
        </label>

        <div v-if="validPasswordConfirmRequired" class="m-form__help">
          Пароль нужен обязательно
        </div>
        <div v-if="validPasswordConfirmMinLength" class="m-form__help">
          Пароль минимум {{ $v.murren_password_2.$params.minLength.min }} символов
        </div>
        <div v-if="!newPasswordsMatch" class="m-form__help">
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
  import axios from 'axios';
  import {required, minLength, helpers} from 'vuelidate/lib/validators';
  import VueRecaptcha from 'vue-recaptcha';
  import {siteKey} from '@/devAndProdVariables';

  export default {
    data: () => ({
      siteKey,
      murren_password_1: '',
      murren_password_2: '',
      newPasswordsMatch: true,
      newPasswordTooCommon: false,
      loading: false,
    }),
    methods: {
      async setNewPassword(recaptchaToken) {
        if (this.$v.$invalid) {
          this.$v.$touch();
          return;
        }

        if (this.murren_password_1 !== this.murren_password_2) {
          this.newPasswordsMatch = false;
          return;
        }

        this.loading = true;

        const murren_email = this.$route.query.activation_code;

        const formData = {
          murren_password_1: this.murren_password_1,
          murren_password_2: this.murren_password_2,
          murren_email,
          recaptchaToken,
        };

        const murrBackResponse = await axios.post('/murren/confirm_new_password/', formData);

        if (murrBackResponse.data.password_successfully_changed === true) {
          const dataForPopUpMessage = {
            message: 'Пароль успешно изменен. Добро пожаловать 😎',
            type: 'success',
          };

          this.loading = false;
          await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
          await this.$router.push('/');
          await this.$store.dispatch('changeShowLoginForm_actions');
        } else {
          if (murrBackResponse.data.password_not_valid) {
            if (murrBackResponse.data.password[0] === 'This password is too common.') {
              this.newPasswordTooCommon = true;
              this.loading = false;
            }
          }

          if (murrBackResponse.data.error_on_backend === true) {
            this.loading = false;
            const dataForPopUpMessage = {
              message: 'Кое-что пошло не так',
              type: 'error',
            };

            await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
          }
        }
      },
      async switchSetNewPasswordForm() {
        await this.$router.push('/');
      },
    },
    computed: {
      validPasswordRequired() {
        return this.$v.murren_password_1.$dirty && !this.$v.murren_password_1.required;
      },
      validPasswordMinLength() {
        return this.$v.murren_password_1.$dirty && !this.$v.murren_password_1.minLength;
      },
      validPasswordIsNumeric() {
        return this.$v.murren_password_1.$dirty && !this.$v.murren_password_1.is_numeric;
      },
      validPassword() {
        return this.validPasswordRequired || this.validPasswordMinLength || this.validPasswordIsNumeric ||
            !this.newPasswordsMatch || this.newPasswordTooCommon;
      },
      validPasswordConfirmRequired() {
        return this.$v.murren_password_2.$dirty && !this.$v.murren_password_2.required;
      },
      validPasswordConfirmMinLength() {
        return this.$v.murren_password_2.$dirty && !this.$v.murren_password_2.minLength;
      },
      validPasswordConfirm() {
        return this.validPasswordConfirmRequired || this.validPasswordConfirmMinLength ||
            !this.newPasswordsMatch || this.newPasswordTooCommon;
      }
    },
    watch: {
      murren_password_1() {
        this.newPasswordsMatch = true;
        this.newPasswordTooCommon = false;
      },
      murren_password_2() {
        this.newPasswordsMatch = true;
      },
    },
    validations: {
      murren_password_1: {
        required,
        minLength: minLength(6),
        is_numeric: helpers.regex('alpha', /^(?=.*?[^0-9])/)
      },
      murren_password_2: {
        required,
        minLength: minLength(6),
      },
    },
    components: {
      VueRecaptcha,
    },
  };
</script>
