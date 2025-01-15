<script setup>
import { onMounted, inject } from 'vue'

const API_SERVER = inject('API_SERVER')
async function callApi(url) {
  console.log(API_SERVER, url)
  return await fetch(`${API_SERVER}${url}`)
}
async function getCheckins() {
  // timemark
  const t1 = performance.now()
  const response = await callApi('/api/get-checkins')
  const result = await response.json()
  const checkins = result.checkins
  console.log('checkins:', checkins)
  // timemark
  const t2 = performance.now()
  console.log('getCheckins took', t2 - t1, 'milliseconds')
  return checkins
}

function clearCalendar() {
  let i = 1
  while (true) {
    const div = document.getElementById('day' + i)
    // getElementById returns null if the element is not found
    if (div === null) {
      break
    }
    div.textContent = ''
    i++
  }
}

function applyCheckinStyle(dayDiv) {
  // set the background image to check.png
  dayDiv.style.backgroundImage = 'url("/red-dot.png")'
  // set the background size to 100% 100%
  dayDiv.style.backgroundSize = '100% 100%'
  // set the background repeat to no-repeat
  dayDiv.style.backgroundRepeat = 'no-repeat'
  // set mouse cursor to default
  dayDiv.style.cursor = 'default'
  // change the color of the text to gray
  dayDiv.style.color = 'gray'
}

async function updateCalendar() {
  clearCalendar()
  const checkins = await getCheckins()
  const today = new Date()
  const dayOfMonth = today.getDate()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  // get the index of the first day of the month 0 is Monday, 6 is Sunday
  // sunday 0 monday 1
  // sunday 6 monday 0
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayDiv = document.getElementById('day' + (firstDayOfWeek + i))
    dayDiv.textContent = i
    // checkins dates are in MM/DD/YYYY format.
    const dayStr = `${today.getMonth() + 1}/${i}/${today.getFullYear()}`
    if (checkins.includes(dayStr)) {
      applyCheckinStyle(dayDiv)
    }
    if (i === dayOfMonth && !checkins.includes(dayStr)) {
      // add click event listener to today
      dayDiv.addEventListener('mouseup', handleMouseUp)
      // change cursor to hand when hover over today
      dayDiv.style.cursor = 'pointer'
    }
  }
}

// onMounted is called when user clicks on the RouterLink to /checkin
onMounted(() => {
  updateCalendar()
})

async function handleMouseUp(event) {
  console.log('mouse up', event)
  const dayDiv = event.target
  await callApi('/api/checkin')
  applyCheckinStyle(dayDiv)
}
</script>

<template>
  <!--  Display Calendar of Current Month -->
  <div class="calendar-background">
    <div class="calendar">
      <div class="calendar-header">
        {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) }}
      </div>
      <div class="calendar-body">
        <div>周一</div>
        <div>周二</div>
        <div>周三</div>
        <div>周四</div>
        <div>周五</div>
        <div>周六</div>
        <div>周日</div>
        <div id="day1"></div>
        <div id="day2"></div>
        <div id="day3"></div>
        <div id="day4"></div>
        <div id="day5"></div>
        <div id="day6"></div>
        <div id="day7"></div>
        <div id="day8"></div>
        <div id="day9"></div>
        <div id="day10"></div>
        <div id="day11"></div>
        <div id="day12"></div>
        <div id="day13"></div>
        <div id="day14"></div>
        <div id="day15"></div>
        <div id="day16"></div>
        <div id="day17"></div>
        <div id="day18"></div>
        <div id="day19"></div>
        <div id="day20"></div>
        <div id="day21"></div>
        <div id="day22"></div>
        <div id="day23"></div>
        <div id="day24"></div>
        <div id="day25"></div>
        <div id="day26"></div>
        <div id="day27"></div>
        <div id="day28"></div>
        <div id="day29"></div>
        <div id="day30"></div>
        <div id="day31"></div>
        <div id="day32"></div>
        <div id="day33"></div>
        <div id="day34"></div>
        <div id="day35"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-background {
  background-image: url('/牧童放牛.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
.calendar {
  width: 50%;
  height: 60%;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0);
  /* display calender in center */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('/calendar-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1px;
  width: 70%;
  height: 80%;
  background-color: rgba(0, 0, 0, 0);
  background-size: 100% 100%;
  /* border: 1px solid black; */
}
.calendar-body div {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  background-color: rgba(0, 0, 0, 0);
  /* border: 1px solid black; */
}
.calendar-header {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  background-color: rgba(0, 0, 0, 0);
}
</style>
