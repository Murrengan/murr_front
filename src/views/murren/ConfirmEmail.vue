<template>
  <div class="main-slide-fade-container">

    <div class="hide__main-slide-fade-container">
      <a href="#"
         @click.prevent="switchMurrenEmailActivate">
        <i class="el-icon-arrow-down hide-icon__main-slide-fade-container"></i>
      </a>
    </div>

    <h1 class="mb">Замечательно!</h1>
    <p class="mb">Почта успешно подтверждена</p>

    <div>
      <el-button
          class="murr-button"
          native-type="submit"
          @click="shownLoginForm">
        Войти
      </el-button>
    </div>

  </div>
</template>

<script>

    import axios from "axios";

    export default {

        async created() {

            const murren_email = this.$route.query.activation_code;
            let data = {murren_email: murren_email};
            const murrBackResponse = await axios.post('/murren/activation/', data);

            if (murrBackResponse.data.murren_is_active === true) {

                const dataForPopUpMessage = {
                    message: 'Почта успешно подтверждена. Добро пожаловать😎',
                    type: 'success'
                };

                await this.$store.dispatch('popUpMessage', dataForPopUpMessage);

            } else {

                if (murrBackResponse.data.error_on_backend === true) {

                    const dataForPopUpMessage = {
                        message: 'Кое-что пошло не так',
                        type: 'warning'
                    };

                    await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
                }
            }
        },

        methods: {

            async shownLoginForm() {

                await this.$router.push('/');
                await this.$store.dispatch('changeShowLoginForm_actions')
            },

            async switchMurrenEmailActivate() {
                await this.$router.push('/');
            }
        },
    }
</script>