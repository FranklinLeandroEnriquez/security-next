"use client"

import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticate } from "@/services/Auth/AuthService"
import { LoginRequest } from "@/types/Auth/LoginRequest"
import { AuthResponse } from "@/types/Auth/AuthResponse"
import { Tally1 } from 'lucide-react'
import Image from 'next/image';
import { useState } from "react"
import { useSessionAuth } from "@/hooks/useSessionAuth"
import { toast } from "sonner";
import { ErrorResponse } from "@/types/shared/ValidationError"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation";


export default function Home() {
  const [login, setLogin] = useState<LoginRequest>(
    {
      ip: "192.168.0.1",
      username: "",
      password: ""
    }
  )

  const router = useRouter();

  const { saveAuthResponse } = useSessionAuth();

  const handleLogin = async () => {
    await authenticate(login).then(async res => {
      if (res.status != 201) {
        await res.json().then((data: ErrorResponse) => {
          toast.error(data.message.toString());
        })
      }
      else {
        await res.json().then((data: AuthResponse) => {
          if (!data.functions.includes("SEC-LOGIN")) {
            toast.error("You don't have permission to access");
            return;
          }
          else {
            saveAuthResponse(data)
            return router.push("/dashboard/user");
          }

        })
      }
    })
  }


  return <>

    <Toaster richColors position="top-center" />

    <MaxWidthWrapper>
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgroundUTN.jpg"
          alt="Background UTN"
          width={1920}
          height={1080}
          className="object-cover object-center w-full h-full hidden md:block"
        />
        <div className="absolute inset-0 bg-black opacity-65"></div>
      </div>
      <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
        <div className="w-full m-auto bg-white sm:max-w-sm rounded-2xl">
          <Card >
            <CardHeader className="space-y-1">
              <div className="mr-5 mb-7 mt-3 justify-center flex flex-initial items-center">
                <Tally1 color="#FFD700" size={35} />
                <span className="font-bold text-2xl">
                  SECURITY UTN
                </span>
              </div>
              <CardTitle className="text-2xl text-center">
                Sign in
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to login
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username/Email</Label>
                <Input id="username" type="text" placeholder="Enter your email or username"
                  onChange={(e) => {
                    setLogin({
                      ...login,
                      username: e.target.value
                    })
                  }}
                  value={login.username} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password"
                  onChange={(e) => {
                    setLogin({
                      ...login,
                      password: e.target.value
                    })
                  }}
                  value={login.password} />
              </div>
              {/* <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div> */}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" onClick={(e) => { handleLogin() }}>Login</Button>
              {/* <p className="mt-2 text-xs text-center text-gray-700">
                {" "}
                Create an account?{" "}
                <span className=" text-blue-600 hover:underline">Sign up</span>
              </p> */}
            </CardFooter>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  </>
}
