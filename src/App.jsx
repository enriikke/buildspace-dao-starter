import { useEffect, useMemo, useState } from "react";

// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule(
  "0x75CEa9D937bD74a7C74D20eC6E2C8BA802c8C3BE",
);

const App = () => {
  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  const signer = provider ? provider.getSigner() : undefined;
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("failed to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      // Stop loading state.
      setIsClaiming(false);
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    });
  }

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to TofuDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free TofuDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
