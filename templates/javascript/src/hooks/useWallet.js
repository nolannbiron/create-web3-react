import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { connectWallet, disconnectWallet } from '../utils/connectors'
import { useLocalStorage } from './useLocalStorage'

export const useWallet = () => {
    const { provider } = useWeb3React()
    const [loading, setLoading] = useState(false)
    const [connectionType, setConnectionType] = useLocalStorage('connectionType', false)

    const connect = async (type) => {
        setLoading(true)
        const chainId = provider?.network.chainId
        connectWallet(type, chainId ?? 1, (savedType) => setConnectionType(savedType))
        setLoading(false)
    }

    const disconnect = async () => {
        setLoading(true)
        try {
            if (!connectionType) return
            disconnectWallet(connectionType)
            setConnectionType(false)
            return window.location.reload()
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return {
        connect,
        disconnect,
        loading,
    }
}
