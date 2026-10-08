import os
import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# inizjalizacja FastAPI
app = FastAPI(title="Video downloader API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class VideoRequest(BaseModel):
    url: str
    pass 

@app.post("/api/info")
def get_video_info(video_request: VideoRequest):
    """
    Pobiera i zwraca wybrane informacje o wideo z podanego URL.
    """

    ydl_opts ={
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_request.url, download=False)

            return {
                "title": info_dict.get('title', None),
                "thumbnail": info_dict.get('thumbnail', None),
                "duration": info_dict.get('duration', None),
                "uploader": info_dict.get('uploader', None),
            }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"BŁAD: {str(e)}")


@app.post("/api/download")
def download_video(video_request: VideoRequest):
    """
    Pobiera wideo z podanego URL i zapisuje je do folderu downloads.
    """

    output_template = 'downloads/%(title)s.%(ext)s'

    ydl_opts = {
        'outtmpl': output_template,
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_request.url, download=True)
            file_path = ydl.prepare_filename(info_dict)

            return FileResponse(
                file_path,
                media_type='application/octet-stream', 
                filename=os.path.basename(file_path))
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"BŁAD: {str(e)}")


if __name__ == "__main__":
        import uvicorn
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)