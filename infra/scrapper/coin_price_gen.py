import urllib.request, json
print("fetching data from api.coingecko.com...")
with urllib.request.urlopen("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=300&page=1")  as page1:
    page1_data = json.load(page1)
with urllib.request.urlopen("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=300&page=2")  as page2:
    page2_data = json.load(page2)
with urllib.request.urlopen("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=xdai,weth,usd&order=market_cap_desc&per_page=300&page=1")  as specialData:
    specialData = json.load(specialData)


print("modifying data format...")
response={}
for d in page1_data:
    response[d['id']] = d
for d2 in page2_data:
    response[d2['id']] = d2
for val in specialData:
    response[val['id']] = val



print("writing to file...")
with open('data.json', 'w') as f:
    json.dump(response, f)