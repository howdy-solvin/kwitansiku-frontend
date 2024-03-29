<script setup>
import SideBar from "../SideBar.vue";
</script>
<template>
  <div class="flex h-screen">
    <!-- ANCHOR - Sidebar -->
    <aside class="h-full w-[350px] p-6">
      <div class="bg-[#B8E1FF] rounded-xl p-4 flex justify-center h-full font-poppins">
        <SideBar></SideBar>
      </div>
    </aside>

    <!-- ANCHOR - Main Content -->
    <main class="w-full p-6 font-poppins">
      <router-view></router-view>
    </main>
  </div>
</template>
