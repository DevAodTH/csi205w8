import { useRouter } from "next/navigation";
import {Credential, logout} from "@/data/credential";

type Router = ReturnType<typeof useRouter>;

export const checkLogin = (router: Router, returnPath: string) => {
  //   backup return
  localStorage.setItem("returnPath", returnPath);
  //   check Credential
  const credentialString = localStorage.getItem("credential");
  if (credentialString !== null) {
    // ok
    const { token, email, name, role }: Credential = JSON.parse(credentialString);
    if (
      token === undefined ||
      email === undefined ||
      name === undefined ||
      role === undefined
    ) {
      router.replace('/login');
      router.refresh();
    }else{
        //success
        router.replace(returnPath);
        router.refresh();
    }
  } else {
    // fail
    router.replace('/login');
    router.refresh();
  }
};

export const doLogout = (router: Router , returnPath: string) => {
  const credentialString = localStorage.getItem("credential");
  if (credentialString !== null) {
    
    const {token} : Credential = JSON.parse(credentialString);
    logout(token)
    .then(()=>{})
    .catch(()=>{})
    .finally(()=>{
      localStorage.removeItem("credential");
      router.replace(returnPath);
      router.refresh();
    });
  }else{
    router.replace(returnPath);
    router.refresh();
  }
};