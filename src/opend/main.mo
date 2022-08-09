import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter"


actor OpenD {
  private type Listing = {
    itemOwner: Principal;
    itemPrice: Nat;
  };
  var mapofNFTS = HashMap.HashMap<Principal, NFTActorClass.NFT >(1, Principal.equal, Principal.hash);
  var mapofOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var mapoflist = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);



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

      };

      public query func getListedNFT() : async [Principal]{
       let Ids =  Iter.toArray(mapoflist.keys());
       return Ids;
      };


      public shared(msg) func listItem(id: Principal, price:Nat) : async Text{
        var item : NFTActorClass.NFT = switch(mapofNFTS.get(id)){
          case null return "NFT does not exist";
          case (?result) result; 
        };

        let Owner = await item.getOwner();
        if ( Principal.equal(Owner, msg.caller)){
          let newlisting : Listing = {
            itemOwner = Owner;
            itemPrice = price;

          };
          mapoflist.put(id, newlisting);
          return "Success";
        }
        else {
          return "you dont own NFT"
        }
      };

      public query func getOpenDCanister() : async Principal{
        return Principal.fromActor(OpenD);
      };

      public query func isListed(id: Principal) : async Bool {

        if(mapoflist.get(id) == null) {
          return false
        }
        else { return  true }
      };

      public query func getoriginalOwner(id: Principal) : async Principal{
        var listing: Listing = switch(mapoflist.get(id)){
          case null return Principal.fromText("");
          case (?result) result;
        };
        return  listing.itemOwner;



      };




    };


