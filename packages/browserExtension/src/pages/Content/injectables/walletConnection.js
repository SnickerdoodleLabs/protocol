document.addEventListener('requestAccounts', async function (e) {
    console.log("hello from injected!")
           const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
    document.dispatchEvent(new CustomEvent("accountsReceived", {detail: accounts}));
    console.log('accounts: ', accounts)
        });
        