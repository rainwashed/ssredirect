<script setup lang="ts">
import { Icon } from "@iconify/vue";
import IconName from "@/assets/icon.png";
</script>

<template>
  <footer
    class="m-auto mt-4 mb-2 px-4 w-full md:w-[90%] h-10 rounded-md bg-gray-800 text-white flex shadow-lg justify-start items-center"
  >
    <a href="/privacy.txt" title="Privacy Policy" target="_blank"
      ><Icon icon="material-symbols:privacy-tip" width="16" height="16"
    /></a>
    <a href="/agreement.txt" title="User Agreement" target="_blank"
      ><Icon icon="material-symbols:contract" width="16" height="16"
    /></a>
    <a href="/info.txt" title="About" target="_blank">
      <Icon icon="material-symbols:info" width="16" height="16" />
    </a>

    <span class="flex items-center h-full p-2 ml-auto space-x-1">

    <a href="https://buymeacoffee.com/rainwashed" title="Buy Me a Coffee" target="_blank">
      <Icon icon="simple-icons:buymeacoffee" width="16" height="16" />
    </a>
      <img :src="IconName" class="w-auto h-full rounded-full aspect-square" />
      <a
        href="https://youtube.com/@rainwashedz"
        class="text-[50%] italic opacity-50"
        >@rainwashedz</a
      >
    </span>
  </footer>
</template>
