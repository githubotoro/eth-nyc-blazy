import {ethers} from 'ethers';
import {Abi} from './Abi';

export default async function handler(req, res) {
  try {
    console.log(req.body);
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ZKEVM_URL),
    );

    const contract = new ethers.Contract(
      '0xB396B86779dAacdd76Bd7121179dE8c1f9D13925',
      Abi.abi,
      wallet,
    );

    const txn = await contract.doVote(req.body.id, req.body.vote, req.body.userAddress);

    await txn.wait();

    res.status(200).json({status: 'success'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'something went wrong'});
  }
}
