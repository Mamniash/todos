import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getDatabase, ref, push, set, get, query, remove } from "firebase/database";
import { Deed } from "../components/TodoAdd";

interface Error {
   code: string;
}

export async function register(email: string, password: string): Promise<string | User> {
   try {
      const oUC = await createUserWithEmailAndPassword(getAuth(), email, password);
      return oUC.user;
   } catch (err: unknown) {
      return (err as Error).code;
   }
}

export async function login(email: string, password: string): Promise<string | User> {
   try {
      const oUS = await signInWithEmailAndPassword(getAuth(), email, password);
      return oUS.user;
   } catch (err: unknown) {
      return (err as Error).code;
   }
}

export async function logout(): Promise<void> {
   await signOut(getAuth());
}

export async function add(user: User, deed: Deed): Promise<Deed> {
   const oRef = await push(ref(getDatabase(), `users/${user.uid}/todos`));
   await set(oRef, deed);
   const oSnapshot = await get(query(oRef));
   const oDeed = oSnapshot.val() as Deed;
   oDeed.key = oRef.key as string;
   return oDeed;
}

export async function getList(user: User): Promise<Deed[]> {
   const oSnapshot = await get(query(ref(getDatabase(), `users/${user.uid}/todos`)));
   const oArr: Deed[] = [];
   let oDeed: Deed;
   oSnapshot.forEach((oDoc) => {
      oDeed = oDoc.val() as Deed;
      oDeed.key = oDoc.key as string;
      oArr.push(oDeed);
   });
   return oArr;
}

export function setDone(user: User, key: string): Promise<void> {
   return set(ref(getDatabase(), `users/${user.uid}/todos/${key}/done`), true);
}

export function del(user: User, key: string): Promise<void> {
   return remove(ref(getDatabase(), `users/${user.uid}/todos/${key}`));
}

