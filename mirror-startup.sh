#!/bin/bash

/usr/lib/chromium-browser/chromium-browser --noerrdialogs --kiosk --incognito "http://localhost:8000" &
/home/pi/dev/mirror/manage.py runserver 0.0.0.0:8000 &
wait