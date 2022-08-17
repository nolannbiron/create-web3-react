import { Web3ReactProvider } from '@web3-react/core'
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

const connectors = [
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
