green=`tput setaf 2`
reset=`tput sgr0`

echo "${green}Welcome to Event Sourcing Reduxified Demo!"
echo "Installing npm packages across client, server, and shared/http"
echo "||----------------------------------------------------------||${reset}"
mkdir -p server/build
cd shared/http && npm i --ci && npm run build && cd ../../client && npm i --ci && npm run build && cd ../server && npm i --ci && npm run build
echo "${green}"
echo "||----------------------------------------------------------||"
echo "Installation complete, here's the commands you need to know:"
echo "  * 'npm run build': Builds all projects"
echo "  * 'npm start': Start all projects in watch mode for easy development"
echo "  * 'npm test': Run tests in all projects"
echo "  * 'npm test:watch': Run tests in watch mode in all projects"
echo ""
echo "View README.md in each directory for additional information${reset}"
