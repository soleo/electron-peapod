#!/bin/bash

# Install ImageMagick first
# brew install ImageMagick

# convert png to ico image for Windows
convert ../static/Icon.png  -bordercolor white -border 0 \
		  \( -clone 0 -resize 256x256 \) \
		  -delete 0 -alpha off -colors 256 ../static/Icon.ico

# convert to icns image for macOS
# From https://github.com/bitboss-ca/png2icns/blob/master/png2icns.sh
SIPS='/usr/bin/sips'
ICONUTIL='/usr/bin/iconutil'

SOURCE=../static/Icon.png
# Resample image into iconset
NAME=$(basename "${SOURCE}")
EXT="${NAME##*.}"
BASE="${NAME%.*}"
ICONSET="${BASE}.iconset"

mkdir "${ICONSET}"
$SIPS -s format png --resampleWidth 1024 "${SOURCE}" --out "${ICONSET}/icon_512x512@2x.png" > /dev/null 2>&1
$SIPS -s format png --resampleWidth 512 "${SOURCE}" --out "${ICONSET}/icon_512x512.png" > /dev/null 2>&1
cp  "${ICONSET}/icon_512x512.png"  "${ICONSET}/icon_256x256@2x.png"
$SIPS -s format png --resampleWidth 256 "${SOURCE}" --out "${ICONSET}/icon_256x256.png" > /dev/null 2>&1
cp  "${ICONSET}/icon_256x256.png"  "${ICONSET}/icon_128x128@2x.png"
$SIPS -s format png --resampleWidth 128 "${SOURCE}" --out "${ICONSET}/icon_128x128.png" > /dev/null 2>&1
$SIPS -s format png --resampleWidth 64 "${SOURCE}" --out "${ICONSET}/icon_32x32@2x.png" > /dev/null 2>&1
$SIPS -s format png --resampleWidth 32 "${SOURCE}" --out "${ICONSET}/icon_32x32.png" > /dev/null 2>&1
cp  "${ICONSET}/icon_32x32.png"  "${ICONSET}/icon_16x16@2x.png"
$SIPS -s format png --resampleWidth 16 "${SOURCE}" --out "${ICONSET}/icon_16x16.png" > /dev/null 2>&1

# Create an icns file from the iconset
$ICONUTIL -c icns "${ICONSET}"

mv Icon.icns ../static
# Clean up the iconset
rm -rf "${ICONSET}"
