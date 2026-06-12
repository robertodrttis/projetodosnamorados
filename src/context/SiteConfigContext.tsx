import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchPresent, getPresentIdFromUrl } from '../api/presentes'
import { defaultConfig } from '../config/defaults'
import type { SiteConfig } from '../types/siteConfig'
import { mergeWithDefaults, parseConfigFromHash } from '../utils/shareConfig'

interface SiteConfigContextValue {
  config: SiteConfig
  setConfig: (cfg: SiteConfig) => void
  isShared: boolean
  loading: boolean
  loadError: string | null
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [isShared, setIsShared] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const presentId = getPresentIdFromUrl()

      if (presentId) {
        try {
          const data = await fetchPresent(presentId)
          if (!cancelled) {
            setConfig(mergeWithDefaults(data))
            setIsShared(true)
          }
        } catch {
          if (!cancelled) {
            setLoadError('Presente não encontrado. Verifique se o link está correto.')
          }
        } finally {
          if (!cancelled) setLoading(false)
        }
        return
      }

      const fromHash = parseConfigFromHash(window.location.hash)
      if (fromHash) {
        setConfig(fromHash)
        setIsShared(true)
      }

      setLoading(false)
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({ config, setConfig, isShared, loading, loadError }),
    [config, isShared, loading, loadError],
  )

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) throw new Error('useSiteConfig deve ser usado dentro de SiteConfigProvider')
  return ctx
}
