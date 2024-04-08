<script setup>
import { computed, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useStore } from 'vuex'

const toastStore = useStore()

const options = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: true,
  closeOnClick: true,
  closeButton: true,
  isLoading: false
}

const showToast = computed(() => {
  const { message, type, loading } = toastStore.getters['getAlertData']
  options.isLoading = loading
  if (message && type) {
    switch (type) {
      case 'error':
        toast.error(message, options)
        break
      case 'info':
        toast.info(message, options)
        break
      case 'warning':
        toast.warning(message, options)
        break
      default:
        toast.success(message, options)
    }
    return true
  }
  return true
})

watch(
  () => toastStore.getters['getAlertData'].date,
  (newDate, oldDate) => {
    setTimeout(() => {
      showToast.value
    }, 100)
  }
)
</script>

<template></template>
