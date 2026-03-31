#!/bin/bash
set -e

# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — Script de deploy para VPS Hostinger
# Uso: ./deploy.sh [branch]
# Exemplo: ./deploy.sh main
# ─────────────────────────────────────────────────────────────────────────────

BRANCH=${1:-main}
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========================================="
echo "  Deploy: web-pokedex"
echo "  Branch: $BRANCH"
echo "  Diretório: $APP_DIR"
echo "========================================="

cd "$APP_DIR"

# 1. Atualizar código
echo ""
echo "[1/5] Atualizando código..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 2. Verificar se .env existe
echo ""
echo "[2/5] Verificando arquivo .env..."
if [ ! -f ".env" ]; then
  echo "ERRO: Arquivo .env não encontrado em $APP_DIR"
  echo "Crie o arquivo .env com as variáveis de ambiente antes de fazer deploy."
  exit 1
fi

# 3. Parar container atual (sem remover volumes)
echo ""
echo "[3/5] Parando container atual..."
docker compose down || true

# 4. Build da nova imagem
echo ""
echo "[4/5] Construindo nova imagem..."
docker compose build --no-cache

# 5. Subir container em background
echo ""
echo "[5/5] Iniciando container..."
docker compose up -d

# Aguardar healthcheck
echo ""
echo "Aguardando aplicação iniciar..."
sleep 5

# Exibir status
docker compose ps
docker compose logs --tail=20

echo ""
echo "========================================="
echo "  Deploy concluído com sucesso!"
echo "  Acesse: http://$(hostname -I | awk '{print $1}'):3000"
echo "========================================="
