const { Api, JsonRpc, RpcError, Serialize } = require('eosjs');
const { TextEncoder, TextDecoder } = require('util');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { performance } = require('perf_hooks');
const fs = require('fs')
const fetch = require('node-fetch');
const plotly = require('plotly')("vanchanr", "g0IdVQZMEs5Bz6O3Tr1y");

const testnets = ['blockone', 'proton', 'local']

const endpoints = {
    'blockone': 'https://api.testnet.eos.io', //official EOS testnet
    'proton': 'https://proton-testnet.eosphere.io', //proton testnet
    'local': 'http://0.0.0.0:8888' //local testnet deployed on AWS EC2
};

const defaultPrivateKey = "**********PRIVATEKEY**********"
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const num_transactions = [10, 20, 30, 40, 50]

rpc = new JsonRpc(endpoints['proton'], { fetch });
api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});

function makeNumTransaction(n) {
    let trx_count = num_transactions[n]
    let promises = [];
    for (let i = 0; i < trx_count; i++) {
        // Submit A Transaction
        let promise = api.transact({
            actions: [{
                account: 'hnfubexkeaau',
                name: 'createpolicy',
                authorization: [{
                    actor: 'hnfubexkeaau',
                    permission: 'active',
                }],
                data: {
                    "policyId": (n * 100 + i),
                    "policyJson": "{\r\n    \"Resource\" : {\r\n      \"resourceId\": \"5b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b\"\r\n    },\r\n    \"ResourceUser\": {\r\n      \"addr\": \"EOS8ZG7atiC6txDyHbwGguccZaP8dXrikAP5MUoqYL6cwFHR9BpAD\"\r\n    },\r\n    \"Permissions\": {\r\n      \"read\": 1,\r\n      \"write\": 0\r\n    }\r\n}"
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 300,
        });
        promises.push(promise);
    }
    return promises;
}

//Get Account Information
rpc.get_account('hnfubexkeaau')
    .then(res => {
        initial_ram = res['ram_usage']
        console.log('initial_ram= ' + initial_ram);
        promises = makeNumTransaction(4);
        Promise.all(promises)
            .then(() => {
                rpc.get_account('hnfubexkeaau')
                    .then(res => {
                        final_ram = res['ram_usage']
                        console.log('final_ram= ' + final_ram);
                        console.log('RAM used= ' + (final_ram - initial_ram) / 1000)
                    })
            });
    });


const wasmFilePath = 'hnfubexkeaau.wasm'
const abiFilePath = 'hnfubexkeaau.abi'

const wasmHexString = fs.readFileSync(wasmFilePath).toString('hex')

const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
})

let abiJSON = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'))
const abiDefinitions = api.abiTypes.get('abi_def')
abiJSON = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) =>
        Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abiJSON
)
abiDefinitions.serialize(buffer, abiJSON)
serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString('hex')

api.transact({
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
            bytes: 1000000,
        },
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 30,
})
    .then(resp => {
        console.log(resp);
    });

//====================================
api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: 'myproton15',
            permission: 'owner',
        }],
        data: {
            from: 'myproton15',
            to: 'hnfubexkeaau',
            quantity: '20000.0000 XPR',
            memo: 'buy ram'
        }
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 30,
})
    .then(resp => {
        console.log(resp);
    });

//=====================================
api.transact(
    {
        actions: [
            {
                account: 'eosio',
                name: 'setcode',
                authorization: [
                    {
                        actor: 'hnfubexkeaau',
                        permission: 'active',
                    },
                ],
                data: {
                    account: 'hnfubexkeaau',
                    code: wasmHexString,
                    vmtype: '0',
                    vmversion: '0'
                },
            },
            {
                account: 'eosio',
                name: 'setabi',
                authorization: [
                    {
                        actor: 'hnfubexkeaau',
                        permission: 'active',
                    },
                ],
                data: {
                    account: 'hnfubexkeaau',
                    abi: serializedAbiHexString,
                },
            },
        ],
    },
    {
        blocksBehind: 3,
        expireSeconds: 30,
    }
)
    .then(result => {
        console.log(result);
    });

//====================================================
api.transact({
    actions: [{
        account: 'hnfubexkeaau',
        name: 'readpolicy',
        authorization: [{
            actor: 'hnfubexkeaau',
            permission: 'active',
        }],
        data: {
            "policyId": 1,
            "policyJson": "{\r\n    \"Resource\" : {\r\n      \"resourceId\": \"5b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b\"\r\n    },\r\n    \"ResourceUser\": {\r\n      \"addr\": \"EOS8ZG7atiC6txDyHbwGguccZaP8dXrikAP5MUoqYL6cwFHR9BpAD\"\r\n    },\r\n    \"Permissions\": {\r\n      \"read\": 1,\r\n      \"write\": 0\r\n    }\r\n}"
        }
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 300,
})
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });

