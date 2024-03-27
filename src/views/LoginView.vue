<!-- <script setup>
import LoginComponent from '@/components/LoginComponent.vue';
</script>
<template>
    <LoginComponent></LoginComponent>
</template> -->
<script setup>
import LoginLayout from '@/components/layouts/LoginLayout.vue';
import LightBulb from '@/components/icons/LightBulb.vue';
import IconKwitansi from '@/components/icons/IconKwitansi.vue';
import { useRouter } from "vue-router";

const router = useRouter();
const goToRegister = () => {
    router.push({ name: 'Register' })
}

</script>

<template>
    <LoginLayout>
        <template #icon>
            <IconKwitansi></IconKwitansi>
        </template>

        <template #login>
            <h1 class="text-[32px] font-bold">Masuk</h1>
            <p class="font-medium ">Masukkan akun anda disini !!</p>
            <form action="#" class="flex flex-col mt-7 gap-[10px]">
                <label for="email" id="email">Email</label>
                <input type="text" name="email" id="email" class="border border-gray-400 px-5 py-[14px] rounded-md"
                    placeholder="Masukan Email">
                <label for="pass" id="pass">Password</label>
                <input type="password" name="pass" id="pass" class="border border-gray-400 px-5 py-[14px] rounded-md"
                    placeholder="Masukan Kata Sandi">
                <button class="underline text-end mt-2">Lupa Kata Sandi?</button>
                <button class="btn-login bg-[#0075FF] py-[14px] text-white rounded-md mt-14">Masuk</button>
            </form>
        </template>
        <template #regis>
            <LightBulb></LightBulb>
            <p class="text-center">
                Belum punya akun? <button @click="goToRegister()" class="font-bold">Daftar disini</button>
            </p>
        </template>

        <template #side>
            <h1 class=" text-white">GAMBAR</h1>
        </template>
    </LoginLayout>
</template>

<style scoped>
.btn-login {
    box-shadow: 0px 10px 20px 7px rgba(0, 117, 255, 0.1);
}
</style>