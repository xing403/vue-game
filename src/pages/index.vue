<!-- eslint-disable no-console -->
<script setup lang="ts" generic="T extends any, O extends any">
import { useRouter } from 'vue-router'

const router = useRouter()
function goto(url: string) {
  router.push(url)
}
</script>

<template>
  <div pt5 flex="~ gap-1" justify="center">
    <button btn @click="goto('/mines-weeper')">
      扫雷
    </button>
  </div>
</template>
