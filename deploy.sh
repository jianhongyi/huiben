#!/bin/bash

echo -e '------- ready to deploy -------\n'
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_17zy_wyh_rsa

git pull
echo -e '------- npm install -------\n'
npm install --no-audit --ignore-scripts
npm rebuild node-sass
echo -e '------- npm install done -------\n'
echo -e '------- building -------\n'
export BUILD_STAGE=production && npm run build || exit 1
echo -e '------- building done -------\n'
echo -e '------- moving files -------\n'
cp -r ./dist/. /usr/local/nginx/html/ || exit 1
echo -e '------- deploy done -------\n'
