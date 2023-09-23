// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {db} from '@/firebase/config';
import {doc, getDoc, setDoc, increment, FieldValue} from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const docRef = doc(db, 'blazy', 'total_ideas');
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    res.status(200).json({total_ideas: data.curr, status: 'success'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'something went wrong'});
  }
}
