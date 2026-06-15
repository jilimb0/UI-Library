<template>
  <button
    ref="btnRef"
    v-bind="attrs"
    :class="className"
    @click="handlers.onClick"
    @keydown="handlers.onKeyDown"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { createButtonBehavior } from '@ui-construction-library/behaviors';
import type { ButtonSize, ButtonVariant } from '@ui-construction-library/behaviors';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e?: Event) => void;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false,
});

const btnRef = ref<HTMLButtonElement | null>(null);

const behavior = computed(() =>
  createButtonBehavior({
    variant: props.variant,
    size: props.size,
    disabled: props.disabled,
    loading: props.loading,
    onClick: props.onClick,
  })
);

const attrs = computed(() => behavior.value.attrs);
const className = computed(() => behavior.value.className);
const handlers = computed(() => behavior.value.handlers);
</script>
