# Dockerfile dla backendu
FROM python:3.9-slim

# Ustawienie katalogu roboczego
WORKDIR /app

# Skopiowanie pliku requirements.txt i zainstalowanie zależności
COPY requirements.txt .
RUN pip install -r requirements.txt

# Skopiowanie pozostałych plików aplikacji
COPY . .

# Eksportowanie portu, na którym działa aplikacja
EXPOSE 5000

# Komenda do uruchomienia aplikacji Flask
CMD ["python", "app.py"]
