#!/bin/bash

git pull && npm i && npm run build && npm run seed:table && npm run seed:data && pm2 reload catalog