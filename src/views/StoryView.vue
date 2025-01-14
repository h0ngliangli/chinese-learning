<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
// make story 2-way binding
const story = ref('')

const API_SERVER = inject('API_SERVER')

async function newStory() {
  story.value = '生成中...'

  try {
    const response = await fetch(`${API_SERVER}/api/new-story`)
    if (response.ok) {
      const data = await response.json()
      story.value = data.content
    } else {
      story.value = '生成失败，请重试。'
    }
  } catch (error) {
    console.error(error)
    story.value = '生成失败，请重试。'
  }
}
</script>

<template>
  <main>
    <p><button @click="newStory">新故事</button></p>
    <div class="story-content" id="story-content">
      {{ story }}
    </div>
  </main>
</template>

<style scoped>
main {
  margin-top: 1rem;
}
.story-content {
  margin-top: 1rem;
  font-size: 1.3rem;
  border: 1px dashed #ccc;
  /* make the story content scrollable */
  max-height: 60vh;
  overflow-y: auto;
  /* 行间距 */
  line-height: 1.5;
}
</style>
