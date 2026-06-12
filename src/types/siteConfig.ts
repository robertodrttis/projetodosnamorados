export interface SiteConfig {
  herName: string
  yourName: string
  whatsappNumber: string
  whatsappMessage: string
  entryQuote: string
  letter: string
  gift: string
  photos: {
    entry: string
    music: string
  }
  reasons: string[]
  musicScreen: {
    message: string[]
  }
  music: {
    src: string
    title: string
    artist: string
  }
}

export function getWhatsAppUrl(cfg: SiteConfig) {
  const text = encodeURIComponent(cfg.whatsappMessage)
  return `https://wa.me/${cfg.whatsappNumber.replace(/\D/g, '')}?text=${text}`
}
