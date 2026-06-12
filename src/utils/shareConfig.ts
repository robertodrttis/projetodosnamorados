import LZString from 'lz-string'
import { defaultConfig } from '../config/defaults'
import type { SiteConfig } from '../types/siteConfig'

const HASH_PREFIX = 'p='

export type ShareableConfig = Omit<SiteConfig, 'music' | 'reasons' | 'musicScreen'>

export function toShareableConfig(cfg: SiteConfig): ShareableConfig {
  const { music: _music, reasons: _reasons, musicScreen: _musicScreen, ...shareable } = cfg
  return shareable
}

export function mergeWithDefaults(partial: ShareableConfig): SiteConfig {
  return {
    ...defaultConfig,
    ...partial,
    photos: { ...partial.photos },
  }
}

export function encodeConfigToHash(cfg: SiteConfig): string {
  const json = JSON.stringify(toShareableConfig(cfg))
  return HASH_PREFIX + LZString.compressToEncodedURIComponent(json)
}

export function parseConfigFromHash(hash: string): SiteConfig | null {
  const raw = hash.replace(/^#/, '')
  if (!raw.startsWith(HASH_PREFIX)) return null

  try {
    const compressed = raw.slice(HASH_PREFIX.length)
    const json = LZString.decompressFromEncodedURIComponent(compressed)
    if (!json) return null

    const partial = JSON.parse(json) as ShareableConfig
    if (!partial.herName || !partial.photos?.entry || !partial.photos?.music) return null

    return mergeWithDefaults(partial)
  } catch {
    return null
  }
}

export function buildShareUrl(cfg: SiteConfig): string {
  const base = window.location.origin + window.location.pathname
  return `${base}#${encodeConfigToHash(cfg)}`
}
