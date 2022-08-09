import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./button";
import { opend} from "../../../declarations/opend"
import { nft } from "../../../declarations/nft/index";


function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setpriceInput] = useState();
   const [blur, setBlur] = useState();


  const [loaderHidden, setLoaderHidden] = useState(true);

  const id = (props.id);

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });
  agent.fetchRootKey();

  let NFTActor;

   // certificate

  async function loadNFT() {
     NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    if (props.role == "collection"){
      
    const nftIsListed = await opend.isListed(props.id);
    if ( nftIsListed){
      setOwner("OpenD")
      setBlur({filter: "blur(4px)" })
    }
     else {  setButton(<Button id={name} handleClick={handleSell} text="sell" />) }


  }
  else if (props.role == "discover"){
    setButton(<Button id={name} handleClick={handleBuy} text="Buy" />)



  }

    }



  useEffect(() => {
    loadNFT();
  }, []);

  let price;

  function handleSell(){
    
    console.log("clciked");
    setpriceInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price=e.target.value}
    />);
    setButton(<Button handleClick={sellItem} text="Confirm"  />)
    
    
    setLoaderHidden(true)
    
  }

  async function sellItem(){
    setLoaderHidden(false);

    
    console.log("confirmed click");
  const listingresult = await opend.listItem(props.id,Number(price));
  console.log(listingresult);
  if ( listingresult ==  "Success" ){

    const openDId = await  opend.getOpenDCanister();
   const tresulr = await NFTActor.transferOwner(openDId);
   console.log("Tranfer" + tresulr);
   setBlur({filter: "blur(4px)" })
   
   setpriceInput();
   setButton();
   setOwner("OpenID");
   setLoaderHidden(true);

   

  }

  }

  async function handleBuy() {

    console.log("Buy was triggered");

  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style ={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis"  >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
