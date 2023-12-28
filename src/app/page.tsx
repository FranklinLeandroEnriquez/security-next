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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from '../components/Incon';
import Image from 'next/image';



export default function Home() {
  return <>

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
                <Icon name="tally-1" color="#FFD700" size={35} />
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
                <Label htmlFor="email">Username/Email</Label>
                <Input id="email" type="email" placeholder="Enter your email or username" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full">Login</Button>
              <p className="mt-2 text-xs text-center text-gray-700">
                {" "}
                Create an account?{" "}
                <span className=" text-blue-600 hover:underline">Sign up</span>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  </>
}
