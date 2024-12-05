<script setup lang="ts">
import Logo from "@/assets/logo.svg";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "./userStore";

const userStore = useUserStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const hasFailedToLogin = ref(false);

const canLogin = computed(() => !!email.value.trim() && !!password.value.trim());

const onClickLogin = () => {
  hasFailedToLogin.value = false;
  userStore
    .loginUser({ email: email.value, password: password.value })
    .then(() => {
      router.push("/trips");
    })
    .catch(() => {
      hasFailedToLogin.value = true;
    });
};
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-12">
    <Logo class="w-[300px]" />
    <div class="mt-12 flex flex-col">
      <div
        v-if="hasFailedToLogin"
        class="alert alert-error shadow-lg mb-6 animate__animated animate__bounceIn"
      >
        <span>Invalid username or password</span>
      </div>
      <input
        type="text"
        placeholder="Email"
        class="input input-bordered rounded-md input-primary w-72 max-w-lg"
        autoFocus="true"
        v-model="email"
      />
      <input
        type="password"
        placeholder="Password"
        class="mt-4 input input-bordered rounded-md input-primary w-72 max-w-lg"
        v-model="password"
      />
      <div class="mt-8 flex w-full">
        <button
          class="btn btn-primary rounded-lg w-full"
          :disabled="!canLogin"
          @click="onClickLogin"
        >
          Log In
        </button>
      </div>
    </div>
  </div>
</template>
