<script setup>
import { ref, inject } from 'vue'
const url = ref('')
const progress = ref('')
const API_SERVER = inject('API_SERVER')
const transcript = ref('')
const imageUrl = ref('')
const showTranscript = ref(false)
const transcriptButtonImgUrl = ref('/small-close.png')

async function newDictation() {
  progress.value = '语音生成中...'
  imageUrl.value = ''
  transcript.value = ''
  showTranscript.value = false
  transcriptButtonImgUrl.value = '/small-close.png'
  const image = document.getElementById('image')
  image.src = ''
  image.alt = ''
  try {
    const response = await fetch(`${API_SERVER}/api/new-dictation`)
    if (response.ok) {
      const data = await response.json()
      transcript.value = data.transcript
      // Convert base64 to binary
      const binaryString = atob(data.content)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Create a Blob from the binary data
      const blob = new Blob([bytes], { type: 'audio/wav' })
      url.value = URL.createObjectURL(blob)
      const audio = document.getElementById('audio')
      audio.src = url.value
      audio.play()
      genImage(transcript.value)
    } else {
      progress.value = '生成失败，请重试。'
    }
  } catch (error) {
    console.error(error)
    progress.value = '生成失败，请重试。'
  }
}

async function genImage(transcript) {
  progress.value = '图片生成中...'

  try {
    const response = await fetch(`${API_SERVER}/api/gen-image/${transcript}`)
    if (response.ok) {
      const data = await response.json()
      imageUrl.value = data.url
      progress.value = ''
    } else {
      progress.value = '生成失败，请重试。'
    }
  } catch (error) {
    console.error(error)
    progress.value = '生成失败，请重试。'
  }
}

async function toggleTranscript() {
  if (!transcript.value) {
    return
  }
  showTranscript.value = !showTranscript.value
  if (showTranscript.value) {
    transcriptButtonImgUrl.value = '/small-open.png'
  } else {
    transcriptButtonImgUrl.value = '/small-close.png'
  }
}
</script>

<template>
  <main>
    <div class="center">
      <p><button @click="newDictation">新句子</button></p>
      <p v-if="progress">{{ progress }}</p>
      <div>
        <audio controls id="audio">
          <source type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div>
        <img :src="imageUrl" alt="" id="image" width="300" height="300" />
      </div>
    </div>
    <div class="transcript">
      <img
        :src="transcriptButtonImgUrl"
        width="40px"
        alt="close"
        class="image-button"
        @click="toggleTranscript"
      />
      <div v-if="transcript && showTranscript" class="transcript-content">{{ transcript }}</div>
    </div>
  </main>
</template>

<style scoped>
main {
  /* column 1fr 1fr */
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.center {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.transcript {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1rem;
  font-size: 1.3rem;
  /* make the story content scrollable */
  max-height: 60vh;
  overflow-y: auto;
  /* 行间距 */
  line-height: 1.5;
}

.image-button {
  cursor: pointer;
}


.transcript-content {
  padding-left: 1rem;
}
</style>
