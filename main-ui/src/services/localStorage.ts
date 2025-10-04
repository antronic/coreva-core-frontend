//
const COREVE_APP_PREFIX = 'convera-'

// Key types
const SESSION_KEY = 'session'
const USER_KEY = 'user'

type StorageKey = typeof SESSION_KEY | typeof USER_KEY

const localStorageService = {
  getItem: (key: StorageKey): string | null => {
    return localStorage.getItem(`${COREVE_APP_PREFIX}${key}`)
  },
  setItem: (key: StorageKey, value: string): void => {
    localStorage.setItem(`${COREVE_APP_PREFIX}${key}` , value)
  },
  removeItem: (key: StorageKey): void => {
    localStorage.removeItem(`${COREVE_APP_PREFIX}${key}`)
  },
  clear: (): void => {
    localStorage.clear()
  },
  removeItemManual: (fullKey: string): void => {
    localStorage.removeItem(fullKey)
  },
}

export default localStorageService