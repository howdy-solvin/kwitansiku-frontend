<script setup>
import SidebarLayout from './layouts/SidebarLayout.vue'
import GoraIcon from './icons/GoraIcon.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const statusRekap = computed(() => store.getters['getRekapStatus'])

const toggleDropdown = ref(false)
</script>

<template>
  <SidebarLayout>
    <template #logo>
      <div><GoraIcon></GoraIcon></div>
    </template>
    <template #navside>
      <router-link
        to="/dashboard"
        @click.native="toggleDropdown = false"
        class="py-[10px] px-[15px] w-full rounded-md text-[#676767] hover:text-white hover:bg-[#54A3FF] transition-colors"
        >Dashboard</router-link
      >
      <button
        @click="toggleDropdown = !toggleDropdown"
        class="toogle-dropdown group py-[10px] px-[15px] rounded-md flex justify-between items-center transition-all"
        :class="
          toggleDropdown
            ? 'bg-[#0075FF] shadow-[1px_5px_15px_#0075FF50] text-white font-bold'
            : 'text-[#676767] hover:text-white hover:bg-[#54A3FF]'
        "
      >
        Jenis Kwitansi
        <svg
          class="-mr-1 h-5 w-5 transition-colors"
          :class="
            toggleDropdown ? 'bg-[#0075FF] text-white ' : 'text-[#676767] group-hover:text-white'
          "
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <div
        :class="[{ 'bg-[#0075FF] h-full': toggleDropdown, 'h-0 overflow-hidden': !toggleDropdown }]"
        class="flex flex-col rounded-md transition-all duration-300 ease-out"
      >
        <router-link to="/pasien-tki" class="py-[10px] text-white px-[15px] rounded-t-md"
          >Pasien TKI</router-link
        >
        <hr class="w-full bg-black h-[1px]" />
        <router-link to="/pasien-umum" class="py-[10px] text-white px-[15px] rounded-b-md"
          >Pasien Umum</router-link
        >
      </div>
      <router-link
        to="/rekap-kwitansi"
        @click.native="toggleDropdown = false"
        class="py-[10px] text-[#676767] px-[15px] rounded-md hover:text-white hover:bg-[#54A3FF] transition-colors"
        :class="{
          'bg-[#0075FF] text-white shadow-[1px_5px_15px_#0075FF50] font-bold': statusRekap
        }"
        >Rekap Kwitansi</router-link
      >
    </template>
  </SidebarLayout>
</template>

<style scoped>
.router-link-exact-active {
  background-color: #0075ff;
  color: white;
  box-shadow: 1px 5px 15px rgba(0, 117, 255, 0.5);
  font-weight: bold;
}
</style>
