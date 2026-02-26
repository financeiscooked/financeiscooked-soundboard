// IndexedDB storage for custom sounds

const DB_NAME = 'financeiscooked-soundboard'
const DB_VERSION = 1
const STORE_NAME = 'sounds'
const CONFIG_STORE = 'config'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(CONFIG_STORE)) {
        db.createObjectStore(CONFIG_STORE, { keyPath: 'id' })
      }
    }
  })
}

// Save a custom sound (audio file as ArrayBuffer + metadata)
export async function saveCustomSound(slotId, file) {
  const db = await openDB()
  const arrayBuffer = await file.arrayBuffer()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put({
      id: slotId,
      name: file.name.replace(/\.[^.]+$/, '').toUpperCase(),
      data: arrayBuffer,
      type: file.type,
      originalName: file.name,
    })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Get a custom sound by slot ID
export async function getCustomSound(slotId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(slotId)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

// Get all custom sounds
export async function getAllCustomSounds() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Delete a custom sound (revert to default)
export async function deleteCustomSound(slotId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(slotId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Save button config (custom label, color)
export async function saveButtonConfig(slotId, config) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CONFIG_STORE, 'readwrite')
    const store = tx.objectStore(CONFIG_STORE)
    store.put({ id: slotId, ...config })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Get button config
export async function getButtonConfig(slotId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CONFIG_STORE, 'readonly')
    const store = tx.objectStore(CONFIG_STORE)
    const request = store.get(slotId)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

// Get all button configs
export async function getAllButtonConfigs() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CONFIG_STORE, 'readonly')
    const store = tx.objectStore(CONFIG_STORE)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
