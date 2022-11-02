const fs = require('fs');
const axios = require('axios');
const { countryCode } = require("./constants.js");
 
async function sendJSON(jsonobject,url){
    var data = JSON.stringify(jsonobject);
    var config = {
      method: 'post',
      url,
      headers: {'Content-Type': 'application/json'},
      data : data
     };
  
      await axios(config)
      .then(response => console.log(JSON.stringify(response.data)))
      .catch(error => console.log(error));
};
  
function calculateAge(birthday) { 
    var ageDifMs = Date.now() - new Date(birthday);
    var ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function processAge(query,user){
    const age = calculateAge(user.birthday)
    if (query.return === 'boolean'){
      keys = Object.keys(query.conditions);
      let output = true;
      keys.forEach(key => {
        const condition = query.conditions[key]
        if (key === 'ge'){
          output = output && age >= condition;
        }
        else if (key === 'g'){
          output =  output && age > condition;
        }
        else if (key === 'l'){
          output =  output && age < condition;
        }
        else if (key === 'le'){
          output =  output && age <= condition;
        }
        else if (key === 'e'){
          output =  output && age === condition;
        }     
      })
      return output
    }
    else if(query.return === 'integer'){
      return age
    }
    else{
      throw new RuntimeException("invalid age return value");   
    }
};

function processLocation(query,user){
    const location = user.location;
    if (query.return === 'boolean'){
      keys = Object.keys(query.conditions)
      if (keys.length > 1)
      {
        throw new RuntimeException("invalid location conditions");   
      }
      let output = true
      const key = keys[0]
      const conditions = query.conditions[key]
      if (key == 'in'){
         output = conditions.includes(location);
      }
      else if ( key == 'not in'){
        output = !conditions.includes(location);
      }
      return output
    } 
    else if(query.return === 'integer'){
      return location;
    }
    else{
      throw new RuntimeException("invalid location return value");   
    }
};

function buildUrl(contract, chain){
  let action
  if(contract.token === 'ERC20'){
    action = 'tokentx'
  }
  else if (contract.token === 'ERC721'){
    action = 'tokennfttx'
  }
  const startblock = contract.timestampRange.start;
  const endblock = contract.timestampRange.end;
  const address = contract.address;
  let domain
  let apikey
  let endpoint

  if (chain == 'AVAX'){
    domain = 'snowtrace'
    apikey = 'T6Q1B76IMZCVSAJ63SRYUYIMFR5193X5EC';
    if (contract.networkid == 43114){
      endpoint = 'api' 
    }
    else if (contract.networkid == 43113){
      endpoint = 'api-testnet' 
    }
  }
  if (chain == 'ETH'){
    domain = 'etherscan'
    apikey = 'U73APGFF2T3IZYTEV6QRDXIIN3GK4ITCGX';
    if (contract.networkid == 1){
      endpoint = 'api' 
    }
    else if (contract.networkid == 4){
      endpoint = 'api-rinkeby' 
    }
  }

  url = `https://${endpoint}.${domain}.io/api?module=account&action=${action}&contractaddress=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc&apikey=${apikey}`;
  
  return url
}

async function processTransfer(contract, user, chain){     
  url = buildUrl(contract, chain)
  const response = await axios.get(url);
  const data = await response.data.result

  return checkUserAccounts(data, user, contract, chain)
}

function checkUserAccounts(data, user, contract, chain){
  let output = false;
  for (let i=0; i < user.accounts.length; i++)
  {
    const account = user.accounts[i];
    if (account.chain === chain) 
    {
      let addresses;
      if(contract.direction === 'from'){
         addresses = data.map(res => {return res.from});
      }
      else if (contract.direction === 'to'){
         addresses = data.map(res => {return res.to});
      }

      output = output || addresses.includes(account.address);
    }
  }
  return output
}

async function processNetwork(query,user){
    if (query.return === 'boolean'){
      if(query.contract.function === 'Transfer')
        return await processTransfer(query.contract, user, query.chain)
    }
    else{
      throw new RuntimeException("invalid location return value");   
    }
};

function processLogic(logic){
    let output = {"condition": "", "win": "", "lose": ""}
    logic = logic.replaceAll('and', '&&');
    logic = logic.replaceAll('or','||');
    if (logic.includes('then') && logic.includes('if')) {
      let [condition,reward] = logic.split('then')
      condition = condition.split('if')[1]
      output["condition"] = condition;
      if (logic.includes('else')) {
        const [win, lose] = reward.split('else')
        output["lose"] = lose;
        output["win"] = win;
     }
     else{
      output["win"] = reward;
     }
    }
    else{
      output["condition"] = logic;
    }

    return output 
}

function evaluateQueryCondition(condition, queryResults){
  if (condition.includes('$r')){
    return condition
  }
  else{
    const keys = Object.keys(queryResults);
    for (let i = 0; i < keys.length; i++) {
        key = keys[i]
        condition = condition.replace('$'+ key,String(queryResults[key]))
    }
    return eval(condition) 
  }
}

function evaluateReturn(userQueryResult, win, lose, response){
  if (win != '' && lose!= ''){
    return userQueryResult ? response[win.replace('$','')] : response[lose.replace('$','')]
  }
  else{
    return response[userQueryResult.replace('$','')];
  }
}

async function processReturn(userId, returnUrl, userReturn, queryResults, cid){
  if (userReturn.name == 'callback'){
    await sendJSON({'value': userReturn.message, 
                    'userId': userId,
                    'cid': cid}, returnUrl);
  }
  else if (userReturn.name == 'query_response'){
    await sendJSON({'value': queryResults[userReturn.query], 
                    'userId': userId,
                    'cid': cid}, returnUrl)
  }
}

async function processQueries(queries, user){
    const keys = Object.keys(queries);
    let output = {};
    for (let i = 0; i < keys.length; i++){
        const query = queries[keys[i]]
        const key = keys[i]
        if (queries[key].name === 'age'){
            output[key] = processAge(query,user);
        }
        else if (queries[key].name === 'location'){
            output[key] = processLocation(query,user);
        }
        else if (queries[key].name === 'network'){
            output[key] = await processNetwork(query,user)
        }
    } 
    return output
};

task("respondToQuery", "read the query json file and respond to it for users.")
    .addParam("cid", "the SDQL json filename")
    .addParam("users", "the list of the user profile json filenames")
    .setAction(async (taskArgs, hre) => {
    
    await hre.run("getIPFSCID", {cid: taskArgs.cid});

    const fileContents = fs.readFileSync(taskArgs.cid, 'utf8');
    const data = JSON.parse(fileContents);

    const users = taskArgs.users.split(",");   

    const returnLogics = data.logic.returns.map(r => processLogic(r));
    const compLogics = data.logic.compensations.map(c => processLogic(c));
    
    const returnUrl = data.returns.url;
    for (let i = 0; i < users.length; i++) {
      const userData = JSON.parse(fs.readFileSync(users[i], 'utf8'))
      const queryOutputs = await processQueries(data.queries, userData)

      for (let j = 0; j < returnLogics.length; j++){
        let {condition, win, lose} = returnLogics[j];
        const userQueryResult = evaluateQueryCondition(condition, queryOutputs)
        const userReturn = evaluateReturn(userQueryResult, win, lose, data.returns)

        await processReturn(users[i], returnUrl, userReturn, queryOutputs, taskArgs.cid)
      }
    }  
});

// npx hardhat respondToQuery --cid QmS17xejMSRSdPFmRULePn342DrVPjzUCEcS5mZU82K96j --users "./data/users/user1.json,./data/users/user2.json,./data/users/user3.json"
// npx hardhat respondToQuery --cid QmQAEewxp9HEcyEuuzD9x4Kqp31KN4LgaRUPmJzjnJ7qde --users "./data/users/user1.json,./data/users/user2.json"
// npx hardhat respondToQuery --cid QmQrAtXNtFeUPEWUA9mXhspHRbML5twSQKy4Q7E6W7erQE --users "./data/users/user3.json"
