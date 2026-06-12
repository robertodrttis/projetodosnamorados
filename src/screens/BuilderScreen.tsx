import { useState } from 'react'
import { buildPresentUrl, savePresent } from '../api/presentes'
import { defaultConfig } from '../config/defaults'
import { useSiteConfig } from '../context/SiteConfigContext'
import type { SiteConfig } from '../types/siteConfig'
import { compressImage } from '../utils/imageCompress'
import { buildShareUrl, toShareableConfig } from '../utils/shareConfig'
import './builder.css'

interface BuilderScreenProps {
  onStart: (cfg: SiteConfig) => void
}

interface FormState {
  herName: string
  yourName: string
  entryQuote: string
  letter: string
  gift: string
  whatsappNumber: string
  whatsappMessage: string
  photoEntry: string
  photoMusic: string
}

const emptyForm: FormState = {
  herName: '',
  yourName: '',
  entryQuote: defaultConfig.entryQuote,
  letter: '',
  gift: '',
  whatsappNumber: '',
  whatsappMessage: 'Oi, quero receber meu presente',
  photoEntry: '',
  photoMusic: '',
}

export function BuilderScreen({ onStart }: BuilderScreenProps) {
  const { setConfig } = useSiteConfig()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handlePhoto = async (field: 'photoEntry' | 'photoMusic', file: File | undefined) => {
    if (!file) return
    try {
      const dataUrl = await compressImage(file)
      update(field, dataUrl)
    } catch {
      setError('Não foi possível processar uma das fotos. Tente outra imagem.')
    }
  }

  const buildConfig = (): SiteConfig | null => {
    if (!form.herName.trim()) return null
    if (!form.yourName.trim()) return null
    if (!form.letter.trim()) return null
    if (!form.gift.trim()) return null
    if (!form.photoEntry || !form.photoMusic) return null
    if (!form.whatsappNumber.trim()) return null
    if (!form.whatsappMessage.trim()) return null

    return {
      ...defaultConfig,
      herName: form.herName.trim(),
      yourName: form.yourName.trim(),
      entryQuote: form.entryQuote.trim() || defaultConfig.entryQuote,
      letter: form.letter.trim(),
      gift: form.gift.trim(),
      whatsappNumber: form.whatsappNumber.replace(/\D/g, ''),
      whatsappMessage: form.whatsappMessage.trim(),
      photos: {
        entry: form.photoEntry,
        music: form.photoMusic,
      },
    }
  }

  const handleGenerate = async () => {
    const cfg = buildConfig()
    if (!cfg) {
      setError('Preencha todos os campos obrigatórios e anexe as 2 fotos.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const shareable = toShareableConfig(cfg)
      const id = await savePresent(shareable)
      const url = buildPresentUrl(id)

      setShareUrl(url)
      window.history.replaceState({}, '', `?p=${id}`)
      setConfig(cfg)
    } catch {
      try {
        const url = buildShareUrl(cfg)
        setShareUrl(url)
        setConfig(cfg)
        setError(
          'Servidor indisponível — link gerado no modo local. Use "netlify dev" ou faça deploy no Netlify para links permanentes.',
        )
      } catch {
        setError('Erro ao gerar o presente. Tente fotos menores.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    const cfg = buildConfig()
    if (!cfg) {
      setError('Preencha todos os campos obrigatórios e anexe as 2 fotos.')
      return
    }
    setConfig(cfg)
    onStart(cfg)
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setError('Não foi possível copiar. Selecione o link manualmente.')
    }
  }

  return (
    <section className="builder screen--fade">
      <h1 className="builder__title text-glow">Crie seu presente ❤️</h1>
      <p className="builder__subtitle">
        Personalize fotos, textos e WhatsApp. Gere o link e envie para ela — funciona em qualquer
        celular.
      </p>

      <form className="builder__form" onSubmit={(e) => e.preventDefault()}>
        <div className="builder__row">
          <label className="builder__label">
            Nome dela *
            <input
              value={form.herName}
              onChange={(e) => update('herName', e.target.value)}
              placeholder="Ex: Clara"
            />
          </label>
          <label className="builder__label">
            Seu nome *
            <input
              value={form.yourName}
              onChange={(e) => update('yourName', e.target.value)}
              placeholder="Ex: José Bryan"
            />
          </label>
        </div>

        <label className="builder__label">
          Frase de abertura
          <input
            value={form.entryQuote}
            onChange={(e) => update('entryQuote', e.target.value)}
            placeholder="Algumas pessoas merecem algo especial..."
          />
        </label>

        <div className="builder__photos">
          <label className="builder__photo-upload">
            <span>Foto 1 — tela inicial (coração) *</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhoto('photoEntry', e.target.files?.[0])}
            />
            {form.photoEntry && <img src={form.photoEntry} alt="Preview entrada" />}
          </label>

          <label className="builder__photo-upload">
            <span>Foto 2 — tela da música *</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhoto('photoMusic', e.target.files?.[0])}
            />
            {form.photoMusic && <img src={form.photoMusic} alt="Preview música" />}
          </label>
        </div>

        <label className="builder__label">
          Texto romântico 1 — a carta *
          <textarea
            value={form.letter}
            onChange={(e) => update('letter', e.target.value)}
            rows={8}
            placeholder="Escreva a carta que aparece com efeito de máquina de escrever..."
          />
        </label>

        <label className="builder__label">
          Texto romântico 2 — presente final *
          <textarea
            value={form.gift}
            onChange={(e) => update('gift', e.target.value)}
            rows={8}
            placeholder="A mensagem impactante do final, antes do WhatsApp..."
          />
        </label>

        <div className="builder__row">
          <label className="builder__label">
            WhatsApp (com DDI) *
            <input
              value={form.whatsappNumber}
              onChange={(e) => update('whatsappNumber', e.target.value)}
              placeholder="Ex: 5585996171649"
            />
          </label>
          <label className="builder__label">
            Mensagem do WhatsApp *
            <input
              value={form.whatsappMessage}
              onChange={(e) => update('whatsappMessage', e.target.value)}
              placeholder="Oi, quero receber meu presente"
            />
          </label>
        </div>

        {error && <p className="builder__error">{error}</p>}

        <div className="builder__actions">
          <button
            className="screen__btn glow-red"
            type="button"
            onClick={handleGenerate}
            disabled={saving}
          >
            {saving ? 'Salvando...' : '❤️ Gerar link do presente'}
          </button>
        </div>
      </form>

      {shareUrl && (
        <div className="builder__share fade-in">
          <p className="builder__share-label">Pronto! Copie e envie este link para ela:</p>
          <input className="builder__share-input" readOnly value={shareUrl} />
          <div className="builder__share-actions">
            <button className="builder__btn-secondary" type="button" onClick={handleCopy}>
              {copied ? '✓ Link copiado!' : '📋 Copiar link'}
            </button>
            <button className="screen__btn glow-red" type="button" onClick={handlePreview}>
              👀 Visualizar presente
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
