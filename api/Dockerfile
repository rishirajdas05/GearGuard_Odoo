FROM python:3.12-slim

# Python runtime settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 🔑 CRITICAL: make /app importable (fixes alembic + app imports)
ENV PYTHONPATH=/app

WORKDIR /app

# System dependencies (psycopg2, Pillow, cryptography, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Ensure start script is executable
RUN chmod +x /app/start.sh

EXPOSE 8000

# Start app (runs alembic + uvicorn/gunicorn)
CMD ["/app/start.sh"]
