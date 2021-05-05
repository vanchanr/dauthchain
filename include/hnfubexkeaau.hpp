#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT hnfubexkeaau : public contract
{
public:
    using contract::contract;
    
    hnfubexkeaau( name receiver, name code, datastream<const char*> ds ) : contract(receiver, code, ds), pt(receiver, receiver.value) {}

    ACTION createpolicy(uint64_t policyId, string policyJson);
    ACTION readpolicy(uint64_t policyId);
    ACTION updatepolicy(uint64_t policyId, string policyJson);
    ACTION deletepolicy(uint64_t policyId);

    ACTION checkaccess(string accessRequestJson);

    TABLE policies
    {
        uint64_t policyId;
        string policyJson;
        uint64_t primary_key() const { return policyId; }
    };
    typedef multi_index<"policies"_n, policies> policies_table;
    
    policies_table pt;
};
