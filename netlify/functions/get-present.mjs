import { connectLambda, getStore } from '@netlify/blobs'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Método não permitido' })
  }

  const id = event.queryStringParameters?.id?.trim()

  if (!id || !/^[a-f0-9]{12}$/.test(id)) {
    return json(400, { error: 'ID inválido' })
  }

  try {
    connectLambda(event)

    const store = getStore('presentes')
    const data = await store.get(id, { type: 'json' })

    if (!data) {
      return json(404, { error: 'Presente não encontrado' })
    }

    return json(200, data)
  } catch (err) {
    console.error('get-present:', err?.message || err)
    return json(500, { error: 'Erro ao carregar o presente' })
  }
}
