import { db } from '../firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore'

const COLLECTION = 'offers'

// pobierz wszystkie oferty (wszyscy widzą wszystko)
export const fetchOffers = async () => {
  const snap = await getDocs(collection(db, COLLECTION))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// utwórz nową ofertę
// UWAGA: data MUSI mieć { ownerUid: user.uid, ... }
export const createOffer = async (data) => {
  if (!data.ownerUid) {
    throw new Error('Brak ownerUid przy tworzeniu oferty')
  }

  const colRef = collection(db, COLLECTION)
  const docRef = await addDoc(colRef, data)
  return { id: docRef.id, ...data }
}

// zaktualizuj ofertę
// currentUserUid = uid aktualnie zalogowanego użytkownika
export const updateOffer = async (id, newData, currentUserUid) => {
  const ref = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    throw new Error('Oferta nie istnieje')
  }

  const existing = snap.data()

  // jeśli oferta ma już ownerUid i nie jest to ten użytkownik -> blokada
  if (existing.ownerUid && existing.ownerUid !== currentUserUid) {
    throw new Error('Brak uprawnień do edycji tej oferty')
  }

  // przygotuj payload do zapisania:
  // - jeśli oferta już ma ownerUid, NIE pozwalamy go zmienić
  // - jeśli nie miała ownerUid (stara oferta), możemy go nadać teraz
  let payload = { ...newData }

  if (existing.ownerUid) {
    // oferta już ma właściciela -> nie pozwól zmieniać właściciela
    delete payload.ownerUid
    delete payload.ownerEmail
  }

  await updateDoc(ref, payload)
}

// usuń ofertę
export const removeOffer = async (id, currentUserUid) => {
  const ref = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    throw new Error('Oferta nie istnieje')
  }

  const existing = snap.data()

  // tylko właściciel może usunąć
  if (!existing.ownerUid || existing.ownerUid !== currentUserUid) {
    throw new Error('Brak uprawnień do usunięcia tej oferty')
  }

  await deleteDoc(ref)
}
