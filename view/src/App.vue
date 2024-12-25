<script setup lang="ts">
import NewRedirect from "./components/NewRedirect.vue";
import Footer from "./components/Footer.vue";
import CatGirl from "@/assets/catgirl.png";
import NumRedirects from "./components/NumRedirects.vue";
</script>

<template>
  <main
    class="flex flex-col items-center justify-center w-screen h-screen space-y-4"
  >
  <div class="w-[90%] md:w-1/2">
    <img :src="CatGirl" class="w-full h-auto" />
    <h1 class="w-full text-2xl font-bold text-center md:text-3xl lg:text-5xl">
      Stupidly Simple Redirect
    </h1>
  </div>
    <div class="w-[90%] md:w-1/2">
      <NewRedirect />
      <NumRedirects />
    </div>
  </main>
  <Footer />
</template>
