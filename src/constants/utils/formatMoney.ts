export function formatMoney(value: string) {
    const valueInt = Number(value)

    if (valueInt >= 1_000_000) {
        return (valueInt / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
    } else if (valueInt >= 1_000) {
        return (valueInt / 1_000).toFixed(2).replace(/\.00$/, "") + "K";
    } else {
        return valueInt.toFixed(2);
    }
}


export function formatMoney2(value: string | undefined) {
    const valueInt = Number(value)

    if (valueInt >= 1_000_000) {
        return (valueInt / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
    } else {
        return valueInt.toFixed(2);
    }
}