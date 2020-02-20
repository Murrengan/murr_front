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

    <form @submit.prevent="createRecaptchaTokenThenSetNewPassword">
      <h1 class="mb">Новый пароль</h1>

      <div class="mb">
        <label>
          <input
              type="password"
              v-model.trim="murren_password_1"
              placeholder="Новый пароль"
              :class="{invalid_field: ($v.murren_password_1.$dirty && !$v.murren_password_1.required)
              || ($v.murren_password_1.$dirty && !$v.murren_password_1.minLength)
              || (this.newPasswordsMatch === false)}"
          >
        </label>

        <div
            class="error-text"
            v-if="$v.murren_password_1.$dirty && !$v.murren_password_1.required">
          Пароль нужен обязательно
        </div>

        <div
            class="error-text"
            v-else-if="$v.murren_password_1.$dirty && !$v.murren_password_1.minLength">
          Пароль минимум {{ $v.murren_password_1.$params.minLength.min }} символов
        </div>

        <div
            class="error-text"
            v-if="this.newPasswordsMatch === false">
          Пароли не совпадают
        </div>

      </div>

      <div class="mb">
        <label>
          <input
              type="password"
              v-model.trim="murren_password_2"
              placeholder="Повторить новый пароль"
              :class="{invalid_field: ($v.murren_password_2.$dirty && !$v.murren_password_2.required)
              || ($v.murren_password_2.$dirty && !$v.murren_password_2.minLength)
              || (this.newPasswordsMatch === false)}"
          >
        </label>

        <div
            class="error-text"
            v-if="$v.murren_password_2.$dirty && !$v.murren_password_2.required">
          Пароль нужен обязательно
        </div>

        <div
            class="error-text"
            v-else-if="$v.murren_password_2.$dirty && !$v.murren_password_2.minLength">
          Пароль минимум {{ $v.murren_password_2.$params.minLength.min }} символов
        </div>
        <div
            class="error-text"
            v-if="this.newPasswordsMatch === false">
          Пароли не совпадают
        </div>
      </div>

      <div>

        <vue-recaptcha
            ref="invisibleRecaptcha"
            @verify="setNewPassword"
            size="invisible"
            :sitekey="siteKey"
        >

        </vue-recaptcha>

        <el-button
            native-type="submit"
            class="murr-button mb"
            :loading="this.showLoadingBtn"

        >Готово
        </el-button>

      </div>

    </form>

  </div>

</template>

<script>

    import axios from "axios";
    import {required, minLength} from 'vuelidate/lib/validators'
    import VueRecaptcha from 'vue-recaptcha';
    import {siteKey} from "@/devAndProdVariables";

    export default {

        data: () => ({

            murren_password_1: '',
            murren_password_2: '',

            siteKey: siteKey,

            newPasswordsMatch: true,
            showLoadingBtn: false

        }),

        methods: {

            async createRecaptchaTokenThenSetNewPassword() {

                if (this.murren_password_1 !== this.murren_password_2) {

                    this.newPasswordsMatch = false;
                    return
                }

                if (this.$v.$invalid) {

                    this.$v.$touch();
                    return
                }

                this.showLoadingBtn = true;
                await this.$refs.invisibleRecaptcha.execute()
            },

            async setNewPassword(recaptchaToken) {


                const murren_email = this.$route.query.activation_code;

                const formData = {
                    murren_password_1: this.murren_password_1,
                    murren_password_2: this.murren_password_2,
                    murren_email: murren_email,
                    recaptchaToken: recaptchaToken
                };

                const murrBackResponse = await axios.post('/murren/confirm_new_password/', formData);

                if (murrBackResponse.data.password_successfully_changed === true) {

                    const dataForPopUpMessage = {
                        message: 'Пароль успешно изменен. Добро пожаловать😎',
                        customClass: 'element-ui-message__success',
                        type: 'success'
                    };

                    this.showLoadingBtn = false;
                    await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
                    await this.$router.push('/');
                    await this.$store.dispatch('changeShowLoginForm_actions');


                } else {

                    if (murrBackResponse.data.error_on_backend === true) {

                        this.showLoadingBtn = false;
                        const dataForPopUpMessage = {
                            message: 'Кое-что пошло не так',
                            customClass: 'element-ui-message__error',
                            type: 'warning'
                        };
                        await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
                    }
                }
            },

            async switchSetNewPasswordForm() {

                await this.$router.push('/');
            }

        },

        components: {VueRecaptcha},

        validations: {

            murren_password_1: {required, minLength: minLength(6)},
            murren_password_2: {required, minLength: minLength(6)}
        },

        watch: {

            murren_password_1() {
                this.newPasswordsMatch = true
            },

            murren_password_2() {
                this.newPasswordsMatch = true
            }
        },
    }
</script>

<style scoped>

</style>