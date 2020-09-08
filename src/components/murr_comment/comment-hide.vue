<template>
  <div>
    <div class="murr-comment__hidden" @click="onToggleTreeComment">
      <div class="murr-comment__panel">
        <div class="murr-comment__author-name">
          <el-icon class="murr-comment__hidden-icon" name="plus" />
          {{ item.author_username }}
        </div>
        <div class="murr-comment__date">
          · муррчит {{ item.created | dateFormatHumanDiff }}
        </div>
      </div>
    </div>

    <div
      class="murr-comment__children-line-vertical"
      @click="onToggleTreeComment"
    ></div>
  </div>
</template>

<script>
export default {
  name: "CommentHide",
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
};
</script>
