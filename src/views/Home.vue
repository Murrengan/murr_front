<template>
  <div class="home-main-container">

    <h2 class="mb">Мурренган — это группа людей,<br> объединенная для достижения цели.</h2>

    <p class="mb">Это опенсор сайт. Хочешь получить опыт разработки?</p>

    <h1 class="mb">Присоединяйся!</h1>

    <div>
      <p class="mb">Уже присоединились:</p>

      <loader v-if="loading" />

      <transition name="fade" mode="out-in">
        <div class="murrens-list" v-if="!loading">
          <ul>
            <li v-for="murren in this.signUpMurrens"
                :key="murren.id"
                class="mb"
            >
              {{ murren.id }}. {{ murren.username }}
            </li>
          </ul>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
        loading: true,
        signUpMurrens: []
    }),
    async mounted() {
      const result = await this.$store.dispatch('fetchMurrens')
      this.signUpMurrens = result ? result.reverse() : []
      this.loading = false
    },
  }
</script>

<style scoped>
  .murrens-list {
    width: 300px;
    max-height: 40vh;
    overflow: auto;
    border: #AD00FF 1px solid;
    border-radius: 5px;
    padding-top: 1rem;
  }

  .home-main-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 15px 5px;
    background-color: #1a2931;
  }
</style>