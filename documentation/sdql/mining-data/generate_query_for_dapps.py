# %%
import pandas as pd
from wand.image import Image
import io
import re
from urllib.parse import urlparse
import json
import os
import requests
from constants import (chain_lookup, 
                       chain_id, 
                       chain_acronym, 
                       api_key, 
                       project_id)

def get_domain(website):
    t = urlparse(website).netloc
    return '.'.join(t.split('.')[-2:])

def download_and_save_logo(url, logo_path):
    response = requests.get(url)
    if response.status_code == 200:
        if not os.path.exists(logo_path):
            os.mkdir(logo_path)

        if url.endswith(".svg"):
            svg_bytes = io.BytesIO(response.content)
            with Image(blob=svg_bytes, format='svg') as img:
                img.format = 'jpeg'
                img.save(filename= os.path.join(logo_path, 'logo.jpg'))
        else:
            with open(os.path.join(logo_path, 'logo.jpg'), 'wb') as handler:
                handler.write(response.content)
    else:
        print(f"failed to download {logo_path}")

def get_dapp_data(address, chain, path, output):
    try:
        url = f"https://api.dappradar.com/{project_id}/dapps/smart-contract/{address}?chain={chain}"
        headers = {"X-BLOBR-KEY": api_key}
        response = requests.get(url, headers=headers)

        response = json.loads(response.text)
        if response['success']:
            results = response['results'][0]
            name = results['name']
            domain = get_domain(results['website'])

            description = re.sub('[^A-Za-z0-9\ \.\,]+','', results['description'] )

            categories = ' - '.join([category.capitalize()
                          for category in results['categories']])
            
            if name in output:
                if chain in output[name]:
                    output[name][chain]['Utility Contract Address'].append(
                        address)
                else:
                    output[name][chain] = {
                        'Utility Contract Address': [address],
                        'Project/Dapp Website': domain,
                        'App Type': categories,
                        'Description': description
                    }

            else:
                output[name] = {
                    chain: {
                        'Utility Contract Address': [address],
                        'Project/Dapp Website': domain,
                        'App Type': categories,
                        'Description': description
                    }
                }

            logo_path = os.path.join(path, address)
            download_and_save_logo(results['logo'], logo_path)
            
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
        if isinstance(description, str): 
            description = re.sub('\n', ' ', description)
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
        file = os.path.join(path, chain+'.csv')
        if os.path.exists(file): 
            addresses = pd.read_csv(file)
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

def add_missing_dapps(dapp_filename, missing_dapps_filename, path):
    missing_dapps = pd.read_csv(missing_dapps_filename)

    for i in range(len(missing_dapps)):
        logo = missing_dapps.loc[i,'Logo']
        addresses = missing_dapps.loc[i,'Utility Contract Address']
        for address in addresses.split(','):
            logo_path = os.path.join(path, address)
            download_and_save_logo(logo, logo_path)

    missing_dapps.drop(columns='Logo', inplace = True)
    dapps = pd.read_csv(dapp_filename)

    dapps = pd.concat([dapps, missing_dapps], sort=False)
    dapps = dapps.drop_duplicates()
    pd.DataFrame(dapps).to_csv(dapp_filename, index=False)


if __name__ == "__main__":
    input_dir = './addresses'
    output_dir = './output'
    
    missing_dapps_filename = os.path.join(input_dir, 'missing_dapps.csv')
    dapp_filename = os.path.join(output_dir, 'dapps.csv')
    logos_path = os.path.join(output_dir, 'dapp_logos')
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)
    if not os.path.exists(logos_path):
        os.mkdir(logos_path)

    data = get_all_dapp_details(input_dir, logos_path)
    store_all_dapp_details(data, dapp_filename)
    add_missing_dapps(dapp_filename, missing_dapps_filename, logos_path)

    generate_query(dapp_filename, output_dir)
    build_data_sheet(dapp_filename, output_dir)
