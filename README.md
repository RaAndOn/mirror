
SETUP POSGRES DATABASE AND SERVER
Need to `sudo apt-get install libpq-dev` to get posgresql to work
`sudo apt-get install python-pip python-dev libpq-dev postgresql postgresql-contrib`
https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-django-application-on-ubuntu-14-04

SETUP DB:
```
  CREATE DATABASE kiosk;
  CREATE USER kioskuser WITH PASSWORD 'password';
  ALTER ROLE kioskuser SET client_encoding TO 'utf8';
  ALTER ROLE kioskuser SET default_transaction_isolation TO 'read committed';
  ALTER ROLE kioskuser SET timezone TO 'UTC';
  GRANT ALL PRIVILEGES ON DATABASE kiosk TO kioskuser;


  \q
  exit
```

On Raspberry Pi to get pillow to work
`sudo apt-get install libjpeg8-dev`

To go to db on command line:

```
	sudo su - postgres
	psql
	\connect kiosk;
```

ACTIVATE VIRTUALENV
source mirror/kiosk/kiosknv/bin/activate

IPython is a debugger. learn to use it

PLAN:
overhaul to use / learn backbone.js
http://backbonejs.org/#examples
http://backbonejs.org/docs/todos.html

Weather Icons courtesy of: https://www.iconfinder.com/iconsets/weather-collection-1