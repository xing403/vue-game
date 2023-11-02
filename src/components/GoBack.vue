<script setup lang="ts">
const router = useRouter()
function goBack() {
  router.go(-1)
}
</script>

<template>
  <button icon-btn i-mdi-arrow-left @click="goBack" />
</template>
