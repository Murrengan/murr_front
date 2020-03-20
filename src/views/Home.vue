<template>
  <div class="home-main-container">

    <h2 class="mb">Сайт Мурренган — опенсорс</h2>

    <p class="mb">Хочешь получить опыт программирования и веб-разработки?</p>

    <h1 class="mb">Присоединяйся!</h1>

    <div class="mb">
      <p class="mb">Уже присоединились:</p>

      <loader v-if="loading"/>

      <transition name="fade" mode="out-in">
        <div class="murrens-list" v-if="!loading">
          <ul>
            <li v-for="murren in this.showSignUpMurrens"
                :key="murren.id"
                class="mb"
            >
              {{ murren.id }}. {{ murren.username }}
            </li>
          </ul>

          <Observer @murrIntersect="fetchMurrenOnIntersected"/>
        </div>
      </transition>

    </div>

    <p>И пиши в телегу - <a class="link mb" href="https://tlgg.ru/MurrenganChat">Телеграм</a></p>

  </div>
</template>

<script>
  import Observer from "@/components/common/Observer"

  export default {
    data: () => ({
      loading: true,
      showSignUpMurrens: [],
      nextPageNumber: 1,
      nextPageExists: null,
    }),
    async mounted() {
      await this.fetchMurren()
      this.loading = false
    },
    methods: {
      async fetchMurren(nextPageNumber = null) {
        const {next, results} = await this.$store.dispatch('fetchMurrens', nextPageNumber)

        this.showSignUpMurrens = [...this.showSignUpMurrens, ...results]
        this.nextPageExists = next
      },
      async fetchMurrenOnIntersected() {
        if (this.nextPageExists) {
          await this.fetchMurren(this.nextPageNumber)
        }
      }
    },
    watch: {
      nextPageExists(exists) {
        if (exists) {
          this.nextPageNumber++;
        }
      }
    },
    components: {
      Observer
    }
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