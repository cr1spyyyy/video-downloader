# Video Downloader 

Aplikacja webowa umożliwiająca pobieranie materiałów wideo z ponad 1800 serwisów (m.in. YouTube, X/Twitter, TikTok) wraz z podglądem metadanych. Projekt działa na bazie **FastAPI**, **yt-dlp** oraz **FFmpeg** po stronie backendu oraz interfejsu w **React (TypeScript, Vite, Tailwind CSS)**, wykorzystując silnik `yt-dlp` do dynamicznego parsowania i strumieniowania plików multimedialnych.

---

## 🚀 Jak uruchomić aplikację?

### Opcja 1: Pobranie kodu z Git (Development)

Wymagania: Zainstalowany Docker Desktop.

1. Sklonuj repozytorium i przejdź do folderu projektu:
   ```bash
   git clone https://github.com/cr1spyyyy/video-downloader.git
   cd video-downloader
   docker compose up --build
   ```
### Opcja 2: Uruchomienie przez Docker

Wymagania: Sam plik docker-compose.yml oraz zainstalowany Docker.
   ```bash
   docker compose up -d
   ```
Otwórz w przeglądarce: http://localhost:5173
