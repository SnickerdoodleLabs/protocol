# %%
import pandas as pd
from urllib.parse import urlparse
import json
import os
import requests

chain_lookup = {
    "avalanche": "Avalanche",
    "ethereum": "Ethereum",
    "polygon": "Polygon",
    "binance-smart-chain": "Binance",
    "arbitrum": "Arbitrum",
    "optimism": "Optimism",
}

chain_id = {
    "Polygon": "137",
    "Ethereum": "1",
    "Avalanche": "43114",
    "Arbitrum": "42161",
    "Solana": "-1",
    "Optimism": "10",
    "Gnosis": "100",
    "Binance": "56",
    "Moonbeam": "1284"
}

chain_acronym = {
    "Polygon": "MATIC",
    "Ethereum": "ETH",
    "Avalanche": "AVAX",
    "Arbitrum": "ARB",
    "Solana": "SOL",
    "Optimism": "OP",
    "Gnosis": "xDAI",
    "Binance": "BNB",
    "Moonbeam": "GLMR"
}

def get_domain(website):
    t = urlparse(website).netloc
    return '.'.join(t.split('.')[-2:])


def get_dapp_data(address, chain, path, output):
    try:
        url = f"https://api.dappradar.com/ajz9xm40x3yvium3/dapps/smart-contract/{address}?chain={chain}"
        headers = {"X-BLOBR-KEY": "25GCuResCFPuskCH3XERUvm0gqf7Mr2T"}
        response = requests.get(url, headers=headers)

        response = json.loads(response.text)
        if response['success']:
            results = response['results'][0]
            name = results['name']
            categories = [category.capitalize()
                          for category in results['categories']]
            if name in output:
                if chain in output[name]:
                    output[name][chain]['Utility Contract Address'].append(
                        address)
                else:
                    output[name][chain] = {
                        'Utility Contract Address': [address],
                        'Project/Dapp Website': get_domain(results['website']),
                        'App Type': ' - '.join(categories),
                        'Description': results['description']
                    }

            else:
                output[name] = {
                    chain: {
                        'Utility Contract Address': [address],
                        'Project/Dapp Website': get_domain(results['website']),
                        'App Type': ' - '.join(categories),
                        'Description': results['description']
                    }
                }

            img_data = requests.get(results['logo']).content

            logo_path = os.path.join(path, address)
            if not os.path.exists(logo_path):
                os.mkdir(logo_path)
            with open(os.path.join(logo_path, 'logo.jpg'), 'wb') as handler:
                handler.write(img_data)
    except:
        print(address, chain)


def generate_query(filename, path):
    queries = []
    returns = []
    logic_returns = []
    dapps = pd.read_csv(filename)
    ind = 0
    for i in range(len(dapps)):
        addresses = dapps.at[i, "Utility Contract Address"].split(",")
        chain = dapps.loc[i, 'Chain']
        for address in addresses:
            q = '{{ name: "network",\nreturn: "object",\nobject_schema:{{\nproperties:{{networkid:{{type: "integer"}},\naddress:{{type: "string", \npattern: "^0x[a-fA-F0-9]{{40}}$", }}, \nreturn:{{type: "boolean" }},}},\nrequired:["networkid", "address", "return" ],}},\nchain:"{1}", \ncontract:{{ networkid:"{2}",\naddress: "{0}", \nfunction: "Transfer",\ndirection: "to",\ntimestampRange: {{\nstart: 0, \nend: "<this should be populated with epoch time>", }},}},}}'.format(
                address.strip(), chain_acronym[chain], chain_id[chain])
            r = '{{ name: "query_response",query: "q{0}"}}'.format(ind)
            l = '"$r{0}"'.format(ind)

            queries.append(f'q{ind}:{q}')
            returns.append(f'r{ind}:{r}')
            logic_returns.append(l)
            ind += 1

    with open(os.path.join(path, '_queries.json'), 'w') as file:
        for item in queries:
            file.write(item)
            file.write(',\n')

    with open(os.path.join(path, '_returns.json'), 'w') as file:
        for item in returns:
            file.write(item)
            file.write(',\n')

    with open(os.path.join(path, '_logic_returns.json'), 'w') as file:
        for item in logic_returns:
            file.write(item)
            file.write(',\n')


def build_data_sheet(filename, path):
    dapp_data = {}
    dapps = pd.read_csv(filename)

    for i in range(len(dapps)):
        website = dapps.loc[i, "Project/Dapp Website"]
        description = dapps.loc[i, "Description"]
        name = dapps.loc[i, "Project Name"]
        chain = dapps.loc[i, "Chain"]
        app_type = dapps.loc[i, "App Type"]
        addresses = list(
            map(lambda x: x.strip(), dapps.loc[i, "Utility Contract Address"].split(",")))
        address_list = [f'"{address}"' for address in addresses]

        if name not in dapp_data:
            item = '{{"contractAddresses": [{0}], "dAppName": "{1}", "dAppWebsite": "{2}", "dAppType": "{3}", "chain": "{4}", "description": "{5}"}}'.format(
                ', '.join(address_list), name, website, app_type, chain, description)
            dapp_data[name] = item
        else:
            partial_data = dapp_data[name]
            partial_json_data = json.loads(partial_data)

            partial_json_data["contractAddresses"] = addresses + \
                partial_json_data["contractAddresses"]

            prev_chains = set(partial_json_data["chain"].split(" - "))
            prev_chains.add(chain)
            partial_json_data["chain"] = " - ".join(list(prev_chains))

            item = json.dumps(partial_json_data)
            dapp_data[name] = item

    with open(os.path.join(path, '_app_data_sheet.json'), 'w') as file:
        for item in dapp_data.values():
            file.write(item)
            file.write(',\n')


def get_all_dapp_details(path, logos_path):
    output = {}
    for chain in chain_lookup:
        addresses = pd.read_csv(os.path.join(path, chain+'.csv'))
        for i in range(len(addresses)):
            address = addresses.iloc[i]['address']
            get_dapp_data(address, chain, logos_path, output)
    return output


def store_all_dapp_details(details, dapp_filename):
    dapps = []
    for name in details:
        for chain in details[name]:
            dapp_info = details[name][chain]
            dapp_info.update(
                {"Chain": chain_lookup[chain], "Project Name": name})
            dapp_info['Utility Contract Address'] = ','.join(
                dapp_info['Utility Contract Address'])
            dapps.append(dapp_info)

    pd.DataFrame(dapps).to_csv(dapp_filename, index=False)


if __name__ == "__main__":
    input_dir = './addresses'
    output_dir = './output'
    dapp_filename = os.path.join(output_dir, 'dapps.csv')
    logos_path = os.path.join(output_dir, './dapp_logos')
    if not os.path.exists(logos_path):
        os.mkdir(logos_path)

    data = get_all_dapp_details(input_dir, logos_path)
    store_all_dapp_details(data, dapp_filename)

    generate_query(dapp_filename, output_dir)
    build_data_sheet(dapp_filename, output_dir)
