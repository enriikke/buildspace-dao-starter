import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x75CEa9D937bD74a7C74D20eC6E2C8BA802c8C3BE",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Wen Tofu?",
        description: "This NFT will give you access to TofuDAO!",
        image: readFileSync("scripts/assets/tofu-nft.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()
