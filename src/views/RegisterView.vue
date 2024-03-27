<script setup>
import RegisterLayout from "@/components/layouts/RegisterLayout.vue";
import IconKwitansi from "@/components/icons/IconKwitansi.vue";
import LightBulb from "@/components/icons/LightBulb.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goToLogin = () => {
    router.push({ name: 'Login' })
}
</script>
<template>
    <RegisterLayout>
        <template #icon>
            <IconKwitansi></IconKwitansi>
        </template>

        <template #register>
            <h1 class="text-[32px] font-bold">Register</h1>
            <p class="font-medium ">Daftarkan akun anda disini !!</p>
            <form action="#" class="flex flex-col mt-7 gap-[10px]">
                <label for="name" id="name">Nama</label>
                <input type="text" name="name" id="name" class="border border-gray-400 px-5 py-[14px] rounded-md"
                    placeholder="Masukan Nama">
                <label for="email" id="email">Email</label>
                <input type="text" name="email" id="email" class="border border-gray-400 px-5 py-[14px] rounded-md"
                    placeholder="Masukan Email">
                <label for="pass" id="pass">Password</label>
                <input type="password" name="pass" id="pass" class="border border-gray-400 px-5 py-[14px] rounded-md"
                    placeholder="Masukan Kata Sandi">
                <button class="btn-regis bg-[#0075FF] py-[14px] text-white rounded-md mt-14">Daftar</button>
            </form>
        </template>

        <template #btn-login>
            <LightBulb></LightBulb>
            <p class="text-center">
                Sudah punya akun? <button @click="goToLogin()" class="font-bold">Masuk disini</button>
            </p>
        </template>

        <template #side>
            <h1 class=" text-white">GAMBAR</h1>
        </template>
    </RegisterLayout>
</template>

<style scoped>
.btn-regis {
    box-shadow: 0px 10px 20px 7px rgba(0, 117, 255, 0.1);
}
</style>