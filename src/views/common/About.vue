<template>
  <div class="about">

    <h2 class="mb2">Мурренган - это опенсорс сайт, цель которого найти единомышленников
      <a target="_blank"
         rel="noopener noreferrer"
         class="link"
         href="https://ru.wikipedia.org/wiki/%D0%94%D0%BE%D0%B4%D0%B7%D0%B8%D0%BD">Додзин</a>,
      для достижения цели.</h2>

        <div>
      <img src="@/assets/img/logo_pink.png" alt="circle_logo" class="murrengan-logo mb">
    </div>

    <div class="deep-about fs mb">

      <p class="text-center mb"><strong>Возможные цели:</strong></p>

      <ul class="mb">
        <li class="mb-half">- Создание команды для онлайн игр и игр в реале</li>
        <li class="mb-half">- Поиск партнеров в обучении и занятии спортом</li>
        <li class="mb-half">- Формирование команды для совместной разработки приложений (web, mobile и игры)</li>
        <li class="mb-half">- Спасение от одиночества</li>
      </ul>

      <p class="text-center mb"><strong>Правило:</strong></p>

      <ul class="mb">
        <li class="mb-half">- Не делайт другим то, что не желаешь для себя, и поступай
          с другими так, как хочешь, чтобы поступили с тобой
        </li>
      </ul>

      <p class="text-center mb"><strong>Контакты:</strong></p>

      <div class="social">
        <a target="_blank"
           rel="noopener noreferrer"
           class="link mb hide-a-decoration"
           href="https://tlgg.ru/MurrenganChat">
          Телеграм</a>
        <a target="_blank"
           rel="noopener noreferrer"
           class="link  hide-a-decoration"
           href="https://www.youtube.com/murrengan">
          Ютюб</a>
        <a target="_blank"
           rel="noopener noreferrer"
           class="link mb hide-a-decoration"
           href="https://discord.gg/gHFtAT3">
          Дискорд</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "About"
  }
</script>

<style scoped>
  .social {
    display: flex;
    justify-content: space-around;
  }

  .about {
    max-width: 750px;
    margin: 0 auto;
  }

  .deep-about {
    text-align: left;
    padding: 0 10px;
  }
</style>