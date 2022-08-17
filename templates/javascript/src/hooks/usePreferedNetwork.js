import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export const usePreferedNetwork = (chainId) => {
    const { ethereum } = window
    const { isActive, account, provider, connector } = useWeb3React()
    const [isError, setIsError] = useState(false)

    const checkChainId = async () => {
        if (connector && isActive) {
            const providerChainId = await provider?.detectNetwork()
            if (providerChainId?.chainId) {
                if (providerChainId.chainId !== chainId || providerChainId.chainId !== chainId) {
                    return setIsError(true)
                }
            }
        }
        return setIsError(false)
    }

    const switchNetwork = async () => {
        if (!ethereum) return
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(chainId) }],
            })
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: ethers.utils.hexValue(chainId),
                                rpcUrl: 'https://goerli.infura.io/v3/5ac444b3c8014807ae1d035e482d996f',
                            },
                        ],
                    })
                } catch (err) {
                    console.error(err)
                }
            }
        }
    }

    useEffect(() => {
        checkChainId()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, account, provider, connector])

    return {
        isError,
        switchNetwork,
    }
}
