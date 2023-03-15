#%%
import pandas as pd
import json 

network_id = {"Polygon": "137", "Ethereum": "1", "Avalanche":"43114", "Gnosis":"100", "Binance":"56","Moonbeam":"1284"}
network_acronym = {"Polygon": "MATIC", "Ethereum":"ETH", "Avalanche":"AVAX", "Gnosis":"xDAI","Binance":"BNB","Moonbeam":"GLMR"}

def generate_query(filename, path):
    queries = []
    returns = []
    logic_returns = []
    dapps = pd.read_csv(path+filename)
    ind = 0 
    for i in range(len(dapps)):
        addresses = dapps.at[i,"Utility Contract Address"].split(",")
        chain = dapps.loc[i, 'Chain']
        for address in addresses:
            q = '{{ name: "network",\nreturn: "object",\nobject_schema:{{\nproperties:{{networkid:{{type: "integer"}},\naddress:{{type: "string", \npattern: "^0x[a-fA-F0-9]{{40}}$", }}, \nreturn:{{type: "boolean" }},}},\nrequired:["networkid", "address", "return" ],}},\nchain:"{2}", \ncontract:{{ networkid:"{3}",\naddress: "{0}", \nfunction: "Transfer",\ndirection: "to",\ntoken: "{1}",\ntimestampRange: {{\nstart: 0, \nend: "<this should be populated with epoch time>", }},}},}}'.format(address.strip(), dapps.loc[i, 'Token'], network_acronym[chain],network_id[chain])
            r = '{{ name: "query_response",query: "q{0}"}}'.format(ind)
            l = '"$r{0}"'.format(ind)
            
            queries.append(f'q{ind}:{q}')
            returns.append(f'r{ind}:{r}')
            logic_returns.append(l)
            ind += 1

    with open(path+'_queries.json', 'w') as file:
        for item in queries:
            file.write(item)
            file.write(',\n')

    with open(path+'_returns.json', 'w') as file:
        for item in returns:
            file.write(item)
            file.write(',\n')

    with open(path+'_logic_returns.json', 'w') as file:
        for item in logic_returns:
            file.write(item)
            file.write(',\n')

def build_data_sheet(filename, path):
        dapp_data = {}
        dapps = pd.read_csv(path+filename)
    
        for i in range(len(dapps)):
            website = dapps.loc[i,"Project/Dapp Website"]
            name = dapps.loc[i, "Project Name"]
            token = dapps.loc[i, "Token"]
            chain = dapps.loc[i, "Chain"]
            app_type = dapps.loc[i,"App Type"]
            addresses = list(map(lambda x: x.strip(), dapps.loc[i,"Utility Contract Address"].split(",")))
            address_list = [f'"{address}"' for address in addresses]
            
            if website not in dapp_data:
                item = '{{"contractAddresses": [{0}], "dAppName": "{1}", "tokenType": "{2}", "dAppWebsite": "{3}", "dAppType": "{4}", "chain": "{5}" }}'.format(', '.join(address_list), name, token, website, app_type, chain )
                dapp_data[website] = item
            else:
                partial_data = dapp_data[website]
                partial_json_data = json.loads(partial_data)
                
                partial_json_data["contractAddresses"] = addresses + partial_json_data["contractAddresses"]
                
                prev_tokens = set(partial_json_data["tokenType"].split(" - "))
                prev_tokens.add(token)
                partial_json_data["tokenType"] = " - ".join(list(prev_tokens))
                
                prev_chains = set(partial_json_data["chain"].split(" - "))
                prev_chains.add(chain)
                partial_json_data["chain"] = " - ".join(list(prev_chains))

                item = json.dumps(partial_json_data)
                dapp_data[website] = item
     
        with open(path+'_app_data_sheet.json', 'w') as file:
            for item in dapp_data.values():
                file.write(item)
                file.write(',\n')

if __name__ == "__main__":
    filename = 'dapps.csv'
    path = '/home/zara/SnickerdoodleLabs/protocol/documentation/sdql/examples/'
    generate_query(filename, path)
    build_data_sheet(filename, path)
