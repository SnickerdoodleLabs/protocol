import urllib.request, json
print("fetching data from api.coingecko.com...")
with urllib.request.urlopen("https://api.coingecko.com/api/v3/coins/list?include_platform=true")  as url:
    data = json.load(url)

print("modifying data format...")
response={}
for d in data:
    for p in d['platforms']:
        temp={**d}
        del temp['platforms']
        response[d['platforms'][p]]=temp

print("writing to file...")
with open('data.json', 'w') as f:
    json.dump(response, f)
