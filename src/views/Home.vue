<template>
  <div class="home-main-container">
    <h3 class="mb">
      Мурренган - это сообщество разработчиков, которые
      собираются вместе, для помощи друг другу. Индустрия программного
      обеспечения опирается на сотрудничество и взаимообучение. Мы предоставляем
      место для реализации этого.
    </h3>

    <loader v-if="loading" />

    <div class="container" v-if="!loading">
      <masonry
        :cols="{
          default: this.murrCards.length > 4 ? 4 : this.murrCards.length,
          1450: this.murrCards.length > 3 ? 3 : this.murrCards.length,
          1100: this.murrCards.length > 2 ? 2 : this.murrCards.length,
          700: 1,
        }"
        :gutter="{ default: '30px' }"
      >
        <div
          v-for="(murr, index) in this.murrCards"
          :key="index"
          class="murr-card mb2 pointer"
          @click="openMurr(murr.id)"
        >
          <img v-if="murr.cover" :src="murr.cover" class="murr-cover" />

          <p class="murr-card__description">{{ murr.title }}</p>
        </div>

        <Observer @murrIntersect="fetchMurrCardsOnIntersected" />
      </masonry>
    </div>
  </div>
</template>

<script>
import Observer from "@/components/common/Observer";
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    loading: true,
    showSignUpMurrens: [],
    nextPageNumber: 1,
    nextPageExists: null,
    murrCover: "",
    murrTitle: "",
  }),
  async mounted() {
    if (!this.murrCards.length) {
      await this.fetchMurrCards();
    }
    this.loading = false;
  },
  computed: {
    ...mapGetters(["murrCards", "nextMurrCardsPage_getters"]),
  },
  methods: {
    ...mapActions(["fetchMurrCards"]),
    async fetchMurrCardsOnIntersected() {
      if (this.nextMurrCardsPage_getters) {
        await this.fetchMurrCards(this.nextMurrCardsPage_getters);
      }
    },
    openMurr(murr_id) {
      this.$router.push({ path: `/murr_card/?murr_id=${murr_id}` });
    },
  },
  components: {
    Observer,
  },
};
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
