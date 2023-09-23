import {db} from '@/firebase/config';
import {
  doc,
  getDoc,
  setDoc,
  increment,
  FieldValue,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const docRef = collection(db, 'blazyIdeas');
    const q = query(docRef, where('address', '==', req.body.address));
    const querySnapshot = await getDocs(q);

    let ideaList = [];

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        ideaList.push(doc.data());
      });
    }

    res.status(200).json({ideaList: ideaList, status: 'success'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'something went wrong'});
  }
}
