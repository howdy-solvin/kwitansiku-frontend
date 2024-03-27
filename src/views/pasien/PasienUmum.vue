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
        <h1 class="font-semibold text-[35px]">Sedang Dalam Pengembangan</h1>
        <p class="mt-1">Ups... fitur jenis kwitansi <span class="text-[#0075FF] font-semibold">Pasien Umum</span> sedang
            dalam tahap pengembangan
        </p>
        <p class="mt-[28px] font-bold">Harap bersabar ya !!</p>
    </main>
</template>