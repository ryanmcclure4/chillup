#!/bin/sh

echo "BUILDING PROJECT..."
meteor build ../build
cd /home/captain/chillup/
echo "COPYING TO SERVER..."
scp -i "_chillup.pem" build/chillup.tar.gz ubuntu@52.38.35.105:/home/ubuntu/chillup
echo "DEPLOY ON SERVER..."
ssh -i "_chillup.pem" ubuntu@52.38.35.105 "/home/ubuntu/chillup/deploy.sh"
