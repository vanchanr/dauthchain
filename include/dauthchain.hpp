#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT dauthchain : public contract
{
public:
    using contract::contract;

    ACTION createPolicy(int policyId, string policyJson);
    ACTION readPolicy(int policyId);
    ACTION updatePolicy(int policyId, string policyJson);
    ACTION deletePolicy(int policyId);

    ACTION checkPermission(string accessRequestJson);

private:
    TABLE policies
    {
        uint64_t policyId;
        string policyJson;
        auto primary_key() const { return policyId; }
    };
    typedef multi_index<name("policies"), policies> policies_table;
};
