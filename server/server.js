import express from 'express'
import config from './config.js' // Corrected import path
import OpenAI from 'openai'
import cors from 'cors'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import db from './db.js'

const app = express()
const port = 3000

app.use(cors()) // Use CORS middleware without options

const Character_Response_Schema = z.object({
  pinyin: z.string(),
  zh_meaning: z.string(),
  en_meaning: z.string(),
  example_words: z.array(z.string()),
  example_sentence: z.string(),
})
// Load OpenAI key from config
const openai = new OpenAI({
  apiKey: config.openai_key, // Use the key from config
})

app.get('/api', (req, res) => {
  res.send('Hello!')
})

// /api/lookup-char
app.get('/api/lookup-char/:char', async (req, res) => {
  console.log('/api/lookup-char')
  const char = req.params.char
  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: '你是一个中文助手，请按用户提供的汉字，将解释内容生成为指定schema的JSON',
      },
      {
        role: 'user',
        content: char,
      },
    ],
    response_format: zodResponseFormat(Character_Response_Schema, 'Character_Response'),
  })
  const result = completion.choices[0].message.content
  res.setHeader('Content-Type', 'application/json')
  console.log(result)
  res.send(result)
})

// /api/new-story
app.get('/api/new-story', async (req, res) => {
  console.log('/api/new-story')
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: '你是一名小学中文老师。' },
      {
        role: 'user',
        content:
          '请用中国小学3年级水平的汉字创作一个简单的故事，主要练习学生的识字能力。字数200以内。',
      },
    ],
  })
  const content = completion.choices[0].message.content
  const return_obj = {
    content: content,
  }
  // Set response header to indicate JSON object
  res.setHeader('Content-Type', 'application/json')
  console.log(return_obj)
  res.send(return_obj)
})

// /api/new-dictation
app.get('/api/new-dictation', async (req, res) => {
  console.log('/api/new-dictation')
  // Generate a dictation prompt
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-audio-preview',
    modalities: ['text', 'audio'],
    audio: { voice: 'alloy', format: 'wav' },
    messages: [
      {
        role: 'system',
        content:
          '你是一名小学中文老师，你要为你的学生准备一篇听写练习。请提供一句听写内容。\
                只要一个句子即可，这个句子可以是日常会话，可以是疑问句，也可以是时事话题。\
                听写内容以"请听题"开头',
      },
      {
        role: 'user',
        content: '我准备好啦，请提问。',
      },
    ],
  })
  const { data: content, transcript } = completion.choices[0].message.audio

  const jsonObj = { content, transcript }
  console.log(jsonObj)
  res.setHeader('Content-Type', 'application/json')
  res.send(jsonObj)
})

// /api/gen-image/:prompt
app.get('/api/gen-image/:prompt', async (req, res) => {
  const prompt = req.params.prompt
  console.log('/api/gen-image/' + prompt)
  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `你是一个中文老师，请为下面这个prompt配一幅插图: ${prompt}`,
    n: 1,
    size: '1024x1024',
  })
  const result = { url: image.data[0].url }
  res.setHeader('Content-Type', 'application/json')
  console.log(result)
  res.send(result)
})

// /api/checkin
app.get('/api/checkin', async (req, res) => {
  console.log('/api/checkin')
  await db.checkin()
  res.send('Checkin successful')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
