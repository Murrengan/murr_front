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

    <form @submit.prevent="createRecaptchaTokenThenSignUp">


      <h1 class="mb">Создать аккаунт</h1>

      <div class="mb">
        <label>
          <input
              type="text"
              v-model.trim="murren_email"
              placeholder="Почта"
              :class="{invalid_field: ($v.murren_email.$dirty && !$v.murren_email.required)
              || ($v.murren_email.$dirty && !$v.murren_email.email)
              || (this.uniqueMurrenEmail === false)}"
          >
        </label>

        <div
            class="error-text"
            v-if="$v.murren_email.$dirty && !$v.murren_email.required">
          Почта нужна для восстановления пароля
        </div>

        <div
            class="error-text"
            v-else-if="$v.murren_email.$dirty && !$v.murren_email.email">
          Почта указана не верно
        </div>

        <div
            class="error-text"
            v-else-if="this.uniqueMurrenEmail === false">
          Эта почта уже используется
        </div>

      </div>

      <div class="mb">
        <label>
          <input
              type="text"
              v-model.trim="murren_username"
              placeholder="Имя в Мурренган"
              :class="{invalid_field: ($v.murren_username.$dirty && !$v.murren_username.required)
              || (this.uniqueMurrenName === false)}"
          >
        </label>

        <div
            class="error-text"
            v-if="$v.murren_username.$dirty && !$v.murren_username.required">
          У каждого члена Мурренган есть имя
        </div>

        <div
            class="error-text"
            v-else-if="this.uniqueMurrenName === false">
          Это имя уже используется
        </div>
      </div>

      <div class="mb">
        <label>
          <input
              type="password"
              v-model.trim="murren_password"
              placeholder="Пароль"
              :class="{invalid_field: ($v.murren_password.$dirty && !$v.murren_password.required) || ($v.murren_password.$dirty && !$v.murren_password.minLength)}"

          >
        </label>

        <div
            class="error-text"
            v-if="$v.murren_password.$dirty && !$v.murren_password.required">
          Пароль нужен обязательно
        </div>

        <div
            class="error-text"
            v-else-if="$v.murren_password.$dirty && !$v.murren_password.minLength">
          Пароль минимум {{ $v.murren_password.$params.minLength.min }} символов
        </div>
      </div>

      <div class="terms mb">
        <small>Регистрирация подтверждает, что ты согласен с нашими <a href="#" class="link">правилами</a></small>

      </div>

      <div>

        <vue-recaptcha
            ref="invisibleRecaptcha"
            @verify="signUp"
            size="invisible"
            :sitekey="siteKey"
        >

        </vue-recaptcha>

        <el-button
            native-type="submit"
            class="murr-button mb"
            :loading="this.showLoadingBtn"

        >Создать
        </el-button>

      </div>

    </form>

  </div>
</template>

<script>

    import VueRecaptcha from 'vue-recaptcha';
    import axios from 'axios'
    import {email, required, minLength} from 'vuelidate/lib/validators'
    import {siteKey} from "@/devAndProdVariables";

    export default {
        data: () => ({

            murren_email: '',
            murren_username: '',
            murren_password: '',
            siteKey: siteKey,
            uniqueMurrenEmail: true,
            uniqueMurrenName: true,
            showLoadingBtn: false

        }),

        methods: {

            async createRecaptchaTokenThenSignUp() {

                this.showLoadingBtn = true;
                await this.$refs.invisibleRecaptcha.execute()
            },

            async signUp(recaptchaToken) {

                if (this.$v.$invalid) {

                    this.$v.$touch();
                    this.showLoadingBtn = false;
                    return
                }

                const formData = {

                    email: this.murren_email,
                    username: this.murren_username,
                    password: this.murren_password,
                    recaptchaToken: recaptchaToken
                };

                const murrBackResponse = await axios.post('/murren/register/', formData);

                if (murrBackResponse.data.is_murren_created === 'true') {

                    await this.$store.dispatch('changeShownSignUpForm_actions');
                    await this.$store.dispatch('changeCheckEmail_actions');
                    this.showLoadingBtn = false;

                    const dataForPopUpMessage = {
                        message: 'Письмо для активации отправлено на почту 😘',
                        type: 'success'
                    };

                    await this.$store.dispatch('popUpMessage', dataForPopUpMessage);

                } else {

                    if (murrBackResponse.data.recaptcha_response_problem === true) {

                        this.showLoadingBtn = false;

                        const dataForPopUpMessage = {
                            message: murrBackResponse.data.recaptcha_response_text,
                            type: 'warning'
                        };

                        await this.$store.dispatch('popUpMessage', dataForPopUpMessage);

                    }

                    if (murrBackResponse.data.hasOwnProperty('username')) {

                        if (murrBackResponse.data.username[0] === 'A user with that username already exists.') {

                            this.uniqueMurrenName = false;
                            this.showLoadingBtn = false;
                        }
                    }

                    if (murrBackResponse.data.hasOwnProperty('email')) {

                        if (murrBackResponse.data.email[0] === 'User with this Email already exists.') {

                            this.uniqueMurrenEmail = false;
                            this.showLoadingBtn = false;
                        }
                    }
                }
            },

            switchSignUpForm() {
                this.$store.dispatch('changeShownSignUpForm_actions')
            },

        },

        components: {VueRecaptcha},

        validations: {

            murren_email: {email, required},
            murren_username: {required},
            murren_password: {required, minLength: minLength(6)}
        },

        watch: {

            murren_email() {
                this.uniqueMurrenEmail = true
            },

            murren_username() {
                this.uniqueMurrenName = true
            }
        },
    }
</script>

<style scoped>

  .terms {
    margin: 1rem;
  }

</style>