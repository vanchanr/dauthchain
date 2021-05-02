const { Api, JsonRpc, RpcError } = require('eosjs');
const { TextEncoder, TextDecoder } = require('util');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
//import plotly js library

const testnets = ['blockone', 'proton', 'local']

const endpoints = {
    'blockone': 'https://api.testnet.eos.io', //official EOS testnet
    'proton': 'https://testnet.protonchain.com', //proton testnet
    'local': 'http://0.0.0.0:8888' //local testnet deployed on AWS EC2
};

const defaultPrivateKey = "PASTE PRIVATE KEY HERE";
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

//TODO: declare variables to store test results (execution time, RAM used per - 10, 50, 100, 500, 1000 transactions)

for (testnet of testnets) {
    rpc = new JsonRpc(endpoints[testnet], { fetch });
    api = new Api({
        rpc,
        signatureProvider,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder()
    });

    // Submit A Transaction
    api.transact({
        //TODO: call dauthchain smart contract actions
        actions: [{
            account: 'eosio',
            name: 'buyrambytes',
            authorization: [{
                actor: 'hnfubexkeaau',
                permission: 'active',
            }],
            data: {
                payer: 'hnfubexkeaau',
                receiver: 'hnfubexkeaau',
                bytes: 50000,
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    })
        .then(result => {
            console.log(result);
            //TODO: extract execution time (CPU) from transaction receipt 
        });

    // Get Account Information
    jsonRpc.get_account('hnfubexkeaau').then(
        function (value) {
            ram_usage = value['ram_usage']
            console.log(ram_usage);
        }
    );
}

//plot the data using plotly JS library
//fig1: number of transactions vs execution times of CREATE, READ, UPDATE, DELETE policy actions (on any one testnet, or else graph will be complex)
//fig2: number of transactions vs execution times on BLOCKONE, PROTON, LOCAL testnets (for checkPermission action)
//fig3: number of transactions vs RAM used on BLOCKONE, PROTON, LOCAL testnets (for CREATE policy action)
