mkdir -p ./server/build
ls
cd ./shared/http && npm i --ci && npm run build && cd ../../client && npm i --ci && npm run build && cd ../server && npm i --ci && npm run build
