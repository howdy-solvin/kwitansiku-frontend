<script setup>
import SidebarLayout from './layouts/SidebarLayout.vue';
import IconKwitansi from './icons/IconKwitansi.vue';
</script>
<template>
    <SidebarLayout>
        <template #logo>
            <IconKwitansi></IconKwitansi>
        </template>
        <template #navside>
            <router-link to="/dashboard"
                class="bg-[#0075FF] py-[10px] px-[15px] rounded-md text-white">Dashboard</router-link>
            <button class="bg-[#0075FF] py-[10px] px-[15px] rounded-md text-white flex justify-start items-center">Jenis
                Kwitansi</button>
            <div class="flex flex-col">
                <router-link to="/pasien-tki" class="bg-[#0075FF] py-[10px] px-[15px] rounded-t-md text-white ">Pasien
                    TKI</router-link>
                <hr class=" w-full bg-black">
                <router-link to="/pasien-umum" class="bg-[#0075FF] py-[10px] px-[15px] rounded-b-md text-white ">Pasien
                    Umum</router-link>
            </div>
            <router-link to="/rekap-kwitansi" class="bg-[#0075FF] py-[10px] px-[15px] rounded-md text-white ">Rekap
                Kwitansi</router-link>
        </template>
    </SidebarLayout>
</template>