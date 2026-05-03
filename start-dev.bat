@echo off
REM start-dev.bat - Démarre backend et frontend simultanément sur Windows

echo 🚀 Démarrage du Portfolio Full Stack en mode développement...
echo.
echo Backend démarre sur http://localhost:3001
echo Frontend démarre sur http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arrêter les serveurs.
echo.

REM Démarrer le backend dans une nouvelle fenêtre
cd backend
start "Backend Server" cmd /k "npm run dev"

REM Attendre un peu
timeout /t 2 /nobreak

REM Démarrer le frontend dans une nouvelle fenêtre
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

cd ..
echo ✅ Les deux serveurs sont en cours d'exécution dans des fenêtres séparées.
