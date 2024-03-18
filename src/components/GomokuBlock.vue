<script setup lang="ts">
defineProps<{ block: GomokuBlockState }>()
</script>

<template>
  <button
    class="lattice" :class="{
      bl: block.x === 0,
      bt: block.y === 0,
      br: block.x === 14,
      bb: block.y === 14,
    }"
  >
    <div v-if="block.used" z-10 i-mdi-checkbox-blank-circle :style="{ color: block.user }" />
    <div v-else class="empty" i-mdi-checkbox-blank-circle z-10 />
  </button>
</template>

<style lang="postcss">
.lattice {
  @apply relative divide-double overflow-hidden;

  &.bl {
    @apply border-l-5;
  }

  &.br {
    @apply border-r-5;
  }

  &.bt {
    @apply border-t-5;
  }

  &.bb {
    @apply border-b-5;
  }

  &::before {
    content: '';
    position: absolute;
    top: calc(-1 * var(--border-width));
    @apply border-l-1 h-10 bg-gray-600;
  }

  &::after {
    content: '';
    position: absolute;
    left: calc(-1 * var(--border-width));
    @apply border-t-1 w-10 bg-gray-600;
  }

  &:hover .empty {
    @apply block;
  }

  .empty {
    @apply hidden text-gray-200;
  }
}
</style>
