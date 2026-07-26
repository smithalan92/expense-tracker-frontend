<script setup lang="ts">
import Logo from "@/assets/logo.svg";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAppStore from "@/store/appStore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";
import Card from "../ui/card/Card.vue";

const appStore = useAppStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const hasFailedToLogin = ref(false);

const canLogin = computed(() => !!email.value.trim() && !!password.value.trim());

const onClickLogin = () => {
  hasFailedToLogin.value = false;
  appStore
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
    <Logo class="w-[300px] text-primary" />
    <Card class="mt-12 px-6 grid grid-rows-2 gap-3">
      <Field :invalid="!email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@example.com" v-model="email" class="px-4 py-6" />
      </Field>
      <Field :invalid="!password">
        <FieldLabel>Password</FieldLabel>
        <Input type="password" placeholder="password" v-model="password" class="px-4 py-6" />
      </Field>
      <div class="mt-8 w-full">
        <Button class="w-full" @click="onClickLogin" :disabled="!canLogin">Log In</Button>
        <span v-if="hasFailedToLogin" class="mt-4 text-red">Invalid username or password...</span>
      </div>
    </Card>
  </div>
</template>
