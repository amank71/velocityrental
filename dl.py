
import urllib.request
import json
import re

speed_url = 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141075/speed-400-right-side-view-7.jpeg?isig=0'
scrambler_url = 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141077/scrambler-400-x-right-side-view-8.jpeg?isig=0'

req = urllib.request.Request(speed_url, headers={'User-Agent': 'Mozilla/5.0'})
with open('frontend/src/assets/speed400.jpg', 'wb') as f:
    f.write(urllib.request.urlopen(req).read())

req = urllib.request.Request(scrambler_url, headers={'User-Agent': 'Mozilla/5.0'})
with open('frontend/src/assets/scrambler.jpg', 'wb') as f:
    f.write(urllib.request.urlopen(req).read())

print('Downloaded real speed400 and scrambler images from BikeWale!')

