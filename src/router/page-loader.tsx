import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import type { ComponentType } from 'react'

type PageModule = {
  default: ComponentType
}

type PageLoader = () => Promise<PageModule>

const pageLoaders = Object.fromEntries(
  Object.entries(import.meta.glob<PageModule>('../pages/**/index.tsx')).map(
    ([path, loader]) => [normalizePageKey(path), loader],
  ),
) as Record<string, PageLoader>

const pageComponentCache = new Map<string, ComponentType>()

function normalizePageKey(filePath: string) {
  return filePath.replace(/^..\/pages\//, '').replace(/\/index\.tsx$/, '/index')
}

function getResolvedPageKey(componentKey: string) {
  if (pageLoaders[componentKey]) {
    return componentKey
  }

  return 'error/404/index'
}

function createLazyPage(pageKey: string) {
  const loader = pageLoaders[pageKey]
  const LazyPage = lazy(loader)

  function LazyPageRoute() {
    return (
      <Suspense
        fallback={
          <div className="page-loading">
            <Spin size="large" />
          </div>
        }
      >
        <LazyPage />
      </Suspense>
    )
  }

  LazyPageRoute.displayName = `LazyPageRoute(${pageKey})`
  return LazyPageRoute
}

export function resolvePageComponent(componentKey: string) {
  const pageKey = getResolvedPageKey(componentKey)
  const cached = pageComponentCache.get(pageKey)

  if (cached) {
    return cached
  }

  const component = createLazyPage(pageKey)
  pageComponentCache.set(pageKey, component)
  return component
}
