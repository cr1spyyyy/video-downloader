FROM python:3.10

# Instalacja FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Kopiujemy plik z zależnościami i instalujemy je
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# kopiowanie kodu backendu
COPY . .

# folder na pobrane pliki
RUN mkdir -p downloads

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]