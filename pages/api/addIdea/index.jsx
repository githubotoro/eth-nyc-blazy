// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {db} from '@/firebase/config';
import {doc, getDoc, setDoc, increment, FieldValue} from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const docRef = doc(db, 'blazy', req.body.id);

    await setDoc(docRef, {
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

    res.status(200).json({status: 'idea added successfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'something went wrong'});
  }
}
