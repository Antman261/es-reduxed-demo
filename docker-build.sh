mkdir -p ./server/build
ls
cd ./shared/http && npm ci && npm run build && cd ../../client && npm i && npm run build && cd ../server && npm ci && npm run build
