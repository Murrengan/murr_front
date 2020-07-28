<template>
  <div class="loader"></div>
</template>

<script>
export default {
  name: "loader",
};
</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 68px;
  height: 68px;
  margin: 0 auto;
}

.loader:after {
  content: " ";
  display: block;
  width: 42px;
  height: 42px;
  margin: 8px;
  border-radius: 50%;
  border-width: 4px;
  border-style: solid;
  border-color: #ad00ff transparent #ad00ff transparent;
  animation: loader 0.8s linear infinite;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
