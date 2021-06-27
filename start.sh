green=`tput setaf 2`
reset=`tput sgr0`

echo "${green}Starting all build processes..."
echo "||----------------------------------------------------------||${reset}"
cd shared/http && npm run start & cd server && npm run start & cd client && npm run start
