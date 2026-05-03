#!/bin/bash
# start-dev.sh - Démarre backend et frontend simultanément

echo "🚀 Démarrage du Portfolio Full Stack en mode développement..."
echo ""
echo "Backend démarre sur http://localhost:3001"
echo "Frontend démarre sur http://localhost:5173"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les deux serveurs."
echo ""

# Démarrer le backend
cd backend && npm run dev &
BACKEND_PID=$!

# Attendre un peu que le backend soit prêt
sleep 2

# Démarrer le frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Gérer l'arrêt des deux processus
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '❌ Serveurs arrêtés.'; exit 0" INT

# Attendre indéfiniment
wait
