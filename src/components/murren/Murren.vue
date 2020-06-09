<template>
  <div class="home-main-container">
    <p class="mb font">Это личная страничка Муррена</p>
    <small>Доступно для авторизованного Муррена</small>
    <div v-if="tanochkaUrl">
      <img class="tanochka" alt="tanochka"
           :src="tanochkaUrl">
    </div>
    <div class="bottom-info">
      <el-button class="murr-button__danger"
                 @click="logout">
        Выйти
      </el-button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      tanochkaUrl: null,
    }),
    async created() {
      this.tanochkaUrl = await this.$store.dispatch('fetchTanochka')
    },
    methods: {
      ...mapActions({
        notification: 'popUpMessage'
      }),
      async logout() {
        this.notification({
          message: 'Ты разлогинился 😱',
          type: 'success',
        })

        await this.$store.dispatch('logout')
        await this.$router.push('/')
      },
    },
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
