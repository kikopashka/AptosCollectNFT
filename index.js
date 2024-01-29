import { AptosConfig, Aptos, Network, Account, Ed25519PrivateKey} from "@aptos-labs/ts-sdk"
import { general } from "./settings.js"
import fs from "fs"

const privates = fs.readFileSync("private.txt").toString().replace(/\r\n/g,'\n').split('\n');



async function delayTx(min, max) {           //тут в секундах
    let number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    await delay(number)
}
  
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function senderNative(mainKey, key, amount){
    const privateKeyMain = new Ed25519PrivateKey(mainKey);
    const accountMain = Account.fromPrivateKey({ privateKey: privateKeyMain })

    const privateKeyTo = new Ed25519PrivateKey(key)
    const accountAdditional = Account.fromPrivateKey({ privateKey: privateKeyTo})

    const provider = new AptosConfig({network: Network.MAINNET})
    const aptos = new Aptos(provider)



    const tx = await aptos.transferCoinTransaction({
        sender: accountMain.accountAddress,
        amount: amount,
        recipient: accountAdditional.accountAddress
    })

    const pendingTransaction = await aptos.signAndSubmitTransaction({signer: accountMain, transaction: tx})
}


async function senderNFT(keyFrom, keyTo){
    const privateKeyFrom = new Ed25519PrivateKey(keyFrom);
    const accountFrom = Account.fromPrivateKey({ privateKey: privateKeyFrom })

    const privateKeyTo = new Ed25519PrivateKey(keyTo)
    const accountTo = Account.fromPrivateKey({ privateKey: privateKeyTo})

    const provider = new AptosConfig({network: Network.MAINNET})
    const aptos = new Aptos(provider)
    const collectionAddress = "0x3d94d2eb4aea99cdf051a817c1e9f31d2166c79ed301578c75c31e38d4be747e"
    const balance = await aptos.getAccountOwnedTokensFromCollectionAddress({accountAddress: accountFrom.accountAddress, collectionAddress: collectionAddress})

    const tx = await aptos.transaction.build.simple({
        sender: accountFrom.accountAddress,
        data: {
          function: "0x1::object::transfer",
          typeArguments: ["0x4::token::Token"],
          functionArguments: [balance[0].token_data_id, accountTo.accountAddress],
        },
    });

    tx.rawTransaction.max_gas_amount = 80n;
    const committedTransaction = await aptos.signAndSubmitTransaction({
        signer: accountFrom,
        transaction: tx,
    });
}

async function collectNative(mainKey, key){
    const privateKeyMain = new Ed25519PrivateKey(mainKey);
    const accountMain = Account.fromPrivateKey({ privateKey: privateKeyMain })

    const privateKeyFrom = new Ed25519PrivateKey(key)
    const accountFrom = Account.fromPrivateKey({ privateKey: privateKeyFrom})
    const provider = new AptosConfig({network: Network.MAINNET})
    const aptos = new Aptos(provider)
    const balance = await aptos.getAccountAPTAmount({accountAddress: accountFrom.accountAddress})



    const tx = await aptos.transferCoinTransaction({
        sender: accountFrom.accountAddress,
        amount: balance - (100 * 9),
        recipient: accountMain.accountAddress,
        options: {
            maxGasAmount: 8
        }
    })

    const pendingTransaction = await aptos.signAndSubmitTransaction({signer: accountFrom, transaction: tx})
}




for(let i = 0; privates.length > i; i++){
    try{
    if(general.senderNative){
        await senderNative(general.mainPrivateKey, privates[i], general.amount)
        console.log(`Funds was sent for ${i+1}/${privates.length} wallet`)
        await delayTx(general.delayAfterTXmin, general.delayAfterTXmax)
    }
    if(general.NFTSender){
        await senderNFT(privates[i], general.mainPrivateKey)
        console.log(`NFT was sent for ${i+1}/${privates.length} wallet`)
        await delayTx(general.delayAfterTXmin, general.delayAfterTXmax)
    }
    if(general.nativeCollect){
        await collectNative(general.mainPrivateKey, privates[i])
        console.log(`Collect native succses for ${i+1}/${privates.length}`)
        await delayTx(general.delayAfterTXmin, general.delayAfterTXmax)
    }
    console.log(``)
    }catch(e){
        console.log(`Some problem with wallet in line ${i+1}`)
    }

}