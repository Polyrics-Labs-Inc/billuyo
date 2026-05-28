export class ApiClient {
  private baseUrl: string
  readonly isEnabled: boolean

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.isEnabled = baseUrl.length > 0
  }

  async request(method: string, path: string, body?: unknown): Promise<void> {
    const url = `${this.baseUrl}${path}`
    const options: RequestInit = { method, headers: { 'Content-Type': 'application/json' } }
    if (body !== undefined) options.body = JSON.stringify(body)

    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`API ${method} ${path} → ${response.status}`)
    }
  }
}
