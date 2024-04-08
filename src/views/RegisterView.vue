<script>
import RegisterLayout from '@/components/layouts/RegisterLayout.vue'
import IconKwitansi from '@/components/icons/IconKwitansi.vue'
import LightBulb from '@/components/icons/LightBulb.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { reactive } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  name: 'RegisterUser',
  components: { RegisterLayout, IconKwitansi, LightBulb },
  setup() {
    const router = useRouter()
    const store = useStore()

    const form = reactive({
      name: '',
      email: '',
      password: '',
      confirm_password: ''
    })

    const errors = reactive({
      email: '',
      password: '',
      confirm_password: ''
    })

    const handleSubmit = async () => {
      const response = await store.dispatch('registerUser', form)

      if (response.status == true) {
        router.push({ name: 'Login' })
      }
    }

    const goToLogin = () => {
      router.push({ name: 'Login' })
    }

    //ANCHOR - Validastor

    const checkInput = () => {
      this.disabled = !Object.keys(form).every((e) => form[e] !== '')
    }

    const validateEmail = () => {
      const emailRegex = /\S+@\S+\.\S+/
      return emailRegex.test(form.email)
    }

    const validatePassword = () => {
      const passwordRegex = /^.{6,}$/
      return passwordRegex.test(form.password)
    }

    const validateRetypePassword = () => {
      return form.confirm_password === form.password
    }

    return {
      form,
      handleSubmit,
      goToLogin,
      errors,
      checkInput,
      validateEmail,
      validatePassword,
      validateRetypePassword
    }
  },
  watch: {
    'form.email': {
      handler() {
        this.errors.email =
          this.form.email === ''
            ? 'Email harus diisi'
            : !this.validateEmail()
              ? 'Email tidak valid'
              : ''
      }
    },
    'form.password': {
      handler() {
        this.errors.password =
          this.form.password === ''
            ? 'Password harus diisi'
            : !this.validatePassword()
              ? 'Kata sandi minimal harus 6 karakter'
              : ''
        this.errors.confirm_password = !this.validateRetypePassword()
          ? 'Kata sandi tidak cocok'
          : ''
      }
    },
    'form.confirm_password': {
      handler() {
        this.errors.confirm_password = !this.validateRetypePassword()
          ? 'Kata sandi tidak cocok'
          : ''
      }
    }
  }
}
</script>

<template>
  <RegisterLayout>
    <template #icon>
      <IconKwitansi></IconKwitansi>
    </template>

    <template #register>
      <h1 class="text-[32px] font-bold">Register</h1>
      <p class="font-medium">Daftarkan akun anda disini !!</p>
      <form @submit.prevent="handleSubmit" class="flex flex-col mt-7 gap-[10px]">
        <label for="name" id="name">Nama</label>
        <input
          type="text"
          v-model="form.name"
          name="name"
          id="name"
          class="border border-gray-400 px-5 py-[14px] rounded-md"
          placeholder="Masukan Nama"
        />

        <label for="email" id="email">Email</label>
        <input
          v-model="form.email"
          type="text"
          name="email"
          id="email"
          class="border border-gray-400 px-5 py-[14px] rounded-md"
          placeholder="Masukan Email"
        />
        <span v-if="errors.email" class="text-sm text-red-500"> {{ errors.email }}</span>

        <label for="password">Password</label>
        <input
          v-model="form.password"
          type="password"
          name="password"
          id="password"
          class="border border-gray-400 px-5 py-[14px] rounded-md"
          placeholder="Masukan Kata Sandi"
          autocomplete="address-level1"
        />
        <span v-if="errors.password" class="text-sm text-red-500"> {{ errors.password }}</span>

        <label for="confirm-password">Konfirmasi Password</label>
        <input
          id="confirm-password"
          v-model="form.confirm_password"
          type="password"
          name="confirm-password"
          placeholder="Masukan ulang kata sandi"
          class="border border-gray-400 px-5 py-[14px] rounded-md"
        />
        <span v-if="errors.confirm_password" class="text-sm text-red-500">
          {{ errors.confirm_password }}</span
        >

        <button type="submit" class="btn-regis bg-[#0075FF] py-[14px] text-white rounded-md mt-14">
          Daftar
        </button>
      </form>
    </template>

    <template #btn-login>
      <LightBulb></LightBulb>
      <p class="text-center">
        Sudah punya akun?
        <button @click="goToLogin()" class="font-bold">Masuk disini</button>
      </p>
    </template>

    <template #side>
      <h1 class="text-white">GAMBAR</h1>
    </template>
  </RegisterLayout>
</template>

<style scoped>
.btn-regis {
  box-shadow: 0px 10px 20px 7px rgba(0, 117, 255, 0.1);
}
</style>
