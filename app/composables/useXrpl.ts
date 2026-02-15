export const useXrpl = () => {
    const getXrplPrice = async () => {
        try {
            const val = await $fetch("https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=eur")
            return val.ripple.eur || 0
        } catch (e) {
            console.error(e)
        }
    }

    return {
        getXrplPrice,
    }
}