<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#"
         @click.prevent="switchLoginForm">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <a href="#" @click.prevent="switchLoginForm">
      <img
          src="@/assets/img/logo_in_circle.png"
          alt="circle_logo"
          class="murrengan-logo mb">
    </a>

    <form @submit.prevent="login">

      <h1 class="mb">Войти</h1>

      <div class="mb">
        <label>
          <input
              type="text"
              v-model.trim="murren_username"
              placeholder="Имя в Мурренган"
              :class="{invalid_field: ($v.murren_username.$dirty && !$v.murren_username.required)
              || (this.accountActivated === false)}"
          >
        </label>

        <div
            class="error-text"
            v-if="$v.murren_username.$dirty && !$v.murren_username.required">
          Какое у тебя имя в Мурренган?
        </div>

        <div
            class="error-text"
            v-if="this.accountActivated === false">
          Активный Муррен с указанными данными не найден
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

      <div class="flex mb">
        <a href="#"
           @click.prevent="hideLoginAndShowSignUpForm">
          <small class="link">РЕГИСТРАЦИЯ</small>
        </a>

        <span> / </span>

        <a href="#"
           @click.prevent="hideLoginAndShowResetPasswordForm">
          <small class="link">ВОССТАНОВИТЬ ПАРОЛЬ</small>
        </a>

      </div>

      <div>
        <el-button
            native-type="submit"
            class="murr-button mb"
        >Войти
        </el-button>
      </div>

    </form>

  </div>
</template>

<script>

    import {required, minLength} from 'vuelidate/lib/validators'

    export default {

        data: () => ({

            murren_username: '',
            murren_password: '',
            accountActivated: true
        }),

        watch: {

            murren_username() {
                this.accountActivated = true
            }
        },

        validations: {

            murren_username: {required},
            murren_password: {required, minLength: minLength(6)}
        },

        methods: {

            switchLoginForm() {
                this.$store.dispatch('changeShowLoginForm_actions')
            },
            hideLoginAndShowResetPasswordForm() {

                this.$store.dispatch('changeShowLoginForm_actions');
                this.$store.dispatch('changeShowResetPasswordForm_actions');
            },
            hideLoginAndShowSignUpForm() {

                this.$store.dispatch('changeShowLoginForm_actions');
                this.$store.dispatch('changeShownSignUpForm_actions');
            },


            async login() {

                if (this.$v.$invalid) {

                    this.$v.$touch();
                    return
                }

                const formData = {

                    username: this.murren_username,
                    password: this.murren_password,
                };

                try {

                    await this.$store.dispatch('login', formData);
                    await this.$store.dispatch('changeShowLoginForm_actions');
                    await this.$router.push('/murren');

                } catch (e) {

                    if (e.response.data.detail === 'No active account found with the given credentials') {

                        this.accountActivated = false
                    }
                }
            }
        }
    }
</script>

<style scoped>


</style>