import urllib.request, json
print("fetching data from api.coingecko.com...")
with urllib.request.urlopen("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=300&page=1")  as url:
    data = json.load(url)


print("modifying data format...")
response={}
for d in data:
    response[d['id']] = d


print("writing to file...")
with open('data.json', 'w') as f:
    json.dump(response, f)