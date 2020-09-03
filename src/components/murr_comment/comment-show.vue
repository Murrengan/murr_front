<template>
  <div>
    <div class="murr-comment__panel">
      <div class="murr-comment__author">
        <div class="murr-comment__photo">
          <img
            v-if="comment.avatar"
            class="murr-comment__photo-img"
            :src="comment.avatar"
            :alt="comment.author_username"
          />
        </div>
      </div>
      <div class="murr-comment__author-name">
        {{ item.author_username }}
      </div>
      <div class="murr-comment__date">
        · муррчит {{ comment.created | dateFormatHumanDiff }}
      </div>
    </div>

    <div class="murr-comment__body">
      {{ comment.text }}
    </div>

    <div class="murr-comment__actions" v-if="token">
      <span
        class="murr-comment__reply"
        @click="() => handlerReplyComment(comment)"
      >
        <el-icon class="murr-comment__reply-icon" name="s-comment" />
        {{ !isShowReply ? "Ответить" : "Скрыть" }}
      </span>
    </div>

    <div
      class="murr-comment__children-line-vertical"
      @click="() => handlerToggleTree(comment)"
    ></div>

    <comment-form
      v-if="isShowReply && token"
      :focus-after-show="true"
      :hide-button="false"
      @submitComment="handlerSubmit"
    />

    <slot name="children"></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CommentForm from "./comment-form.vue";
import * as type from "./store/type.js";

import eventEmitter from "../../utils/EventEmitter.js";

export default {
  name: "CommentShow",
  props: {
    item: {
      required: true,
      type: Object,
    },
    handlerToggleTree: {
      required: true,
      type: Function,
    },
  },
  data: () => ({
    isShowReply: false,
    isLoading: false,
  }),
  mounted() {
    // Subscribe to the event closing all forms
    eventEmitter.$on("commentHideForms", (comment) => {
      if (this.isShowReply && comment.id !== this.comment.id) {
        this.isShowReply = false;
      }
    });
  },
  methods: {
    handlerReplyComment(comment) {
      this.isShowReply = !this.isShowReply;
      // Send an event to all forms so that they close if open
      eventEmitter.$emit("commentHideForms", comment);
    },
    async handlerSubmit({ resetForm, text, recaptchaToken }) {
      this.isLoading = true;

      const newComment = await this.$store.dispatch(
        type.ACTIONS_REPLY_COMMENT,
        {
          text,
          recaptchaToken,
          murrId: this.$route.params.id,
          parent_id: this.item.id,
        }
      );

      // Append comment to tree children
      if (newComment) {
        this.comment.children = [newComment, ...this.comment.children];
        this.isShowReply = false;
        resetForm();
      }
      this.isLoading = false;
    },
  },
  computed: {
    ...mapGetters({
      token: "accessToken_getters",
    }),
    comment() {
      return this.item;
    },
  },
  components: {
    CommentForm,
  },
};
</script>
