<template>
  <div class="home-main-container">

    <h2 class="mb">Мурренган — это группа людей,<br> объединенная для достижения цели.</h2>

    <p class="mb">Это опенсор сайт. Хочешь получить опыт разработки?</p>

    <h1 class="mb">Присоединяйся!</h1>

    <div>
      <p class="mb">Уже присоединились:</p>
      <div class="murrens-list">
        <ul>
          <li v-for="murren in this.signUpMurrens"
              :key="murren.id"
              class="mb"
          >
            {{ murren.id }}. {{ murren.username }}
          </li>
        </ul>

      </div>

    </div>


  </div>
</template>

<script>

    import axios from "axios";

    export default {
        async beforeCreate() {

            const r = await axios.get('/murren/all');
            this.signUpMurrens = r.data.reverse();
        },

        data: () => ({
            signUpMurrens: ''
        }),
    }

</script>

<style scoped>

  .murrens-list {
    width: 300px;
    max-height: 40vh;
    overflow: auto;
    border: #AD00FF 1px solid;
    border-radius: 5px;
    padding-top: 1rem;
  }


  .home-main-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 15px 5px;
    background-color: #1a2931;
  }

</style>