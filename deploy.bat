@echo off
echo Killing any running Anvil processes...
taskkill /F /IM anvil.exe >nul 2>&1

echo Starting Anvil...
start cmd /k "anvil"

timeout /t 3 /nobreak

echo Deploying with Forge and extracting contract addresses...

forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 | node watchDeploy.js

pause
