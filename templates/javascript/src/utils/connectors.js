import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Eip1193Bridge } from '@ethersproject/experimental'
import { JsonRpcProvider } from '@ethersproject/providers'
import { EIP1193 } from '@web3-react/eip1193'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { EMPTY } from '@web3-react/empty'
import { Network } from '@web3-react/network'
import { Url } from '@web3-react/url'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCallback } from 'react'

const RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/5ac444b3c8014807ae1d035e482d996f',
    5: 'https://goerli.infura.io/v3/5ac444b3c8014807ae1d035e482d996f',
}

console.log(RPC_URLS[1])

export const [metamaskConnector, metamaskConnectorHooks] = initializeConnector((actions) => new MetaMask({ actions }))

export const [walletConnectConnector, walletConnectConnectorHooks] = initializeConnector(
    (actions) =>
        new WalletConnect({
            actions,
            options: {
                rpc: RPC_URLS,
                qrcode: true,
                bridge: 'https://bridge.walletconnect.org',
            },
        })
)

export const [coinbaseConnector, coinbaseConnectorHooks] = initializeConnector(
    (actions) =>
        new CoinbaseWallet({
            actions,
            options: {
                url: RPC_URLS[1],
                appName: 'web3-react',
            },
        })
)

class Eip1193BridgeWithoutAccounts extends Eip1193Bridge {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request(request) {
        if (request.method === 'eth_requestAccounts' || request.method === 'eth_accounts') return Promise.resolve([])
        return super.request(request)
    }
}

const ethersProvider = new JsonRpcProvider(RPC_URLS[1], 1)
const eip1193Provider = new Eip1193BridgeWithoutAccounts(ethersProvider.getSigner(), ethersProvider)

export const [eip1193Connector, eip1193ConnectorHooks] = initializeConnector(
    (actions) => new EIP1193({ actions, provider: eip1193Provider })
)

export const [gnosisConnector, gnosisConnectorHooks] = initializeConnector((actions) => new GnosisSafe({ actions }))

export const [emptyConnector, emptyConnectorHooks] = initializeConnector(() => EMPTY)

export const [urlConnector, urlConnectorHooks] = initializeConnector(
    (actions) => new Url({ actions, url: RPC_URLS[1] })
)

export const [networkConnector, networkConnectorHooks] = initializeConnector(
    (actions) => new Network({ actions, urlMap: RPC_URLS })
)

const connectors = {
    gnosis: gnosisConnector,
    injected: metamaskConnector,
    walletconnect: walletConnectConnector,
    coinbase: coinbaseConnector,
    empty: emptyConnector,
    url: urlConnector,
    network: networkConnector,
    eip1193: eip1193Connector,
}

const resetWalletConnector = () => {
    if (
        walletConnectConnector &&
        walletConnectConnector instanceof WalletConnect &&
        walletConnectConnector.provider?.rpcUrl
    ) {
        walletConnectConnector.provider = undefined
    }
}

export const connectWallet = async (type, chainId, callback) => {
    await connectors[type]
        .activate(chainId)
        ?.then(() => callback(type))
        ?.catch(() => alert('Error connecting'))
        ?.catch((err) => console.log(err))
        ?.catch(() => type === 'walletconnect' && resetWalletConnector())
}

export const disconnectWallet = async (type) => {
    await connectors[type].deactivate?.()?.catch(() => alert('Error disconnecting'))
}

export const useConnectors = () => {
    const [connectionType] = useLocalStorage('connectionType', false)

    const fetchEagerConnection = useCallback(async () => {
        if (!connectionType) return

        await connectors[connectionType]?.connectEagerly?.()
    }, [connectionType])

    return fetchEagerConnection
}
