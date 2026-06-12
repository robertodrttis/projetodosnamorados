import { connectLambda, getStore } from '@netlify/blobs'
import { randomBytes } from 'crypto'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function createId() {
  return randomBytes(6).toString('hex')
}

function parseBody(event) {
  if (!event.body) return null

  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  return JSON.parse(raw)
}

function isValid(data) {
  return (
    data &&
    typeof data.herName === 'string' &&
    data.herName.trim() &&
    typeof data.yourName === 'string' &&
    data.yourName.trim() &&
    typeof data.letter === 'string' &&
    data.letter.trim() &&
    typeof data.gift === 'string' &&
    data.gift.trim() &&
    data.photos?.entry &&
    data.photos?.music &&
    data.whatsappNumber &&
    data.whatsappMessage
  )
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Método não permitido' })
  }

  try {
    connectLambda(event)

    let data
    try {
      data = parseBody(event)
    } catch {
      return json(400, { error: 'JSON inválido no corpo da requisição' })
    }

    if (!isValid(data)) {
      return json(400, { error: 'Dados incompletos' })
    }

    const store = getStore('presentes')
    const id = createId()

    await store.setJSON(id, {
      herName: data.herName.trim(),
      yourName: data.yourName.trim(),
      entryQuote: data.entryQuote?.trim() || '',
      letter: data.letter.trim(),
      gift: data.gift.trim(),
      whatsappNumber: String(data.whatsappNumber).replace(/\D/g, ''),
      whatsappMessage: data.whatsappMessage.trim(),
      photos: {
        entry: data.photos.entry,
        music: data.photos.music,
      },
      createdAt: new Date().toISOString(),
    })

    return json(200, { id })
  } catch (err) {
    console.error('save-present:', err?.message || err)
    return json(500, { error: 'Erro ao salvar o presente' })
  }
}
