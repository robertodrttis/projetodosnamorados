import type { SiteConfig } from '../types/siteConfig'

/** Valores genéricos — conteúdo real vem do link personalizado. */
export const defaultConfig: SiteConfig = {
  herName: '',
  yourName: '',
  whatsappNumber: '',
  whatsappMessage: 'Oi, quero receber meu presente',

  photos: {
    entry: '/images/placeholder.svg',
    music: '/images/placeholder.svg',
  },

  music: {
    src: '/music/Imagine Dragons - Not Today (Audio).mp3',
    title: 'Not Today',
    artist: 'Imagine Dragons',
  },

  entryQuote:
    'Algumas pessoas merecem algo especial antes mesmo de receberem um título.',

  letter: '',

  reasons: [
    'Seu jeito único',
    'Seu sorriso',
    'Nossas conversas',
    'Sua companhia',
    'O jeito que você faz meus dias melhores',
    'A vontade que você desperta em mim de conhecer você mais e mais',
  ],

  musicScreen: {
    message: [
      'Toda história merece uma trilha sonora.',
      'E essa me fez lembrar de você.',
    ],
  },

  gift: '',
}
