import {db} from '@/firebase/config';
import {doc, getDoc, setDoc, increment, FieldValue} from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const docRef = doc(db, 'blazyUsers', req.body.address);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    let swipeList;

    if (data == undefined) {
      await setDoc(docRef, {
        swipeList: [],
      });

      swipeList = [];
    } else {
      swipeList = data.swipeList;
    }

    res.status(200).json({swipeList: [], status: 'success'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'something went wrong'});
  }
}
