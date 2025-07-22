/* eslint-disable @typescript-eslint/no-explicit-any */
export default function getMessageId(receipt: any): string | undefined {
    if (!receipt || !receipt.logs) return undefined;

    const messageSentEvent = receipt.logs.find((log: any) => log.topics && log.topics[0] === "0x950a70746c969692b1cf78f9a763b5574680846315a214b6ea905d5e1c530a65");

    if (messageSentEvent) {
        const messageId = messageSentEvent.topics[1];
        return messageId;
    }

    return undefined;
}