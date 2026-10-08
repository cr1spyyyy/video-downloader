import { useState } from 'react'

// Struktura metadanych zwracana z backendu
interface VideoInfo {
  title: string
  thumbnail: string
  duration: number
  uploader: string
}

export default function App() {
  const [url, setUrl] = useState<string>('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [sites, setSites] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [loadingSites, setLoadingSites] = useState<boolean>(false)

  // Pobieranie metadanych filmu z backendu (/api/info)
  const handleGetInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setVideoInfo(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Nie udało się pobrać informacji o wideo.')
      }

      const data: VideoInfo = await response.json()
      setVideoInfo(data)
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas połączenia z serwerem.')
    } finally {
      setLoading(false)
    }
  }

  // Pobieranie filmu z backendu (/api/download)
  const handleDownload = async () => {
    if (!url.trim()) return

    setDownloading(true)
    setError(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Nie udało się pobrać pliku.')
      }

      // Odbieramy plik jako strumień danych (Blob)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      // Tworzymy ukryty link do pobrania pliku w przeglądarce
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = videoInfo ? `${videoInfo.title}.mp4` : 'video.mp4'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err: any) {
      setError(err.message || 'Błąd podczas pobierania pliku.')
    } finally {
      setDownloading(false)
    }
  }

  const handleSupportedSites = async () => {
    if (isModalOpen) {
      setIsModalOpen(false)
      return
    }
    setIsModalOpen(true)

    if (sites.length > 0) return

    setLoadingSites(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/supported-sites')
      const data = await response.json()
      setSites(data.supported_sites)
    } catch (err: any) {
      setError(err.message || 'Nie udało się pobrać listy obsługiwanych stron.')
    } finally {
      setLoadingSites(false)
    }
  }

  // formatowanie sekund na minuty i sekundy
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Video Downloader
        </h1>

      <div className="text-center mb-6">
        <button
          type="button"
          onClick={handleSupportedSites}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-slate-600 text-black font-bold rounded-lg transition duration-200"
        >
          Pokaż obsługiwane serwisy
        </button>
      </div>

        {/* Formularz wpisywania adresu URL */}
        <form onSubmit={handleGetInfo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Wklej link z YouTube lub X (Twitter)..."
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-lg transition duration-200"
          >
            {loading ? 'Pobieranie...' : 'Szukaj'}
          </button>
          
        </form>

        {/* Obsługa błędów */}
        {error && (
          <div className="p-4 mb-6 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* info o wskazanym filmie */}
        {videoInfo && (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{videoInfo.title}</h2>
            <div className="flex justify-between text-slate-300 text-sm mb-6">
              <span>Autor: {videoInfo.uploader}</span><br></br>
              <span>Czas: {formatDuration(videoInfo.duration)}</span>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {downloading ? 'Pobieranie pliku MP4...' : 'Pobierz Wideo (MP4)'}
            </button>
          </div>
        )}
      </div>

      {/* modal z lista serwisów */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            {/* Nagłówek modala */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">
                Obsługiwane serwisy {sites.length > 0 && `(${sites.length})`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 rounded-lg hover:bg-slate-700 transition"
              >
                ✕
              </button>
            </div>

            {/* lista serwisów */}
            {loadingSites ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-slate-400">Pobieranie listy serwisów...</p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 pr-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-300">
                {sites.map((site) => (
                  <div
                    key={site}
                    className="bg-slate-700/50 p-2 rounded-lg border border-slate-600/40 truncate text-center capitalize hover:bg-slate-700 transition"
                  >
                    {site}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}