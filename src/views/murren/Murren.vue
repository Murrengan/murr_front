<template>
  <div class="home-main-container">

    <p class="mb font">Это личная страничка Муррена</p>
    <small>Доступно для авторизованного Муррена</small>
    <div>
      <img
          :src="tanochkaUrl"
          alt="tanochka"
          class="tanochka">
    </div>

    <div class="bottom-info">
      <el-button
          class="murr-button__danger"
          @click="logout"
      >
        Выйти
      </el-button>
    </div>

  </div>
</template>

<script>

    import axios from "axios";

    export default {

        async beforeCreate() {

            const r = await axios.get('murren/tanochka/',
                {headers: {'Authorization': 'Bearer ' + this.$store.getters.accessToken_getters}});
            this.tanochkaUrl = axios.defaults.baseURL + r.data.img_url;

        },

        data: () => ({
            tanochkaUrl: ''
        }),

        methods: {
            async logout() {

                const dataForPopUpMessage = {
                    message: 'Ты разлогинился 😱',
                    customClass: 'element-ui-message__success',
                    type: 'success'
                };

                await this.$store.dispatch('popUpMessage', dataForPopUpMessage);
                await this.$store.dispatch('logout');
                await this.$router.push('/');

            }
        }
    }
</script>

<style scoped>

  .bottom-info {
    position: absolute;
    bottom: 0;
    padding-bottom: 60px;
    display: flex;
    flex-direction: column;

  }

  .home-main-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 15px;
    background-color: #1a2931;
  }

  .tanochka {
    max-width: 300px;
    margin: 1rem;
    border-radius: 5px;
    border: #AD00FF 1px solid;
  }

  .font {
    font-size: 1.2rem;
  }
</style>