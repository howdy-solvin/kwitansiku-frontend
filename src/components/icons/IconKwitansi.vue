<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const goToWelcome = () => {
    router.push({ name: "Welcome" })
}
</script>
<template>
    <button @click="goToWelcome()" class="px-5 py-2 bg-slate-400 w-fit text-white">
        Icon
    </button>
</template>