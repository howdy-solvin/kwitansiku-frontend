<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const goToLogin = () => {
  router.push({ name: "Login", })
}
const goToDaftar = () => {
  router.push({ name: "Register", })
}

</script>

<template>
  <main class="flex flex-col justify-center h-screen items-center rounded-xl">
    <section class="header font-poppins rounded-xl">
      <div class="p-20 shadow-[inset_0_0_20px_2px_rgba(0,0,0,0.1)] rounded-xl">
        <div>
          <h1 class="text-4xl font-semibold">Selamat Datang</h1>
          <p class="mt-1">Saat ini <span class="text-[#0075FF] font-semibold">Kwitansi-KU</span> sedang dalam tahap
            pengembangan
          </p>
        </div>
        <div class="w-full mt-4">
          <p>Mulai Sekarang !!</p>
          <div class="flex justify-between gap-x-5 mt-14">
            <button @click="goToLogin()" class="px-14 py-2 rounded-md bg-[#0075FF] text-white ">Masuk</button>
            <button @click="goToDaftar()" class="px-14 py-2 rounded-md bg-black text-white ">Daftar</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.header {
  box-shadow: 0px 10px 50px 0px rgba(0, 117, 255, 0.1);
}
</style>