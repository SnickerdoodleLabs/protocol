import pandas as pd

queries = []
returns = []
logic_returns = []

dapps = pd.read_csv('./dapps.csv')

for i in range(len(dapps)):    
    q = '{{ "name": "network", "return": "boolean", "chain": "ETH", "contract": {{ "networkid": "1", "address": "{0}", "function": "Transfer", "direction": "to", "token": "{1}", "blockrange": {{ "start": 0, "end": 15442629 }} }} }}'.format(dapps.loc[i,'Utility Contract Address'],dapps.loc[i,'Token'])
    
    r = '{{ "name": "query_response","query": "q{0}"}}'.format(i)
    
    l = '"$r{0}"'.format(i)
    queries.append(f'"q{i}":{q}')
    returns.append(f'"r{i}":{r}')
    logic_returns.append(l)
    
with open('_queries.json', 'w') as file:
    for item in queries:
        file.write(item)
        file.write(',\n')
    
    
with open('_returns.json', 'w') as file:
    for item in returns:
        file.write(item)
        file.write(',\n')
    
    
with open('_logic_returns.json', 'w') as file:
    for item in logic_returns:
        file.write(item)
        file.write(',\n')
    

    
