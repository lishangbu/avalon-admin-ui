/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_NAME: string
  readonly VITE_WATERMARK_CONTENT: string
  readonly VITE_BASE_API_TIMEOUT: string
  readonly VITE_BASE_API_TIMEOUT: number
  readonly VITE_APP_ENABLE_MOCK: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
