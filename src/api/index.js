import { inject } from 'vue'

export async function callApi(url) {
  const API_SERVER = inject('API_SERVER')
  console.log(API_SERVER, url)
  return await fetch(`${API_SERVER}${url}`)
}

export default {
  callApi
}
