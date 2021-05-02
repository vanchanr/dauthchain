#include <dauthchain.hpp>

ACTION dauthchain::createPolicy(int policyId, string policyJson)
{
    // init the _policies table
    policies_table _policies(get_self(), get_self().value);

    // find the policy from _policies table
    auto policy_itr = _policies.find(policyId);

    if (policy_itr == _policies.end())
    {
        // create a new policy in the blockchain database
        _policies.emplace(from, [&](auto &policy) {
            policy.policyId = policyId;
            policy.policyJson = policyJson;
        });
        print("created new policy: ", policyId, policyJson);
    }
    else
    {
        //throw error policy already exists
    }
}

ACTION dauthchain::readPolicy(uint64_t policyId)
{
    // init the _policies table
    policies_table _policies(get_self(), get_self().value);

    // find the policy from _policies table
    auto policy_itr = _policies.find(policyId);

    if (policy_itr == _policies.end())
    {
        //throw error policy doesn't exist
    }
    else
    {
        //read and print the requested policy
        const auto &policy = *policy_itr;
        print("requested policy is: ", policyId, policy.policyJson);
    }
}

ACTION dauthchain::updatePolicy(uint64_t policyId)
{
    // init the _policies table
    policies_table _policies(get_self(), get_self().value);

    // find the policy from _policies table
    auto policy_itr = _policies.find(policyId);

    if (policy_itr == _policies.end())
    {
        //throw error policy doesn't exist
    }
    else
    {
        //update the exiting policy
        _policies.modify(policy_itr, [&](auto &policy) {
            policy.policyId = policyId;
            policy.policyJson = policyJson;
        });
        print("updated policy: ", policyId, policy.policyJson);
    }
}

ACTION dauthchain::deletePolicy(uint64_t policyId)
{
    // init the _policies table
    policies_table _policies(get_self(), get_self().value);

    // find the policy from _policies table
    auto policy_itr = _policies.find(policyId);

    if (policy_itr == _policies.end())
    {
        //throw error policy doesn't exist
    }
    else
    {
        //delete the exiting policy
        _policies.erase(policy_itr);
        print("deleted policy: ", policyId, policy.policyJson);
    }
}

ACTION dauthchain::checkPermission(string accessRequestJson)
{
    //TODO
    //1.  parse the input accessRequestJson to get 'Resource', 'ResourceUser' attributes
    //2.  read all existing policies in Blockhain database matching the above resource and resource user
    //	  if there is an explicit deny, return permission=denied
    //3.  read all existing policies in Blockhain database matching the above resource and resource user
    //	  if there is an explicit allow, return permission=allowed
    //4.  else return permission=denied
}

EOSIO_DISPATCH(dauthchain, (createPolicy)(readPolicy)(updatePolicy)(deletePolicy)(checkPermission))
