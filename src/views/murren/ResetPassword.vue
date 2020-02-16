<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#"
         @click.prevent="switchResetPassword">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <a href="#" @click.prevent="switchResetPassword">
      <img
          src="@/assets/img/logo_in_circle.png"
          alt="circle_logo"
          class="murrengan-logo mb">
    </a>


    <form @submit.prevent="createRecaptchaTokenThenResetPassword">
      <h1 class="mb">Восстановить пароль</h1>

      <div class="mb">

        <label>
          <input
              type="text"
              v-model.trim="murren_email"
              placeholder="Почта"
              :class="{invalid_field: ($v.murren_email.$dirty && !$v.murren_email.required)
              || ($v.murren_email.$dirty && !$v.murren_email.email)
              || (this.existMurrenEmail === false)}"
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
            v-else-if="this.existMurrenEmail === false">
          Эта почта не используется
        </div>

      </div>

      <div class="terms mb">
        <small>Эта почта была указана при регистрации</small>

      </div>

      <div>

        <vue-recaptcha
            ref="invisibleRecaptcha"
            @verify="resetPassword"
            size="invisible"
            :sitekey="siteKey"
        >

        </vue-recaptcha>

        <el-button
            native-type="submit"
            class="murr-button mb"
            :loading="this.showLoadingBtn"
        >
          Жду письмо
        </el-button>

      </div>

    </form>

  </div>
</template>

<script>
    import VueRecaptcha from 'vue-recaptcha';
    import axios from 'axios'
    import {email, required} from 'vuelidate/lib/validators'
    import {siteKey} from "@/devAndProdVariables";

    export default {

        components: {VueRecaptcha},

        data: () => ({

            murren_email: '',

            siteKey: siteKey,

            existMurrenEmail: true,
            showLoadingBtn: false

        }),
        methods: {

            async createRecaptchaTokenThenResetPassword() {

                this.showLoadingBtn = true;
                await this.$refs.invisibleRecaptcha.execute()
            },

            async resetPassword(recaptchaToken) {

                if (this.$v.$invalid) {

                    this.$v.$touch();
                    this.showLoadingBtn = false;
                    return
                }

                const formData = {

                    email: this.murren_email,
                    recaptchaToken: recaptchaToken
                };

                const murrBackResponse = await axios.post('/murren/reset_password/', formData);

                if (murrBackResponse.data.email_sent_successfully === true) {

                    await this.$store.dispatch('changeShowResetPasswordForm_actions');
                    this.showLoadingBtn = false;

                    const dataForPopUpMessage = {

                        message: 'Письмо для восстановления пароля отправлено на почту 😘',
                        customClass: 'element-ui-message__success',
                        type: 'success'
                    };

                    await this.$store.dispatch('popUpMessage', dataForPopUpMessage);

                } else {

                    if (murrBackResponse.data.recaptcha_response_problem === true) {

                        this.showLoadingBtn = false;

                        const dataForPopUpMessage = {

                            message: murrBackResponse.data.recaptcha_response_text,
                            customClass: 'element-ui-message__error',
                            type: 'warning'
                        };

                        await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
                    }

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

            switchResetPassword() {
                this.$store.dispatch('changeShowResetPasswordForm_actions')
            }
        },

        validations: {

            murren_email: {email, required},
        },
    }
</script>

<style scoped>

</style>