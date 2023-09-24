import {ethers} from 'ethers';
import {Abi} from './Abi';

export default async function handler(req, res) {
  try {
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ZKEVM_URL),
    );

    const contract = new ethers.Contract(
      '0xB396B86779dAacdd76Bd7121179dE8c1f9D13925',
      Abi.abi,
      wallet,
    );

    const txn = await contract.makeIteration(
      req.body.id,
      req.body.title,
      req.body.one_liner,
      req.body.isNew,
      req.body.userAddress,
    );

    await txn.wait();

    res.status(200).json({status: 'success'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'something went wrong'});
  }
}
