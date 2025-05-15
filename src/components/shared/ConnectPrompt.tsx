import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";

const ConnectPrompt = () => {
    const { isConnected } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();
    const walletConnect = () => {
        if (!isConnected) {
            open();
        } 
    };
    return (
        <div className="min-h-screen flex items-center lg:items-start justify-center p-4 lg:pt-36 lg:px-4 bg-gradient-to-br moving-gradient text-white">

            <div
                className="text-center px-6 py-10 border border-white rounded-lg shadow-lg  noise-3"
                data-aos="zoom-in"
                data-aos-duration="1000"
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        src="/logo-icon.svg"
                        alt="Loading..."
                        style={{
                        width: 50,
                        height: 50,
                        }}
                        className="animate-spin"
                    />
                    <img
                        src="/logo-text.svg"
                        alt="Lendbit Text"
                        className="hidden md:block w-[120px]"
                    />
                    </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Connect Wallet</h1>
                <p className="text-lg md:text-xl mb-6">
                    To access this feature, please connect your wallet!
                </p>
                <div>
                    <button
                        className="bg-white text-[#000000]  px-6 py-2 rounded-lg font-medium hover:bg-[#12151A] hover:text-white transition duration-300"
                        onClick={walletConnect}
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ConnectPrompt