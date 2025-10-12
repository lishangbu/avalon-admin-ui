/**
 * 字典缓存数据结构
 */
interface DictionaryCache {
  data: Record<string, string>
  loading: boolean
  timestamp: number
}

/**
 * 字典缓存存储
 * key: 缓存键名（通常是接口函数名）
 * value: 缓存的字典数据和元信息
 */
const dictionaryCache = new Map<string, DictionaryCache>()

/**
 * 默认缓存过期时间（毫秒）- 5分钟
 */
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000

/**
 * 字典数据管理 Composable
 *
 * 提供字典数据的统一缓存和获取功能，避免重复请求后端
 *
 * @example
 * ```ts
 * const { getDictionary } = useDictionary()
 *
 * // 获取字典数据，会自动缓存（cacheKey 自动从函数名生成）
 * const dict = await getDictionary(listBerryFirmness, 'internalName', 'name')
 * ```
 */
export function useDictionary() {
  /**
   * 根据 API 函数名称自动生成缓存键
   * 例如: listBerryFirmness -> berry-firmness
   */
  function generateCacheKey(api: (params?: any) => Promise<any>): string {
    const functionName = api.name || 'unknown'
    // 移除 list 前缀，转换为 kebab-case
    return functionName
      .replace(/^list/, '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  }

  /**
   * 获取字典数据
   *
   * @param api 字典数据获取接口
   * @param valueField 值字段名（如 id、internalName）
   * @param labelField 标签字段名（如 name、title）
   * @param cacheDuration 缓存时长（毫秒），默认 5 分钟
   * @returns Promise<Record<string, string>> 字典数据键值对
   */
  async function getDictionary(
    api: (params?: any) => Promise<any>,
    valueField: string,
    labelField: string,
    cacheDuration: number = DEFAULT_CACHE_DURATION
  ): Promise<Record<string, string>> {
    const cacheKey = generateCacheKey(api)
    const now = Date.now()
    const cached = dictionaryCache.get(cacheKey)

    // 检查缓存是否有效
    if (cached && !cached.loading && now - cached.timestamp < cacheDuration) {
      console.debug(`[Dictionary Cache] 使用缓存: ${cacheKey}`)
      return cached.data
    }

    // 如果正在加载，等待加载完成
    if (cached?.loading) {
      console.debug(`[Dictionary Cache] 等待加载: ${cacheKey}`)
      // 轮询等待加载完成
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const current = dictionaryCache.get(cacheKey)
          if (current && !current.loading) {
            clearInterval(checkInterval)
            resolve(current.data)
          }
        }, 100)
      })
    }

    // 设置加载状态
    dictionaryCache.set(cacheKey, {
      data: {},
      loading: true,
      timestamp: now
    })

    try {
      console.debug(`[Dictionary Cache] 请求后端: ${cacheKey}`)
      const response = await api({})
      const dataList = response.data || []

      // 将数组转换为键值对对象
      const dict = dataList.reduce((acc: Record<string, string>, item: any) => {
        acc[item[valueField]] = item[labelField]
        return acc
      }, {})

      // 更新缓存
      dictionaryCache.set(cacheKey, {
        data: dict,
        loading: false,
        timestamp: now
      })

      return dict
    } catch (error) {
      console.error(`[Dictionary Cache] 加载失败: ${cacheKey}`, error)
      // 加载失败，移除缓存
      dictionaryCache.delete(cacheKey)
      return {}
    }
  }

  /**
   * 清除指定字典的缓存
   *
   * @param api 字典数据获取接口或缓存键名
   */
  function clearDictionaryCache(api: ((params?: any) => Promise<any>) | string) {
    const cacheKey = typeof api === 'string' ? api : generateCacheKey(api)
    dictionaryCache.delete(cacheKey)
    console.debug(`[Dictionary Cache] 清除缓存: ${cacheKey}`)
  }

  /**
   * 清除所有字典缓存
   */
  function clearAllDictionaryCache() {
    dictionaryCache.clear()
    console.debug('[Dictionary Cache] 清除所有缓存')
  }

  /**
   * 获取缓存统计信息
   */
  function getCacheStats() {
    return {
      size: dictionaryCache.size,
      keys: Array.from(dictionaryCache.keys())
    }
  }

  return {
    getDictionary,
    clearDictionaryCache,
    clearAllDictionaryCache,
    getCacheStats
  }
}
