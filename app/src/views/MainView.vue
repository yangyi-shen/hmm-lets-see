<script setup lang="ts">
import { ref } from 'vue'
import loadingImg from '@/assets/loading.png'

interface Answer {
  summary: string
  points: string[]
}

const loading = ref<boolean>(false)
const prompt = ref<null | string>(null)
const answer = ref<null | Answer>(null)

const apiUrl = 'http://localhost:6900' // will be changed once deployed to production

async function fetchAnalysis() {
  loading.value = true

  const response = await fetch(`${apiUrl}/analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: prompt.value }),
  })
    .then((response) => response.json())
    .then((response) => response)

  answer.value = response.data as Answer
  loading.value = false

  console.log(response)

  return response
}
</script>

<template>
  <main>
    <section>
      <p class="text-3xl font-bold mb-1">Hmm, let's see... 🤔</p>
      <p class="leading-snug">
        Type a question in the searchbox below, and the relevant research papers will be fetched
        from Crossref, and data-crunched by AI to produce a reasonably educated answer.
      </p>
    </section>
    <section>
      <form class="flex flex-col gap-2 mt-8 mb-4" @submit.prevent="fetchAnalysis()">
        <input
          v-model="prompt"
          class="placeholder:text-slate-500 border-1 border-slate-950 rounded-sm px-2"
          type="text"
          placeholder="How long can people smoke cigarettes before the health effects become evident?"
          required
        />
        <button
          v-if="!loading"
          type="submit"
          class="bg-amber-500 text-white font-semibold px-2 rounded hover:cursor-pointer"
        >
          Ask
        </button>
        <button
          v-else
          class="bg-amber-500 opacity-50 text-white font-semibold px-2 rounded"
          disabled
        >
          Loading...
        </button>
      </form>
    </section>
    <section class="min-h-60 border-1 border-slate-950 rounded-sm p-2">
      <p v-if="!answer">AI response will go here...</p>
      <p v-else-if="loading">AI response is loading...</p>
      <div v-else>
        <p class="mb-1 text-2xl font-semibold">Summary</p>
        <p class="mb-2 leading-snug">{{ answer.summary }}</p>
        <p class="mb-1 text-2xl font-semibold">Reasoning</p>
        <p v-for="(point, index) in answer.points" :key="index" class="mb-2 leading-snug">
          {{ point }}
        </p>
      </div>
    </section>
    <footer class="mt-8 leading-snug">
      <p>
        PS: This is my first project involving AI and technologies like LangChain, so the results
        will probably be less than helpful! However, I hope you nonetheless find it a little
        interesting.
      </p>
    </footer>
  </main>
</template>
