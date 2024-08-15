<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 relative">
    <!-- Spinner and Blurred Background -->
    <div v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" class="fill-surface-0 dark:fill-surface-800"
        aria-label="loading" />
    </div>

    <!-- Login Form -->
    <div class="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
      <!-- left side -->
      <div class="flex flex-col gap-4 items-center justify-center p-7 md:p-16">
        <img src="/img/school_logo.png" class="w-[30%] m-auto" alt="School Logo" />
        <div class="flex flex-col items-center justify-center">
          <span class="mb-3 text-3xl font-bold">Login</span>
          <span class="font-light text-gray-400 mb-8"> Academic Info Manager </span>
        </div>
        <form @submit.prevent="signIn" action="" class="flex flex-col gap-y-6 w-full">
          <InputText id="email" v-model="email" size="large" type="email" placeholder="Email" required
            :invalid="invalid" />
          <Password v-model="password" toggleMask placeholder="Password" size="large" fluid required
            :invalid="invalid" />
          <Button type="submit" label="Submit" />
        </form>
      </div>

      <!-- right side -->
      <login-swiper class="w-[400px]" />
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import LoginSwiper from '@/components/LoginSwiper.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router';
import helper from '@/services/helper.js'
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const invalid = ref(false)
const toast = useToast()
const { loginUserAction } = useAuthStore()

const signIn = () => {
  loading.value = true;

  const data = {
    email: email.value.trim().toLowerCase(),
    password: password.value,
  };

  loginUserAction(data)
    .then((res) => {
      loading.value = false;
      helper.showSuccess(res.message, toast);

      // Delay the redirection by 3 seconds (3000 milliseconds)
      setTimeout(() => {
        if (res.user?.user_type == "teacher") {
          router.push({ name: "overview-teacher" });
        } else if (res.user?.user_type == "student") {
          router.push({ name: "my-result" });
        } else if (res.user?.user_type == "staff") {
          router.push({ name: "overview-staff" });
        }
      }, 1000); // 2 seconds delay
    })
    .catch((err) => {
      loading.value = false;
      helper.showError(err.response.data.message, toast);
      email.value = "";
      password.value = "";
      invalid.value = true;
      console.log(err);
    });
};

</script>

<style scoped></style>
