'use client'
import Link from 'next/link'
import { useEffect } from 'react';
import { Provider } from 'starknet';
import abiz from './assets/simple_storage.json';

import { useProvider, useNetwork, useContractRead, useAccount, useContract, useSignTypedData, UseSignTypedDataProps } from '@starknet-react/core';

export default function Home() {

  // const provider = new Provider({ sequencer: { baseUrl: "http://0.0.0.0:5050" } });

  const { provider } = useProvider()
  const { chain: { id, name } } = useNetwork();
  const { address } = useAccount();
  const { data, signTypedData } = useSignTypedData({ domain: { name: 'Starknet' }, types: { Starknet: [{ name: 'balance', type: 'uint256' }] }, message: { balance: 0 } } as UseSignTypedDataProps);

  // const { data, isLoading, error, refetch } = useContractRead({
  //   address: '0x079875f506850b699f1c8845c3ebba46339410048eea4333e2db12663176d6eb',
  //   abi: abiz,
  //   functionName: 'get',
  //   // args: [address || ''], // Provide a default value if address is undefined
  //   watch: false
  // });
  // return (

  //   // <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
  //   // </div>

  //   <div>

  //     <Link href="/Set">Counter</Link>
  //     <Link href="/Get">Get</Link>
  //   </div>
  // );

  const { contract } = useContract({ abi: abiz, address: '0x079875f506850b699f1c8845c3ebba46339410048eea4333e2db12663176d6eb' })

  useEffect(() => {
    console.log("Loading page auction house");


  }, [address]);

  // if (isLoading) return <span>Loading...</span>;
  // if (error) return <span>Error: {JSON.stringify(error)}</span>;

  const handleClick: any = async (event: any) => {
    // console.log(data);
    // console.log(error);
    // console.log(provider);

    // event.preventDefault();
    // const test = await refetch();
    // console.log(test);
    console.log(contract);

    // console.log(await contract?.balanceOf(address));

    const test = await contract?.get();
    console.log(test);
  };


  return (
    <div>
      <p>Balance:</p>
      <p>{data ? data.toString() : 0}</p>
      <p><button onClick={handleClick}>Refresh Balance</button></p>
      <hr />
    </div>


  );
}