//==================================================
api.transact({
    actions: [{
        account: 'eosio',
        name: 'newaccount',
        authorization: [{
            actor: 'eosio',
            permission: 'active',
        }],
        data: {
            creator: 'eosio',
            name: 'hnfubexkeaau',
            owner: {
                threshold: 1,
                keys: [{
                    key: 'EOS799GerG264VkKcrktvRyWbbPrXEHH8dZ6SkVShw2pBpR8Q9sMP',
                    weight: 1
                }],
                accounts: [],
                waits: []
            },
            active: {
                threshold: 1,
                keys: [{
                    key: 'EOS5fWvPRKN1AxmzGhAkKmBiPqF3qeH3pKp2sNDKVVwPowEK15Aem',
                    weight: 1
                }],
                accounts: [],
                waits: []
            },
        },
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 30,
})
    .then(resp => {
        console.log(resp);
    });


//==================================================
var trace1 = {
    x: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    y: [286.4, 275.3, 274.06666666666666, 283.1, 277.9, 271.6166666666667, 279.07142857142856, 289.375, 289.6333333333333, 282.58],
    mode: 'lines+markers',
    name: 'CREATE'
};

var trace2 = {
    x: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    y: [259.3, 243.1, 256.96666666666664, 255.975, 264.02, 265.53333333333336, 266.7142857142857, 263.35, 258.74444444444447, 263.71],
    mode: 'lines+markers',
    name: 'READ'
};

var trace3 = {
    x: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    y: [311.5, 341.15, 350.06666666666666, 338.125, 341.64, 337.31666666666666, 338.27142857142854, 342.4875, 344.44444444444446, 345.32],
    mode: 'lines+markers',
    name: 'UPDATE'
};

var trace4 = {
    x: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    y: [378.8, 349.15, 334.6333333333333, 352.9, 348.38, 344.9, 361.15714285714284, 350.0625, 344.43333333333334, 339.24],
    mode: 'lines+markers',
    name: 'DELETE',
    color: 'yellow'
};

var data = [trace1, trace2, trace3, trace4];

var layout = {
    title: "Average Execution Time by Action Type",
    xaxis: {
        title: "number of transactions"
    },
    yaxis: {
        title: "average execution time per transaction (in micro-sec)"
    }
};
var graphOptions = { layout: layout, filename: "policy-CRUD-graph", fileopt: "overwrite" };
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});

//============================
var trace1 = {
    x: [10, 20, 30, 40, 50],
    y: [2.836073010015488, 8.010655250018836, 9.600426579948266, 11.457152604961395, 10.999832850003243],
    mode: 'lines+markers',
    name: 'local'
};

var trace2 = {
    x: [10, 20, 30, 40, 50],
    y: [3.557328299987316, 5.614574394971132, 11.422355333288511, 9.199751270002126, 14.88548406001091],
    mode: 'lines+markers',
    name: 'block.one'
};

var trace3 = {
    x: [10, 20, 30, 40, 50],
    y: [9.578976129961013, 11.727971960026025, 14.74701874998808, 15.550350589975714, 20.29844686601877],
    mode: 'lines+markers',
    name: 'proton'
};

var data = [trace1, trace2, trace3];

var layout = {
    title: "Average Latency of Transactions by Testnet",
    xaxis: {
        title: "number of transactions"
    },
    yaxis: {
        title: "average latency per transaction (in sec)"
    }
};
var graphOptions = { layout: layout, filename: "testnet-latency-graph", fileopt: "overwrite" };
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});

//============================
var trace1 = {
    x: [10, 20, 30, 40, 50],
    y: [4.09, 8.18, 12.27, 16.36, 20.45],
    mode: 'lines+markers',
    name: 'local'
};

var trace2 = {
    x: [10, 20, 30, 40, 50],
    y: [4.09, 8.18, 12.27, 16.36, 20.45],
    mode: 'lines+markers',
    name: 'block.one'
};

var trace3 = {
    x: [10, 20, 30, 40, 50],
    y: [4.09, 8.18, 12.27, 16.36, 20.45],
    mode: 'lines+markers',
    name: 'proton'
};

var data = [trace1, trace2, trace3];

var layout = {
    title: "RAM usage by Number of Policies",
    xaxis: {
        title: "number of policies"
    },
    yaxis: {
        title: "total amount of RAM consumed (in kb)"
    }
};
var graphOptions = { layout: layout, filename: "RAM-usage-graph", fileopt: "overwrite" };
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});
