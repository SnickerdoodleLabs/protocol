import urllib.request, json
with urllib.request.urlopen("https://api.coingecko.com/api/v3/coins/list?include_platform=true")  as url:
    data = json.load(url)

response={}
for d in data:
    for p in d['platforms']:
        temp={**d}
        del temp['platforms']
        response[d['platforms'][p]]=temp

print(response)
with open('data.json', 'w') as f:
    json.dump(response, f)
