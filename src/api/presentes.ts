import type { ShareableConfig } from '../utils/shareConfig'

const SAVE_URL = '/.netlify/functions/save-present'
const GET_URL = '/.netlify/functions/get-present'

export async function savePresent(data: ShareableConfig): Promise<string> {
  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Falha ao salvar')
  }

  const { id } = await res.json()
  return id as string
}

export async function fetchPresent(id: string): Promise<ShareableConfig> {
  const res = await fetch(`${GET_URL}?id=${encodeURIComponent(id)}`)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Falha ao carregar')
  }

  return res.json() as Promise<ShareableConfig>
}

export function buildPresentUrl(id: string) {
  const base = window.location.origin + window.location.pathname
  return `${base}?p=${id}`
}

export function getPresentIdFromUrl() {
  return new URLSearchParams(window.location.search).get('p')?.trim() || null
}
