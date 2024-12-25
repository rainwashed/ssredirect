<script setup lang="ts">
import { onMounted, ref } from "vue";
import AnimeCounter from "./AnimeCounter.vue";

let count = ref(-1);

onMounted(() => {
    fetch("/a_count").then((req) => req.json()).then((obj) => {
        let c = obj as {
            e: boolean,
            $: number,
        }

        if (c.e) {
            count.value = -1;
        } else {
            count.value = c.$;
        }
    })
})

</script>

<template>
<div class="flex flex-col justify-center w-full mt-6">
          <h3 class="mb-2 italic font-light text-center text-gray-400"># of Redirects Made:</h3>
          <div class="flex justify-center w-full">
          <AnimeCounter :number="count" v-if="count > -1" />
          </div>
       </div>
</template>