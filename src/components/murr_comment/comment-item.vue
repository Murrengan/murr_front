<template>
  <li class="murr-comment__item">
    <comment-show
      v-show="!isHidden"
      :item="item"
      :onToggleTreeComment="onToggleTreeComment"
    >
      <template v-if="item.children.length" v-slot:children>
        <ul class="murr-comment__list murr-comment__list--children">
          <comment-item
            v-for="children in item.children"
            :key="children.id"
            :item="children"
          />
        </ul>
      </template>
    </comment-show>

    <comment-hide
      v-show="isHidden"
      :item="item"
      :onToggleTreeComment="onToggleTreeComment"
    />
  </li>
</template>

<script>
import CommentShow from "./comment-show.vue";
import CommentHide from "./comment-hide.vue";

export default {
  name: "CommentItem",
  props: {
    item: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    isHidden: false,
  }),
  methods: {
    onToggleTreeComment() {
      this.isHidden = !this.isHidden;
    },
  },
  components: {
    CommentShow,
    CommentHide,
  },
};
</script>
