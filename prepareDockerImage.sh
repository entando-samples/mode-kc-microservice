#!/bin/sh

echo ""
echo "Building project and Docker image "
#todo export as global variable
#todo manage version
export MY_IMAGE="germanogiudici/entando-bundle-seed-ms-node-kc:0.0.1-SNAPSHOT"

docker build -t ${MY_IMAGE}  .
echo "Built $MY_IMAGE"

echo ""
echo "Uploading $MY_IMAGE to dockerhub"
#docker push $MY_IMAGE


#docker run --rm -p 8081:8081 -e DEBUG="node-kc-microservice:*" --init --name node-ms germanogiudici/entando-bundle-seed-ms-node-kc:0.0.1-SNAPSHOT
