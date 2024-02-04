export class general {
    static mainPrivateKey = ""
    static senderNative = true
    // 1=0.00000001 | 10 = 0.0000001 | 100 = 0.000001 | 1_000 = 0.00001 ->
    // -> 10_000 = 0.0001 | 100_000 = 0.001 | 1_000_000 = 0.01 | 10_000_000 = 0.1 | 100_000_000 = 1
    static amount = 1000
    static delayAfterTXmin = 0  
    static delayAfterTXmax = 0
    static NFTSender = false
    static nativeCollect = false
    static listNFT = false
    // 1=0.00000001 | 10 = 0.0000001 | 100 = 0.000001 | 1_000 = 0.00001 ->
    // -> 10_000 = 0.0001 | 100_000 = 0.001 | 1_000_000 = 0.01 | 10_000_000 = 0.1 | 100_000_000 = 1
    static price = 100000000
    static NFtToList = 30
}