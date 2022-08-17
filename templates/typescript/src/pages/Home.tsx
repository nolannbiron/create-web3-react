import { useWeb3React } from '@web3-react/core'
import { usePreferedNetwork } from '../hooks/usePreferedNetwork'
import { useWallet } from '../hooks/useWallet'
import { networkConnectorHooks } from '../utils/connectors'

const { useIsActive, useAccount, useChainId } = networkConnectorHooks

export default function Home(): JSX.Element {
    const { connect, disconnect } = useWallet()
    const { account } = useWeb3React()
    const isActive = useIsActive()
    const chainId = useChainId()
    const accountNetwork = useAccount()

    console.log('accountNetwork', accountNetwork)
    console.log('chainId', chainId)
    console.log('isActive', isActive)

    const { switchNetwork, isError } = usePreferedNetwork(1)

    return (
        <div>
            {!account ? (
                <>
                    <button onClick={() => connect('injected')}>Injected</button>
                    <button onClick={() => connect('walletconnect')}>WalletConnect</button>
                    <button onClick={() => connect('coinbase')}>Coinbase</button>
                    <button onClick={() => connect('network')}>Network</button>
                    <button onClick={() => connect('gnosis')}>Gnosis Safe</button>
                </>
            ) : (
                <>
                    {account}
                    <button onClick={() => disconnect()}>Disconnect</button>
                </>
            )}
            {isError && (
                <div>
                    Error <button onClick={() => switchNetwork()}>Switch to good networck</button>
                </div>
            )}
        </div>
    )
}
