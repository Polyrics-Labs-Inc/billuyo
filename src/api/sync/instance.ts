import { ApiClient } from '../client'
import { SyncQueue } from './queue'
import { SyncEngine } from './engine'

const apiClient = new ApiClient(import.meta.env.VITE_API_URL || '')
const syncQueue = new SyncQueue()

export const syncEngine = new SyncEngine(apiClient, syncQueue)
