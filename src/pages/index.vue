<!-- eslint-disable no-console -->
<script setup lang="ts" generic="T extends any, O extends any">
import { useRouter } from 'vue-router'

const router = useRouter()
function goto(url: string) {
  if (/\//.test(url))
    router.push(url)
}
</script>

<template>
  <div pt5 flex="~ gap-1" justify="center">
    <button btn @click="goto('/MinesWeeper')">
      扫雷
    </button>
  </div>
</template>
