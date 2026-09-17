@echo off
setlocal
title Taller y Simulador de Texto Instructivo
cd /d "%~dp0app"

echo ====================================================================
echo  Taller y Simulador de Texto Instructivo - 1.o Bachillerato Tecnico
echo ====================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js en este equipo.
  echo         Instalalo desde https://nodejs.org y vuelve a ejecutar
  echo         este archivo.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Instalando dependencias. Esto solo ocurre la primera vez...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la instalacion de dependencias.
    pause
    exit /b 1
  )
)

rem Se sirve la version compilada, no el servidor de desarrollo:
rem arranca mas rapido en los equipos del laboratorio.
if not exist "dist\index.html" (
  echo Generando la version optimizada del taller...
  call npm run build
  if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la compilacion.
    pause
    exit /b 1
  )
)

echo.
echo Iniciando servidor local...
start "servidor-taller" /MIN cmd /c "npm run preview"

rem Esperar a que el puerto responda ANTES de abrir el navegador.
rem Antes se abria la pestana de inmediato y el estudiante veia un error.
set /a INTENTOS=0
:esperar
set /a INTENTOS+=1
powershell -NoProfile -Command "try{$c=New-Object Net.Sockets.TcpClient;$c.Connect('127.0.0.1',5173);$c.Close();exit 0}catch{exit 1}" >nul 2>nul
if not errorlevel 1 goto listo
if %INTENTOS% GEQ 40 (
  echo.
  echo [ERROR] El servidor no respondio en el puerto 5173.
  echo         Revisa que ningun otro programa lo este usando.
  pause
  exit /b 1
)
timeout /t 1 /nobreak >nul
goto esperar

:listo
echo Servidor listo. Abriendo el navegador...
start "" http://localhost:5173
echo.
echo ====================================================================
echo  El taller esta abierto en http://localhost:5173
echo  NO CIERRES ESTA VENTANA mientras uses el simulador.
echo  Para terminar, cierra esta ventana.
echo ====================================================================
echo.
pause >nul
taskkill /FI "WINDOWTITLE eq servidor-taller*" /T /F >nul 2>nul
endlocal
