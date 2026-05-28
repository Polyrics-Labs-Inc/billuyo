export function useDataExport() {
  function download(data: string, filename: string = 'billuyo-export.json') {
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function importFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      }
      input.click()
    })
  }

  return { download, importFile }
}
