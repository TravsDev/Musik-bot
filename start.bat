@echo off
@title Danske Developer musik bot

echo.
echo Dette kan tage flere sekunder!

echo.
echo %time% : Leder efter index.js

timeout /t 2 >nul
echo %time% : Cleared!
echo %time% : Starter din discord bot
node index.js
echo %time% : Index shutdown
timeout /t 2 >nul
echo %time% : Prøver at genstarte discord bot...
timeout /t 3 >nul
echo.

PAUSE