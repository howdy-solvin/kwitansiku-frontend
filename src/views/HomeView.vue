<script setup>
import ProfileInfo from '@/components/ProfileInfo.vue';
</script>
<template>

    <header class="w-full py-6">
        <div class="flex justify-between w-full font-poppins items-center">
            <h1 class="text-xl">Hallo..</h1>
            <ProfileInfo></ProfileInfo>
        </div>
    </header>

    <main>
        <h1 class="font-semibold text-[35px]">Selamat Datang</h1>
        <p class="mt-1">Saat ini <span class="text-[#0075FF] font-semibold">Kwitansi-KU</span> sedang dalam tahap
            pengembangan
        </p>
        <p class="mt-[28px] font-bold">Buat kwitansi mu Sekarang !!</p>
    </main>
</template>
