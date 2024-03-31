<script>
import LoginLayout from "@/components/layouts/LoginLayout.vue";
import LightBulb from "@/components/icons/LightBulb.vue";
import IconKwitansi from "@/components/icons/IconKwitansi.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "LoginView",
  components: { LoginLayout, LightBulb, IconKwitansi },

  setup() {
    const router = useRouter();
    const authStore = useStore();

    const showPassword = ref(false);

    const goToRegister = () => {
      router.push({ name: "Register" });
    };

    const form = reactive({
      email: "",
      password: "",
    });

    const errors = reactive({
      email: "",
      password: "",
    });

    //ANCHOR - Handle messages

    const handleSubmit = async () => {
      const promiseToast = toast.loading("Please wait...", {
        position: toast.POSITION.TOP_CENTER,
      });

      const response = await authStore.dispatch("loginUser", form);
      const message = "Email atau password tidak boleh kosong !!";
      const validationEmail = "Email tidak boleh kosong !!";
      const passwordValidation = "Password tidak boleh kosong !!";

      if (response.code === 200) {
        toast.update(promiseToast, {
          render: response.message,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "success",
          isLoading: false,
        });
        router.push("/dashboard");
      } else if (form.email === "" && form.password === "") {
        toast.update(promiseToast, {
          render: message,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "error",
          isLoading: false,
        });
      } else if (form.email === "") {
        toast.update(promiseToast, {
          render: validationEmail,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "error",
          isLoading: false,
        });
      } else if (form.password === "") {
        toast.update(promiseToast, {
          render: passwordValidation,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "error",
          isLoading: false,
        });
      } else {
        toast.update(promiseToast, {
          render: response.data.message,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "error",
          isLoading: false,
        });
      }
    };

    //ANCHOR - Validastor

    const checkInput = () => {
      this.disabled = !Object.keys(form).every((e) => form[e] !== "");
    };

    const validateEmail = () => {
      const emailRegex = /\S+@\S+\.\S+/;
      return emailRegex.test(form.email);
    };

    const validatePassword = () => {
      const passwordRegex = /^.{6,}$/;
      return passwordRegex.test(form.password);
    };

    return {
      goToRegister,
      form,
      handleSubmit,
      showPassword,
      errors,
      checkInput,
      validateEmail,
      validatePassword,
    };
  },
  watch: {
    "form.email": {
      handler() {
        this.errors.email =
          this.form.email === ""
            ? "Email harus diisi"
            : !this.validateEmail()
            ? "Email tidak valid"
            : "";
      },
    },
    "form.password": {
      handler() {
        this.errors.password =
          this.form.password === ""
            ? "Password harus diisi"
            : !this.validatePassword()
            ? "Kata sandi minimal harus 6 karakter"
            : "";
      },
    },
  },
};
</script>

<template>
  <LoginLayout>
    <template #icon>
      <IconKwitansi></IconKwitansi>
    </template>

    <template #login>
      <h1 class="text-[32px] font-bold">Masuk</h1>
      <p class="font-medium">Masukkan akun anda disini !!</p>
      <form @submit.prevent="handleSubmit" class="flex flex-col mt-7 gap-[10px]">
        <label for="email">Email</label>
        <input
          type="text"
          name="email"
          v-model="form.email"
          id="email"
          class="border border-gray-400 px-5 py-[14px] rounded-md outline-none"
          placeholder="Masukan Email"
        />
        <span v-if="errors.email" class="text-sm text-red-500"> {{ errors.email }}</span>
        <label for="pass">Password</label>
        <div
          class="password-input-wrapper flex w-full border-gray-400 relative border rounded-md"
        >
          <input
            id="password"
            v-model="form.password"
            class="px-5 py-[14px] bg-transparent outline-none w-[90%]"
            name="password"
            placeholder="Masukkan kata sandi"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="additional-name"
          />
          <img
            v-if="showPassword"
            src="../components/icons/eye.svg"
            alt="eye"
            class="absolute cursor-pointer self-center flex right-4"
            @click="showPassword = !showPassword"
          />
          <img
            v-if="!showPassword"
            src="../components/icons/eye-slash.svg"
            alt="eye"
            class="absolute cursor-pointer self-center flex right-4"
            @click="showPassword = !showPassword"
          />
          <!-- <span v-if="errors.password" class="text-sm text-red-500">
            {{ errors.password }}</span
          > -->
        </div>
        <span v-if="errors.password" class="text-sm text-red-500">
          {{ errors.password }}</span
        >
        <button class="underline text-end mt-2">Lupa Kata Sandi?</button>
        <button
          type="submit"
          class="btn-login bg-[#0075FF] py-[14px] text-white rounded-md mt-14"
        >
          Masuk
        </button>
      </form>
    </template>
    <template #regis>
      <LightBulb></LightBulb>
      <p class="text-center">
        Belum punya akun?
        <button @click="goToRegister" class="font-bold">Daftar disini</button>
      </p>
    </template>

    <template #side>
      <h1 class="text-white">GAMBAR</h1>
    </template>
  </LoginLayout>
</template>

<style scoped>
.btn-login {
  box-shadow: 0px 10px 20px 7px rgba(0, 117, 255, 0.2);
}
</style>
