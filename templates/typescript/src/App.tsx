import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { useEffect } from 'react'
import Home from './pages/Home'
import {
    coinbaseConnector,
    coinbaseConnectorHooks,
    metamaskConnector,
    metamaskConnectorHooks,
    urlConnector,
    urlConnectorHooks,
    walletConnectConnector,
    walletConnectConnectorHooks,
    eip1193Connector,
    eip1193ConnectorHooks,
    emptyConnector,
    emptyConnectorHooks,
    networkConnector,
    networkConnectorHooks,
    useConnectors,
} from './utils/connectors'
import { EIP1193 } from '@web3-react/eip1193'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { Empty } from '@web3-react/empty'
import { Network } from '@web3-react/network'
import { Url } from '@web3-react/url'

const connectors: [
    MetaMask | WalletConnect | CoinbaseWallet | Url | Network | Empty | GnosisSafe | EIP1193,
    Web3ReactHooks
][] = [
    [metamaskConnector, metamaskConnectorHooks],
    [walletConnectConnector, walletConnectConnectorHooks],
    [coinbaseConnector, coinbaseConnectorHooks],
    [urlConnector, urlConnectorHooks],
    [eip1193Connector, eip1193ConnectorHooks],
    [emptyConnector, emptyConnectorHooks],
    [networkConnector, networkConnectorHooks],
]

export default function App() {
    const fetchEagerConnection = useConnectors()

    useEffect(() => {
        fetchEagerConnection()
    }, [fetchEagerConnection])

    return (
        <Web3ReactProvider connectors={connectors}>
            <Home />
        </Web3ReactProvider>
    )
}
