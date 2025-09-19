import {scrollSepolia, scroll} from 'viem/chains';
import {http} from 'wagmi';
import {createConfig} from '@privy-io/wagmi';

export const clucko_main_address = '0x371418D30C82B746Fb849570CDDB3fA33F813213'
export const clucko_feeds_address = '0x65e90E63BCdC84cc2db9B04cD1A4fF0E5Bc02552'

export const config = createConfig({
  chains: [scroll, scrollSepolia],
  transports: {
    [scroll.id]: http(),
    [scrollSepolia.id]: http(),
  },
});