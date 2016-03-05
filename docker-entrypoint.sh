#!/bin/bash
set -e

# set env variables
if [ -z "$SELENIUM_URL" ]; then
    echo "SELENIUM_URL environment variable required"
    exit 1
fi

if [ -z "$IPM_HOST" ]; then
    echo "IPM_HOST environment variable required"
    exit 1
fi

if [ -z "$IPM_PORT" ]; then
    echo "IPM_PORT environment variable required"
    exit 1
fi

if [ -z "$DCM_URL" ]; then
    echo "DCM_URL environment variable required"
    exit 1
fi

# patching config
sed -i "s#\"remote\":.*#\"remote\": \"${SELENIUM_URL}\",#g" test/lib/config.json
sed -i "s#\"server\.hostname\":.*#\"server\.hostname\": \"${IPM_HOST}\",#g" test/lib/config.json
sed -i "s#\"ipm\.port\":.*#\"ipm\.port\": \"${IPM_PORT}\",#g" test/lib/config.json
sed -i "s#\"dcm\.url\":.*#\"dcm\.url\": \"${DCM_URL}\",#g" test/lib/config.json

echo "USING SELENIUM: ${SELENIUM_URL}"
echo "USING IPM: ${IPM_HOST}:${IPM_PORT}"
echo "USING DCM: ${DCM_URL}"

# execute mocha with parameters
exec mocha "$@" test
