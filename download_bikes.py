
import urllib.request
import json
import os

bikes = {
    'himalayan450': 'Royal_Enfield_Himalayan_450',
    'himalayan411': 'Royal_Enfield_Himalayan',
    'speed400': 'Triumph_Speed_400',
    'scrambler': 'Triumph_Scrambler_400_X',
    'guerrilla': 'Royal_Enfield_Guerrilla_450',
    'cbr1000rr': 'Honda_CBR1000RR',
    'street_triple': 'Triumph_Street_Triple',
    'z900': 'Kawasaki_Z900'
}

for name, title in bikes.items():
    try:
        url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + urllib.parse.quote(title) + '&prop=pageimages&format=json&pithumbsize=800'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        data = json.loads(urllib.request.urlopen(req).read())
        pages = data['query']['pages']
        img_url = None
        for page_id in pages:
            if 'thumbnail' in pages[page_id]:
                img_url = pages[page_id]['thumbnail']['source']
        if img_url:
            print(f'Found {name}: {img_url}')
            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with open(f'frontend/src/assets/{name}.jpg', 'wb') as f:
                f.write(urllib.request.urlopen(img_req).read())
            print(f'Downloaded {name}')
        else:
            print(f'No image for {name}')
    except Exception as e:
        print(f'Failed {name}: {e}')

