<template>
  <div class="home-main-container">

    <h1 class="mb">may the force be with you</h1>

    <loader v-if="loading"/>

    <div class="container"
         v-if="!loading">

      <masonry :cols="{default: 4, 1300: 3, 1000: 2, 700: 1}"
               :gutter="{default: '30px', 700: '15px'}">

        <div v-for="murr in this.showMurrCards"
             :key="murr.id"
             class="murr-card mb2 pointer"
             @click="openMurr(murr.id)">

          <img v-if="murr.cover"
               :src="murr.cover"
               class="murr-cover">

          <p class="murr-card__description"> {{ murr.title }} </p>
        </div>

        <Observer @murrIntersect="fetchMurrCardsOnIntersected"/>

      </masonry>
    </div>
  </div>
</template>

<script>
  import Observer from "@/components/common/Observer"

  export default {
    data: () => ({
      loading: true,
      showSignUpMurrens: [],
      showMurrCards: [],
      nextPageNumber: 1,
      nextPageExists: null,
      murrCover: '',
      murrTitle: '',
      murrCards: ''
    }),
    async mounted() {

      await this.fetchMurrCard()
      this.loading = false
    },
    methods: {

      async fetchMurrCardsOnIntersected() {

        if (this.nextPageExists) {
          await this.fetchMurrCard(this.nextPageNumber)
        }
      },
      async fetchMurrCard(nextPageNumber = null) {

        const {next, results} = await this.$store.dispatch('fetchMurrCards_actions', nextPageNumber)
        this.showMurrCards = [...this.showMurrCards, ...results]
        this.nextPageExists = next
      },

      openMurr(murr_id) {
        this.$router.push({path: `/murr_card/?murr_id=${murr_id}`})
      }

    },
    watch: {
      nextPageExists(exists) {
        if (exists) {
          this.nextPageNumber++
        }
      }
    },
    components: {
      Observer
    }
  }
</script>

<style scoped>

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }

  .murr-cover {
    width: 100%;
  }

  .home-main-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 15px;
    background-color: #1a2931;
  }

</style>
