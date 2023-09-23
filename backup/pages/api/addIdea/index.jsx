// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {db} from '@/firebase/config';
import {doc, getDoc, setDoc, increment, FieldValue, addDoc} from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const docRefTotal = doc(db, 'blazy', 'total_ideas');
    const docSnapTotal = await getDoc(docRefTotal);
    const dataTotal = docSnapTotal.data();

    // await setDoc(docRefTotal, {
    //   curr: dataTotal.curr + 1,
    // });

    await db.collection('blazyIdeas').add({
      address: req.body.address,
      gases: 0,
      hmms: 0,
      iterations: [
        {
          title: req.body.title,
          one_liner: req.body.one_liner,
        },
      ],
      total_iterations: 0,
      total_votes: 0,
      voters: [],
    });

    res.status(200).json({status: 'success'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'something went wrong'});
  }
}
