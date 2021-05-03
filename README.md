# dauthchain

- The proposed DistributedAuthorizationChain system was implemented using an ABAC scheme (Attribute/Policy Based Access Control) on EOSIO blockchain.
- Policies are used to define the rules which ALLOW/DENY permission based on the attributes of the requested cloud resource and requesting resource user. Following is a simple policy represented in JSON format:
```javascript
  {
    "Resource" : {
      "resourceId": "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b" //resourceId
    },
    "ResourceUser": {
      "addr": "EOS8ZG7atiC6txDyHbwGguccZaP8dXrikAP5MUoqYL6cwFHR9BpAD" //user address on blockchain
    },
    "Permissions": {
      "read": 1, //allow
      "write": 0 //deny
    }
  }
```
- The smart contract developed using the EOSIO-CDT [1] exposes the following actions:
  - actions to perform CRUD operations on the access control policies which are stored directly on the blockchain itself
  - checkPermission() action which takes as input the parsed "accessRequest" from Resource Server and returns an ALLOW/DENY based on the algorithm defined in `src/dauthchain.cpp`
- We use CPU and RAM [2], the most important system resources in EOSIO blockchain to evaluate the performance of our system :
  - CPU represents the processing time taken to execute a transaction
  - RAM represents the storage required for data that needs to be persisted permanently on blockchain (policies in our case)
- The system was tested using the EOSJS library [3], to push various transactions to the blockchain. Following are the conclusions:
  - fig1 shows that DELETE policy action consumes the most CPU time followed by UPDATE, CREATE and READ actions respectively. Also, the trend shows average execution time per transaction doesn't change much on increasing the number of  concurrent transactions.
  - fig2 represents the average end to end latency from the point when a createPolicy() transaction is submitted to the blockchain till a transaction execution response is received. It shows the latency of proton testnet is slightly more than local and block.one testnets
  - fig3: number of transactions vs RAM used on BLOCKONE, PROTON, LOCAL testnets (for CREATE policy action)

### references:
1. https://eosio.github.io/eosio.cdt/
2. https://developers.eos.io/welcome/latest/introduction-to-eosio/core_concepts
3. https://eosio.github.io/eosjs
