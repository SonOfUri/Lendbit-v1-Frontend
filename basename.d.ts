declare module '@superdevfavour/basename' {
    export const getBasename: (address: string) => Promise<string>;
    export const getBasenameAvatar: (address: string) => Promise<string>;
}