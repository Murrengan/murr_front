<template>
  <div class="main-create-murr-container">

    <div class="mb">
      <h1 class="murr-header fs2">{{ this.murrTitle }}</h1>
    </div>

    <div class="create-murr-area">

      <div class="editorjs-main">
        <div v-for="(i, index) in this.murr_content.blocks"
             :key="index"
             class="mb-half">

          <h2 v-if="i.type === 'header'">{{ i.data.text }}</h2>

          <p v-if="i.type === 'paragraph'"
             v-html="i.data.text"
             class="mb"></p>

          <img v-if="i.type === 'image'"
               :src="i.data.file.url"
               class="image-tool__image-picture"
               alt="">

          <p v-if="i.data.caption"
             class="cdx-input mb">{{ i.data.caption }}</p>

          <div v-if="i.type === 'delimiter'"
               class="ce-delimiter cdx-block"></div>

          <ul v-if="i.type === 'class'" class="cdx-block cdx-list cdx-list--ordered">
            <li v-for="(element, index) in  i.data.items"
                :key="index"
                class="cdx-list__item">
              {{ element }}
            </li>
          </ul>

          <pre class="murr-code-snippet mb"
               v-if="i.type === 'code'">{{ i.data.code }}</pre>

        </div>
      </div>
    </div>
  </div>

</template>

<script>

  import axios from 'axios'

  export default {

    async beforeCreate() {

      const murr_id = this.$route.query.murr_id
      const murrCardData = await axios.get('/api/murr_card/', {
        params: {
          murr_id: murr_id
        }
      });

      this.murrTitle = murrCardData.data[0].title
      this.murr_content = JSON.parse(murrCardData.data[0].content);
    },

    data: () => ({

      dataForMurr: '',
      murrTitle: '',
      murr_content: ''
    }),
  }
</script>

<style scoped>


  .murr-header {
    max-width: 620px;
    width: 100%;
    margin: 0 auto;
    font-family: JetBrainsMono-Italic, sans-serif;
    word-break: break-word;
  }

  .main-create-murr-container {
    background-color: #1a2931;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: auto;
    padding: 0 10px;
  }

  .create-murr-area {
    width: 100%;
    max-height: 90%;
    max-width: 650px;
    margin: 0 auto;
  }

  .murr-code-snippet {
    background-color: #C3A1FF;
    padding: 5px;
    font-weight: bold;
    font-size: 0.9rem;
    color: #41314e;
    white-space: pre-wrap;
    border-radius: 5px;
  }

</style>