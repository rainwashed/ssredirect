<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";
import { FormField } from "./ui/form";
import FormLabel from "./ui/form/FormLabel.vue";
import FormControl from "./ui/form/FormControl.vue";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
// @ts-ignore
import { FulfillingSquareSpinner } from "epic-spinners";
import { ref } from "vue";

let isCreating = ref(false);
let hadErr = ref(false);
let $m = ref("");

const possibleMessages = [
  "Create that sh**",
  "Simplify it",
  "Nya~ Press me",
  "I hate ts",
  "Make me a better link",
  "Life is easier with this",
  "What is this message even?",
  "Press here for free vbucks",
  "Robux here",
  "Touch me...",
];

const randomString = () => {
  let a = new Uint8Array(20 / 2);
  window.crypto.getRandomValues(a);
  return Array.from(a, (dec) => dec.toString(16).padStart(2, "0")).join("");
};

const formSchema = toTypedSchema(
  z.object({
    target: z
      .string()
      .refine(
        (v) => /^(http|https):\/\//g.test(v ?? ""),
        "target must be a link."
      )
      .refine((v) => v.length < 256, "make your link smaller bozo"),
    cut: z
      .string()
      .refine(
        (v) => /^[a-zA-Z0-9-]+$/g.test(v ?? ""),
        "cut must be a valid ASCII sequence of characters."
      )
      .refine((v) => v.length < 128, "make your cut smaller bozo")
      .default(randomString()),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const submitForm = form.handleSubmit((values) => {
  console.log(values);

  if (isCreating.value) {
    console.log("already in the process of creating one");
    return;
  }

  isCreating.value = true;
  let { cut, target } = values;

  fetch(`/a/${cut}`, {
    method: "POST",
    body: JSON.stringify({
      target: target,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((body: { e: boolean; $: string }) => {
      hadErr.value = body.e;
      $m.value = body.$;
      isCreating.value = false;

      console.log(body);
    });
});
</script>
<script lang="ts">
const url = window.location.origin; // NOTE: This is a fallback!
</script>
<template>
  <form
    @submit="submitForm"
    class="flex flex-col space-y-2"
    v-if="!hadErr && $m === ''"
  >
    <div
      :class="
        cn(
          `flex flex-col md:flex-row space-y-2 md:space-y-0 space-x-0 md:space-x-2`
        )
      "
    >
      <FormField v-slot="{ componentField }" name="target">
        <FormItem class="flex-[1] md:flex-[3]">
          <FormLabel>Target</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="https://google.com"
              v-bind="componentField"
            />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="cut">
        <FormItem class="flex-[1]">
          <FormLabel>Cut</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
    </div>
    <Button type="submit" class="drop-shadow-md">
      <span v-if="!isCreating">{{ possibleMessages.sample() }}</span>
      <span class="inline-block w-auto h-full" v-else>
        <FulfillingSquareSpinner
          :animation-duration="2000"
          class="h-auto"
          :size="20"
        />
      </span>
    </Button>
  </form>
  <div v-else>
    <span
      class="inline-block w-full m-auto font-bold text-center text-red-400"
      v-if="hadErr"
    >
      {{ $m }}
    </span>
    <span class="inline-block w-full m-auto italic text-center" v-else>
      <a :href="`${url}/a/${$m}`">{{ `${url}/a/${$m}` }}</a>
    </span>
  </div>
</template>
