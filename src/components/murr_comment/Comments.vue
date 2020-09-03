<template>
  <div class="murr-comment">
    <loader v-if="isLoading" />

    <template v-else>
      <comment-form v-if="token" @submitComment="handlerSubmit" />

      <ul v-if="comments.length" class="murr-comment__list">
        <comment-item v-for="item in comments" :key="item.id" :item="item" />
      </ul>

      <observer v-if="comments.length" @murrIntersect="fetchNextComments" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Observer from "../../components/common/Observer.vue";
import * as type from "./store/type.js";

import CommentItem from "./comment-item.vue";
import CommentForm from "./comment-form.vue";

import "./scss/comments.scss";

export default {
  name: "Comment",
  data: () => ({
    murrId: null,
    isLoading: true,
    page: 1,
    nextPage: null,
  }),
  async mounted() {
    this.murrId = this.$route.params.id;

    const data = await this.$store.dispatch(type.ACTIONS_FETCH_COMMENTS, {
      murrId: this.murrId,
    });
    this.nextPage = data.next;

    this.isLoading = false;
  },
  computed: {
    ...mapGetters({
      comments: "filterComments",
      token: "accessToken_getters",
    }),
  },
  methods: {
    async fetchNextComments() {
      if (!this.nextPage) {
        return;
      }

      try {
        const nextNumberPage = ++this.page;

        const data = await this.$store.dispatch(
          type.ACTIONS_FETCH_NEXT_PAGE_COMMENTS,
          {
            murrId: this.murrId,
            page: nextNumberPage,
          }
        );

        this.nextPage = data.next;
      } catch (error) {
        this.nextPage = null;
      }
    },
    async handlerSubmit({ recaptchaToken, text, resetForm }) {
      await this.$store.dispatch(type.ACTIONS_ADD_COMMENT, {
        text,
        recaptchaToken,
        murrId: this.murrId,
      });

      resetForm();
    },
  },
  components: {
    CommentItem,
    CommentForm,
    Observer,
  },
};
</script>
