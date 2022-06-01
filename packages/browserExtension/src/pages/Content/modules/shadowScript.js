let shadowRootElement = document.getElementById(
  "react-extension-container",
).shadowRoot;

let account = [];

if (typeof window.ethereum !== "undefined") {
  console.log(window.location.hostname);

  if (window.location.hostname === "www.shrapnel.com") {
    shadowRootElement.querySelector(".riot").style = "display:none";
    shadowRootElement.querySelector(".sharapnel").style = "display:block";
    shadowRootElement.querySelector(".card").style = "display:block";
  }
  if (window.location.hostname === "staratlas.com") {
    shadowRootElement.querySelector(".riot").style = "display:block";
    shadowRootElement.querySelector(".sharapnel").style = "display:none";
    shadowRootElement.querySelector(".card").style = "display:block";
  }
  let checkS = sessionStorage.getItem("shrapnel");
  let checkR = sessionStorage.getItem("riot");

  if (window.location.hostname === "www.shrapnel.com" && checkS === null) {
    shadowRootElement.querySelector(".card").style = "display:block";
    async function getAccount() {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account.push(accounts[0]);

      let snckr = sessionStorage.getItem("snickerDoodleUser");
      let snckrObj = JSON.parse(snckr);

      shadowRootElement.querySelector(".sharapnel").style = "display:none";
      shadowRootElement.querySelector(".card3").style = "display:block";
      sessionStorage.setItem("shrapnel", true);
    }
    function doItClicked() {
      getAccount();
    }
  } else if (window.location.hostname === "staratlas.com" && checkR === null) {
    shadowRootElement.querySelector(".card").style = "display:block";
    async function getAccount() {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account.push(accounts[0]);
      console.log(accounts);
      console.log(account);

      let snckr = sessionStorage.getItem("snickerDoodleUser");
      let snckrObj = JSON.parse(snckr);

      shadowRootElement.querySelector(".riot").style = "display:none";
      shadowRootElement.querySelector(".card3").style = "display:block";
      sessionStorage.setItem("riot", true);
    }
    function doItClicked() {
      getAccount();
    }
  } else {
    shadowRootElement.querySelector(".card").style = "display:none";
  }
} else {
  alert("Not installed");
}
