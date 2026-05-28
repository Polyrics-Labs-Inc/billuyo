export class ApiClient {
  private baseUrl: string
  readonly isEnabled: boolean

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.isEnabled = baseUrl.length > 0
  }

  async request(method: string, path: string, body?: unknown): Promise<void> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const userId = this.readUserId()
    if (userId) headers['X-User-Id'] = userId

    const options: RequestInit = { method, headers }
    if (body !== undefined) options.body = JSON.stringify(body)

    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`API ${method} ${path} → ${response.status}`)
    }
  }

  private readUserId(): string | undefined {
    try {
      const raw = localStorage.getItem('billuyo:settings')
      if (raw) {
        const settings = JSON.parse(raw)
        return settings.userId
      }
    } catch { /* ignore */ }
    return undefined
  }
}
