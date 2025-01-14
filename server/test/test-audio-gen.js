import { writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import OpenAI from "openai";
import config from "../config.js";

const openai = new OpenAI({
  apiKey: config.openai_key
});

// Generate an audio response to the given prompt
const response = await openai.chat.completions.create({
  model: "gpt-4o-audio-preview",
  modalities: ["text", "audio"],
  audio: { voice: "alloy", format: "wav" },
  messages: [
    {
      role: 'system',
      content: '你是一名小学中文老师，你要为你的学生准备一篇听写练习。请提供一句听写内容。\
                只要一个句子即可，这个句子可以是日常会话，可以是疑问句，也可以是时事话题。\
                听写内容以"请听题"开头',
    },
    {
      role: 'user',
      content: '我准备好啦，请提问。',
    }
  ],
});

// Inspect returned data
console.log(response.choices[0]);

// Write audio data to a file
writeFileSync(
  "dictation-sample.wav",
  Buffer.from(response.choices[0].message.audio.data, 'base64'),
  { encoding: "utf-8" }
);
