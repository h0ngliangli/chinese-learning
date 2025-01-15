<script setup>
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import DictionaryPanel from './components/DictionaryPanel.vue'

const showModal = ref(false)
const selectedText = ref('')
// global variable to store the selected text
provide('globalSelectedText', selectedText)

function handleMouseUp() {
  console.log('Mouse up event')
  // mouseup event handler to update the selected text
  const newText = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text
  if (newText !== selectedText.value) {
    selectedText.value = newText
    console.log('Selected text:', selectedText.value)
  }
}

// keyboard event handler to show/hide the dictionary panel
function handleKeyDown(event){
  if (event.key === 'd') {
    showModal.value = !showModal.value
    // cancel the default behavior of the 'd' key
    event.preventDefault()
  }
  if (event.key === 'Escape') {
    showModal.value = false
  }
  event.stopPropagation()
}

onMounted(() => {
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('keydown', handleKeyDown)
})

const toggleModal = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <nav>
    <RouterLink to="/story">故事</RouterLink>
    <RouterLink to="/dictation">听写</RouterLink>
    <a class="lookup-button" @click="toggleModal">查</a>
    <RouterLink to="/checkin">打卡</RouterLink>
  </nav>
  <DictionaryPanel :show-modal="showModal" />
  <RouterView />
</template>

<style scoped>
nav {
  text-align: left;
  font-size: 1rem;
  background-color: rgba(156, 129, 94, 0.2); /* 半透明背景色 */
  border-radius: 10px; /* 圆角 */
}

nav a {
  padding: 0.5rem 1rem;
}

.lookup-button {
  /* background-color: rgba(179, 122, 35, 0.5); /* 半透明背景色 */
  /*color: white;
  border: none;
  border-radius: 10%;
  font-size: 1rem;
  padding: 0rem 0.2rem; */
  cursor: pointer;
}

nav a:hover {
  /* background-color: rgba(179, 122, 35, 0.5); 半透明背景色 */
  /* color: white; */
  background-image: url('/underline.png');
  background-position: bottom;
  background-size: 2rem;
  background-repeat: no-repeat;
}
</style>
