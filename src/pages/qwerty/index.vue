<route lang="yaml">
meta:
  title: Qwerty Learn
</route>

<script setup lang="ts">
import dict from './dict'

type GAME_STATUS = 'error' | '' | 'running' | 'pause' | 'reset'

const currentIndex = ref(useLocalStorage('word-index', 0))
const accuracy = ref(useLocalStorage('qwerty-accuracy', { t: 0, a: 0 }))
const word = computed(() => dict.words[currentIndex.value])
const input = ref<string[]>([])
const status = ref<GAME_STATUS[]>([])
const play = ref<GAME_STATUS>('pause')
const start = computed(() => play.value === 'running' ? 'start' : play.value === 'pause' ? 'stop' : 'reset')
const chronograph = ref()
function onKeyBoardDown(event: KeyboardEvent) {
  event.preventDefault()
  const key = event.key.toLowerCase()
  if (key === ' ') {
    play.value = play.value === 'running' ? 'pause' : 'running'
    return
  }

  if (key.length !== 1 || !/^[a-z]{1}/.test(key) || !status.value.every((item: GAME_STATUS) => item === ''))
    return

  input.value.push(key)

  accuracy.value.a += 1

  if (word.value.name.startsWith(input.value.join(''))) {
    status.value.push('')
    accuracy.value.t += 1
  }
  else { status.value.push('error') }

  if (status.value.every((item: GAME_STATUS) => item === '')) {
    if (status.value.length === word.value.name.length) {
      input.value.length = 0
      status.value.length = 0
      currentIndex.value = Math.floor(Math.random() * dict.words.length)
    }
    return
  }
  setTimeout(() => {
    input.value.length = 0
    status.value.length = 0
  }, 300)
}
function checkLetterStatus(index: number) {
  if (index >= status.value.length)
    return ''
  else if (status.value[index] === 'error')
    return 'error'
  else
    return 'success'
}
function reset() {
  play.value = 'reset'
  currentIndex.value = 0
}
onMounted(() => {
  window.addEventListener('keyup', onKeyBoardDown)
})

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyBoardDown)
})
</script>

<template>
  <div class="qwerty">
    <div v-if="play === 'running'" class="word" :class="{ hasError: status.find(item => item === 'error') }">
      <div class="letter">
        <span v-for="w, index in word.name.split('')" :key="index" :class="[checkLetterStatus(index)]" v-text="w" />
      </div>
      <div class="mean-word" pt-10>
        <div v-for="mean in word.trans" :key="mean" class="mean-word-item">
          {{ mean }}
        </div>
      </div>
    </div>
    <div v-else class="pause" v-text="'按 space 开始/继续游戏'" />

    <Chronograph ref="chronograph" v-model:start="start" pt-5>
      <template #default="scope">
        <div v-text="scope.data.format" />
      </template>
    </Chronograph>
    <Footer>
      <template #extend>
        <button icon-btn i-mdi-refresh @click="reset" />
        <span v-text="`正确率: ${(Math.max(accuracy.t, 1) / Math.max(accuracy.a, 1) * 100).toFixed(2)}%`" />
      </template>
    </Footer>
  </div>
</template>

<style lang="postcss" scoped>
.qwerty {
  @apply flex flex-col items-center justify-center w-full h-full select-none;

  .pause {
    @apply animate-paused border-rd-20px text-3em font-bold p-t-40;
  }

  .word {
    .letter {
      @apply flex flex-row justify-center gap-1 text-3em font-bold p-t-40;

      span {
        @apply bg-gray-200 text-gray-700 border-rd-20px w-1.5em h-1.5em text-2em font-bold;

        &.success {
          @apply text-green-500;
        }

        &.error {

          @apply text-red-500;
        }
      }
    }

    &.hasError {
      @apply animate-shake-x animate-count-1 animate-duration-300ms;
    }
  }
}
</style>
