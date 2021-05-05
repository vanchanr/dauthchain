#include <hnfubexkeaau.hpp>

ACTION hnfubexkeaau::createpolicy(uint64_t policyId, string policyJson)
{
    // find the policy from _policies table
    auto policy_itr = pt.find(policyId);
    
    check( policy_itr == pt.end(), "policy with given policyId already exists" );

    // create a new policy in the blockchain database
    pt.emplace(_self, [&](auto& policy) {
        policy.policyId = policyId;
        policy.policyJson = policyJson;
    });
    print("created new policy: ", policyId, policyJson);
}

ACTION hnfubexkeaau::readpolicy(uint64_t policyId)
{
    // find the policy from _policies table
    auto policy_itr = pt.find(policyId);
    
    check( policy_itr != pt.end(), "policy with given policyId doesn't exist" );

   //read and print the requested policy
    print("requested policy is: ", policyId, policy_itr->policyJson);
}

ACTION hnfubexkeaau::updatepolicy(uint64_t policyId, string policyJson)
{
    // find the policy from _policies table
    auto policy_itr = pt.find(policyId);
    
    check( policy_itr != pt.end(), "policy with given policyId doesn't exist" );

     //update the exiting policy
    pt.modify(policy_itr, _self, [&](auto& policy) {
        policy.policyId = policyId;
        policy.policyJson = policyJson;
    });
    print("updated policy: ", policyId, policyJson);
}

ACTION hnfubexkeaau::deletepolicy(uint64_t policyId)
{
    // find the policy from _policies table
    auto policy_itr = pt.find(policyId);
    
    check( policy_itr != pt.end(), "policy with given policyId doesn't exist" );

    //delete the exiting policy
    pt.erase(policy_itr);
    print("deleted policy: ", policyId, policy_itr->policyJson);
}

ACTION hnfubexkeaau::checkaccess(string accessRequestJson)
{
    //TODO
    //1.  parse the input accessRequestJson to get 'Resource', 'ResourceUser' attributes
    //2.  read all existing policies in Blockhain database matching the above resource and resource user
    //	  if there is an explicit deny, return permission=denied
    //3.  read all existing policies in Blockhain database matching the above resource and resource user
    //	  if there is an explicit allow, return permission=allowed
    //4.  else return permission=denied
}

EOSIO_DISPATCH(hnfubexkeaau, (createpolicy)(readpolicy)(updatepolicy)(deletepolicy)(checkaccess))
