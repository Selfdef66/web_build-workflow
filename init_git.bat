@echo off
set PATH=C:\Windows\system32;C:\Windows;C:\Program Files\Git\cmd;C:\Program Files\Git\bin
cd /d "g:\Website\workflow"
git init
git config user.name "selfdef66"
git config user.email "924694530@qq.com"
git add .
git commit -m "Initial commit"
echo Git repository initialized successfully!