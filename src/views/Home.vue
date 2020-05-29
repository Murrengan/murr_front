<template>
  <div class="home-main-container">

    <h1 class="mb">Делаем сайт вместе!</h1>

    <loader v-if="loading"/>

    <div class="container"
         v-if="!loading">

      <masonry :cols="{default: 4, 1450: 3, 1100: 2, 700: 1}"
               :gutter="{default: '30px', 700: '15px'}">

        <div v-for="(murr, index) in this.murrCards"
             :key="index"
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
  import { mapActions } from 'vuex'
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      loading: true,
      showSignUpMurrens: [],
      nextPageNumber: 1,
      nextPageExists: null,
      murrCover: '',
      murrTitle: '',
    }),
    async mounted() {
      if (!this.murrCards.length) {
        await this.fetchMurrCards()
      }
      this.loading = false
    },
    computed: {
      ...mapGetters([
        'murrCards',
        'nextMurrCardsPage_getters'
      ])
    },
    methods: {
      ...mapActions([
        'fetchMurrCards'
      ]),
      async fetchMurrCardsOnIntersected() {
        if (this.nextMurrCardsPage_getters) {
          await this.fetchMurrCards(this.nextMurrCardsPage_getters)
        }
      },
      openMurr(murr_id) {
        this.$router.push({ path: `/murr_card/?murr_id=${murr_id}` })
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

</style>
