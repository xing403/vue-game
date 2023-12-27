<route lang="yaml">
meta:
  title: 游戏
</route>

<script setup lang="ts">
const router = useRouter()
const gameMap = ref([{
  key: 1,
  name: '扫雷',
  url: '/mines',
  icon: 'i-mdi-mine',
}, {
  key: 2,
  name: '五子棋',
  url: '/gomoku',
  icon: 'i-mdi-transition-masked',
}, {
  key: 2,
  name: 'Qwerty',
  url: '/qwerty',
  icon: 'i-mdi-format-text-variant',
}])
function handleGoGame(url: string) {
  router.push(url)
}
</script>

<template>
  <div class="game-list" flex="~ row gap-1">
    <div
      v-for="item in gameMap" :key="item.key" v-data="item.url" class="game-list-item"
      @click="handleGoGame(item.url)"
    >
      <div class="game-icon" :class="[item.icon]" h-10 w-10 />
      <div class="game-name" mt-1 v-text="item.name" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.game-list-item{
  @apply m-2 cursor-pointer w-5em h-5em text-center flex flex-col items-center justify-center
  &:hover{
    @apply text-hex-409eff;
  }
}
</style>
