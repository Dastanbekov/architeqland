FROM python:3.10-slim

# Install git, ssh-client, and docker CLI (for executor agent to run docker compose)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    openssh-client \
    curl \
    && curl -fsSL https://get.docker.com | sh \
    && pip install --no-cache-dir aider-chat \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure git to not prompt for credentials
RUN git config --global credential.helper store \
    && git config --global user.email "bot@architeq.tech" \
    && git config --global user.name "Architeq Bot"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Run migrations then start Daphne (ASGI) for WebSocket + HTTP support
CMD sh -c "python manage.py makemigrations --noinput && python manage.py migrate --noinput && daphne -b 0.0.0.0 -p 8000 config.asgi:application"
