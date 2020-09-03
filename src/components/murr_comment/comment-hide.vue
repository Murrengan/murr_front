<template>
  <div>
    <div class="murr-comment__hidden" @click="() => handlerToggleTree(item)">
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
      @click="() => handlerToggleTree(item)"
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
    handlerToggleTree: {
      required: true,
      type: Function,
    },
  },
};
</script>
