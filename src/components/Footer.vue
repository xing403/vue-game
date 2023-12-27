<script setup lang="ts">
const router = useRouter()
function goBack() {
  router.go(-1)
}
</script>

<template>
  <nav mt-6 inline-flex gap-2 text-xl>
    <button icon-btn i-mdi-arrow-left @click="goBack" />
    <slot name="extend" />
  </nav>
</template>
