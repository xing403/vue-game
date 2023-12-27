<script setup lang="ts">
import { dayjs } from 'element-plus'

type STATUS_TYPE = 'start' | 'stop' | '' | 'reset'
const props = defineProps<{
  start: STATUS_TYPE
  format?: string
}>()

const emits = defineEmits(['update:time'])
const timer = ref()
const pause_time = ref(0)
const start = toRef(props.start)
const current_time = ref(useLocalStorage('qwerty_play_time', 0))
const time = computed(() => current_time.value - pause_time.value)
const format = computed(() => dayjs(time.value).add(-8, 'h').format(props.format ?? 'HH:mm:ss.SSS'))

function startTime() {
  timer.value = setInterval(() => {
    if (!start.value)
      pause_time.value++
    current_time.value++
    emits('update:time', format)
  }, 1)
}
function pauseTime() {
  clearInterval(timer.value)
}
function resetTime() {
  pauseTime()
  current_time.value = 0
  pause_time.value = 0
}

watch(() => props.start, (value) => {
  start.value = value
  switch (value) {
    case 'start':
      startTime()
      break
    case 'reset':
      resetTime()
      break
    case 'stop':
      pauseTime()
      break
  }
})
</script>

<template>
  <slot :data="{ time, format }" />
</template>
