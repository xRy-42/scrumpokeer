#! /bin/bash
set -euo pipefail

rm -f release.zip

cd frontend && npm run build && cd ..

cd pb_public && zip -r ../release.zip . && cd ..

ssh scrumpokeer "rm -rf scrumpokeer/pb_public/* scrumpokeer/release.zip"

scp ./release.zip scrumpokeer:/home/michael/scrumpokeer/

ssh scrumpokeer "cd scrumpokeer && unzip release.zip -d pb_public/"
