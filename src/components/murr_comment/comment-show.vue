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

    <div
      v-if="isCompactBody"
      :class="{ compact: isHiddenOriginalBody }"
      class="murr-comment__body murr-comment__body--toggle"
      ref="text-body"
    >
      <div v-html="compiledMarkdown"></div>
      <div
        class="murr-comment__body--toggle-action"
        @click="hednalerToggleCompact"
      ></div>
    </div>
    <div v-else class="murr-comment__body" v-html="compiledMarkdown"></div>

    <div class="murr-comment__actions">
      <el-button
        type="text"
        size="mini"
        icon="el-icon-caret-top"
        class="murr-comment__actions-item increment"
        @click="onLikeComment"
      />
      <el-button
        type="text"
        size="mini"
        class="murr-comment__actions-item counter"
        >{{ comment.rating }}</el-button
      >
      <el-button
        type="text"
        size="mini"
        icon="el-icon-caret-bottom"
        class="murr-comment__actions-item decrement"
        @click="onUnlikeComment"
      />

      <el-button
        v-if="isMurrenAuthorized"
        type="text"
        size="mini"
        icon="el-icon-s-comment"
        class="murr-comment__actions-item reply"
        @click="onToggleReplyCommentForm"
        >{{ !isShowReply ? "Ответить" : "Скрыть" }}</el-button
      >
    </div>

    <div
      class="murr-comment__children-line-vertical"
      @click="onToggleTreeComment"
    ></div>

    <comment-form
      v-if="isShowReply && isMurrenAuthorized"
      :focus-after-show="true"
      :hide-button="false"
      @onSubmitComment="onSubmitComment"
    />

    <slot name="children"></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import sanitizeHtml from "sanitize-html";
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
    onToggleTreeComment: {
      required: true,
      type: Function,
    },
  },
  data: () => ({
    isShowReply: false,
    isRatingInProcess: false,
    isHiddenOriginalBody: true,
  }),
  mounted() {
    // Subscribe to the event closing all forms
    eventEmitter.$on("commentHideForms", (comment) => {
      if (this.isShowReply && comment.id !== this.comment.id) {
        this.isShowReply = false;
      }
    });
    // Stup markdawn
    marked.setOptions({
      breaks: true,
    });
  },
  methods: {
    onToggleReplyCommentForm() {
      this.isShowReply = !this.isShowReply;
      // Send an event to all forms so that they close if open
      eventEmitter.$emit("commentHideForms", this.comment);
    },
    onToggleCompact() {
      this.isHiddenOriginalBody = !this.isHiddenOriginalBody;
    },
    async onSubmitComment({ resetForm, text, recaptchaToken }) {
      const newComment = await this.$store.dispatch(
        type.ACTIONS_REPLY_COMMENT,
        {
          text,
          recaptchaToken,
          murrId: this.$route.params.id,
          parent: this.item.id,
        }
      );

      // Append comment to tree children
      if (newComment) {
        this.comment.children = [newComment, ...this.comment.children];
        this.isShowReply = false;
        resetForm();
      }
    },
    onLikeComment() {
      if (!this.isMurrenAuthorized) {
        this.$store.dispatch("popUpMessage", {
          message: "Требуется авторизация 😳",
          customClass: "element-ui-message__warning",
          type: "warning",
        });
        return;
      }

      if (this.isRatingInProcess) return;

      this.isRatingInProcess = true;

      this.$store
        .dispatch(type.ACTIONS_LIKE, {
          commentId: this.item.id,
        })
        .then((data) => {
          this.isRatingInProcess = false;

          if (!data) return;

          this.comment.rating = data.rating;
        });
    },
    onUnlikeComment() {
      if (!this.isMurrenAuthorized) {
        this.$store.dispatch("popUpMessage", {
          message: "Требуется авторизация 😳",
          customClass: "element-ui-message__warning",
          type: "warning",
        });
        return;
      }

      if (this.isRatingInProcess) return;

      this.isRatingInProcess = true;

      this.$store
        .dispatch(type.ACTIONS_UNLIKE, {
          commentId: this.comment.id,
        })
        .then((data) => {
          this.isRatingInProcess = false;

          if (!data) return;

          this.comment.rating = data.rating;
        });
    },
  },
  computed: {
    ...mapGetters({
      token: "accessToken_getters",
    }),
    comment() {
      return this.item;
    },
    isCompactBody() {
      return this.comment.text.length > 200;
    },
    compiledMarkdown() {
      return sanitizeHtml(marked(this.comment.text));
    },
    isMurrenAuthorized() {
      return this.token && this.token !== "";
    },
  },
  components: {
    CommentForm,
  },
};
</script>
