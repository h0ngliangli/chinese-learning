<script setup>
import { ref, inject, watch, nextTick } from 'vue'

// define show property
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
})

const API_SERVER = inject('API_SERVER')
const characterLookupStatus = ref('')
const characterInfo = ref({})
const showModal = ref(props.showModal)

// watch for changes in the showModal prop
watch(() => props.showModal, async (value) => {
  showModal.value = value
  console.log('Show modal:', value)
  if (value) {
    // wait for the DOM to update
    await nextTick()
    // now DOM is updated
    // setTimeout(() => {
    //   document.getElementById('char-input').focus()
    // }, 100)
    document.getElementById('char-input').focus()
  }
})

const lookupChar = async (event) => {
  if (event.key === 'Enter') {
    console.log('Enter key pressed:', event.target.value)
    // check if the input is empty
    if (!event.target.value) {
      characterLookupStatus.value = '请输入一个汉字。'
      return
    }
    // check if the input is a Chinese character
    if (!/[\u4e00-\u9fa5]/.test(event.target.value)) {
      characterLookupStatus.value = '请输入一个汉字。'
      return
    }
    characterLookupStatus.value = '查找中...'
    characterInfo.value = ''
    // send request to server /api/lookup-char/${event.target.value}
    const response = await fetch(`${API_SERVER}/api/lookup-char/${event.target.value}`)
    if (response.ok) {
      const data = await response.json()
      console.log('Character:', data)
      // Update the character info in the modal
      characterInfo.value = data
      characterLookupStatus.value = ''
    } else {
      console.error('Failed to lookup character:', response.statusText)
      characterLookupStatus.value = '查找失败，请重试。'
    }
  }
}
</script>

<template>
  <div v-show="showModal" class="modal">
    <div class="modal-content">
      <input
        type="text"
        class="modal-input"
        @keyup.enter="lookupChar"
        id="char-input"
      />
      <div>
        {{ characterLookupStatus }}
      </div>
      <div v-if="characterInfo" class="character-info">
        <span class="large-text"> {{ characterInfo.pinyin }}</span>
        <span>
          {{ characterInfo.zh_meaning }}
        </span>
        <span>
          {{ characterInfo.en_meaning }}
        </span>
        <hr />
        <span v-for="word in characterInfo.example_words" :key="word">
          {{ word }}
        </span>
        <span>
          {{ characterInfo.example_sentence }}
        </span>
        <div class="spacer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.close-button {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.floating-button {
  position: absolute;
  top: 50%;
  right: 50%;
  width: 30px;
  height: 30px;
  background-color: rgba(179, 122, 35, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 560px;
  height: 360px;
  background-image: url('/modal-bg-l.png');
  background-size: cover;
}

.modal-content {
  position: relative;
  top: 60px;
  left: 110px;
  width: 63%;
  height: 60%;
  background-color: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.modal-input {
  width: 4rem;
  text-align: center;
  border-width: 0;
  /* 设置透明背景色 */
  background-color: rgba(255, 255, 255, 0);
  color: none;
  border-radius: 3px;
  border-bottom: 1px solid black;
  font-size: 1.5rem;
}

.modal-input:focus {
  outline: none;
}

.character-info {
  width: 100%;
  line-height: 1.5;
  font-size: 12px;
  overflow-y: scroll;
  /* 雅黑 */
  font-family: 'YaHei';
  display: flex;
  flex-direction: column;
  align-items: center;
}

.large-text {
  font-size: 1.5rem;
}

.character-info hr {
  width: 20%;
  margin: 0.5rem 0;
  /* 居中显示 */
  text-align: center;
  border-style: dashed;
}

.spacer {
  background-image: url('/red-dot.png');
  background-size: cover;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
}
</style>
