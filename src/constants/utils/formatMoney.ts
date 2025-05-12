export function formatMoney(value: string | number | undefined) {
    const valueInt = Number(value)

    if (valueInt >= 1_000_000) {
        return (valueInt / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
    } else if (valueInt >= 1_000) {
        return (valueInt / 1_000).toFixed(2).replace(/\.00$/, "") + "K";
    } else {
        return valueInt.toFixed(2);
    }
}


export function formatMoney2(value: string | number | undefined) {
  const valueInt = Number(value);

  if (valueInt >= 1_000_000) {
    return (valueInt / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  } else if (valueInt >= 1_000) {
    return valueInt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    return valueInt.toFixed(2);
  }
}