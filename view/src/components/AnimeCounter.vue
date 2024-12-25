<script setup lang="ts">
import Girl1 from "../assets/girlnums/1.gif";
import Girl2 from "../assets/girlnums/2.gif"
import Girl3 from "../assets/girlnums/3.gif";
import Girl4 from "../assets/girlnums/4.gif";
import Girl5 from "../assets/girlnums/5.gif";
import Girl6 from "../assets/girlnums/6.gif"
import Girl7 from "../assets/girlnums/7.gif";
import Girl8 from "../assets/girlnums/8.gif";
import Girl9 from "../assets/girlnums/9.gif";
import Girl0 from "../assets/girlnums/0.gif"

const numImageReferences: {[key: number]: string} = {
    1: Girl1,
    2: Girl2,
    3: Girl3,
    4: Girl4,
    5: Girl5,
    6: Girl6,
    7: Girl7,
    8: Girl8,
    9: Girl9,
    0: Girl0,
}

const props = defineProps<{
    number: number,
}>();


let numberArr = props.number.toString().split("").map(d => parseInt(d));
</script>
<template>
    <img v-for="(digit, _) in numberArr" :src="numImageReferences[digit]">
</template>