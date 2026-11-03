"use client";

import { useRouter } from "next/navigation";
import { Backdrop } from "@/components/tailgrids/core/overlay";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/tailgrids/core/dialog";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/tailgrids/core/input-group";
import { Eye, Keyboard, EyeDisabled } from "@tailgrids/icons";
import { useState } from "react";
import { login  } from "@/data/credential";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = () => {
    const userDom = document.getElementById("user") as HTMLInputElement;
    const passDom = document.getElementById("pass") as HTMLInputElement;
    const user = userDom.value.trim();
    const pass = passDom.value.trim();

    if (user === "") {
      userDom.focus();
      alert("Error : user is required");
      return;
    }
    if (pass === "") {
      passDom.focus();
      alert("Error : password is required");
      return;
    }

    // call login (api)
    login(`${user}@company.com`, pass)
      .then((credential) => {
        localStorage.setItem("credential", JSON.stringify(credential));
        const returnPath = localStorage.getItem("returnPath") || "/";
        localStorage.removeItem("returnPath");
        router.replace(returnPath);
        router.refresh();
      })
      .catch((error) => {
        userDom.value = '';
        passDom.value = '';
        userDom.focus();
        alert(`Error : ${error}`);
      });
  };

  return (
    <Backdrop isOpen={true}>
      <Dialog showCloseButton={false} className="w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Who are you?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {/* Login form content */}
            <InputGroup className="mt-2">
              <InputGroupAddon align="inline-start">
                <Keyboard />
              </InputGroupAddon>
              <InputGroupInput id="user" placeholder="user | admin | manager" />
              <InputGroupAddon align="inline-end">@company.com</InputGroupAddon>
            </InputGroup>

            <InputGroup className="mt-2">
              <InputGroupAddon align="inline-start">
                <InputGroupButton
                  aria-label="Show password"
                  className="w-fit px-0 hover:bg-transparent opacity-75 data-hovered:opacity-100"
                  onPress={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeDisabled /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput
                id="pass"
                placeholder="pass"
                type={showPassword ? "text" : "password"}
              />
            </InputGroup>
        </DialogBody>

        <DialogFooter>
          <DialogClose
            appearance="outline"
            className="bg-white-500 text-black"
            onClick={() => handleLogin()}
          >
            Login
          </DialogClose>
        </DialogFooter>
      </Dialog>
    </Backdrop>
  );
}
