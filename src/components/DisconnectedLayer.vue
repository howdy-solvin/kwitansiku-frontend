<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
export default {
  setup() {
    const isOnline = ref(navigator.onLine)

    const checkIsOnline = () => {
      isOnline.value = navigator.onLine
    }

    onMounted(() => {
      window.addEventListener('online', () => {
        isOnline.value = true
      })
      window.addEventListener('offline', () => {
        isOnline.value = false
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('online', () => {
        isOnline.value = true
      })
      window.removeEventListener('offline', () => {
        isOnline.value = false
      })
    })

    return { isOnline, checkIsOnline }
  }
}
</script>

<template>
  <div
    v-if="!isOnline"
    class="w-screen h-screen fixed flex items-center justify-center overflow-hidden bg-black/60 z-[1000]"
  >
    <div class="md:w-[25%] rounded-3xl w-[90%] h-fit bg-white px-4 py-3">
      <img src="/bad-connection.svg" class="w-full h-fit" alt="asd" />
      <p class="text-center text-xl font-medium">Waduh,</p>
      <p class="text-center mb-2 text-xl font-medium">Jaringan anda terputus!</p>
      <p class="text-center mb-5 text-base font-normal leading-5">
        Anda tidak bisa menggunakan aplikasi ketika tidak ada koneksi internet.
      </p>
      <button :on-click="checkIsOnline()" class="flex my-3 group items-center active:bg-blue-700 justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 transition-colors gap-3 mx-auto text-white rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4 group-hover:animate-spin"
        >
          <path
            fill-rule="evenodd"
            d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
            clip-rule="evenodd"
          />
        </svg>

        <p>Check status: <span v-if="isOnline" class="text-green-600 bg-white rounded-md px-1">Online</span> <span v-else class="text-red-600 bg-white rounded-md px-1">Offline</span></p>
      </button>
    </div>
  </div>
</template>
