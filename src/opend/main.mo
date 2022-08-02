import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";


actor OpenD {
  var mapofNFTS = HashMap.HashMap<Principal, NFTActorClass.NFT >(1, Principal.equal, Principal.hash);
  var mapofOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);



    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
      let owner : Principal = msg.caller;

      Debug.print(debug_show(Cycles.balance()));
      Cycles.add(100_500_000_000);
      let newNFT = await NFTActorClass.NFT(name, owner, imgData);
      Debug.print(debug_show(Cycles.balance()));

      let newNFTPrincipal = await newNFT.getCanisterID();
      mapofNFTS.put(newNFTPrincipal, newNFT);
      adtoOwnerShipMap(owner, newNFTPrincipal);


      return newNFTPrincipal

    };
    private func adtoOwnerShipMap(owner: Principal, nftId: Principal){
      var ownedNFTS : List.List<Principal> = switch (mapofOwners.get(owner)){
        case null List.nil<Principal>();
        case (?result) result;

      } ;
      ownedNFTS := List.push(nftId, ownedNFTS);
      mapofOwners.put(owner, ownedNFTS);

    };

    public query func getOwnedNFTS(user: Principal) : async [Principal]{
      var userNFTS : List.List<Principal> = switch (mapofOwners.get(user)){
        case null List.nil<Principal>();
        case (?result) result;
      };
      return List.toArray(userNFTS);
      
      }



    }

};
