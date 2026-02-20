import { Client, AccountSet, AccountSetAsfFlags, Wallet } from 'xrpl'

export const setupIssuerCompliance = async (seed: string) => {
    const client = new Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const wallet = Wallet.fromSeed(seed)

    // 1. Activer RequireAuth pour la compliance
    const settingsTx: AccountSet = {
        TransactionType: "AccountSet",
        Account: wallet.address,
        SetFlag: AccountSetAsfFlags.asfRequireAuth,
    }

    const prepared = await client.autofill(settingsTx)
    const signed = wallet.sign(prepared)
    const result = await client.submitAndWait(signed.tx_blob)

    // 2. Activer DefaultRipple (obligatoire pour que les tokens circulent via trust lines et AMM)
    // Sans ce flag, les transactions AMM échouent avec terNO_RIPPLE
    const rippleTx: AccountSet = {
        TransactionType: "AccountSet",
        Account: wallet.address,
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
    }

    const preparedRipple = await client.autofill(rippleTx)
    const signedRipple = wallet.sign(preparedRipple)
    const resultRipple = await client.submitAndWait(signedRipple.tx_blob)

    await client.disconnect()
    return { requireAuth: result, defaultRipple: resultRipple }
}
