@echo off


start "" http://127.0.0.1:5502



http-server ./ -p 5502 -c-1 --fallback 404.html

::http-server . -p 5502 --spa

::npm install -g http-server 