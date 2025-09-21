/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_WATERMARK: string
  readonly VITE_APP_BASE_API_URL: string
  readonly VITE_APP_BASE_API_TIMEOUT: number
  readonly VITE_APP_ENABLE_MOCK: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
