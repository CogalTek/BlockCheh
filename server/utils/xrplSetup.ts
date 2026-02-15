import { Client, AccountSet, AccountSetAsfFlags, Wallet } from 'xrpl'

export const setupIssuerCompliance = async (seed: string) => {
    const client = new Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const wallet = Wallet.fromSeed(seed)

    const settingsTx: AccountSet = {
        TransactionType: "AccountSet",
        Account: wallet.address,
        SetFlag: AccountSetAsfFlags.asfRequireAuth,
    }

    const prepared = await client.autofill(settingsTx)
    const signed = wallet.sign(prepared)
    const result = await client.submitAndWait(signed.tx_blob)

    await client.disconnect()
    return result
}
