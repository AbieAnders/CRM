import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { cn, Logger } from "../../lib/utils";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';

export function ResetPasswordComponent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showOTP, setShowOTP] = useState(false);

    const navigate = useNavigate();

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            organization,
            email,
        };
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/reset-password/", { //change the endpoint for production
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            //const data = await response.json();

            setShowOTP(true);

            //tokens
            //sessionStorage.setItem("access", data["access-token"]);
            //sessionStorage.setItem("refresh", data["refresh-token"]);

            //org data for tables
            //sessionStorage.setItem("organization", organization);

            //navigate("/dashboard");
        }
        catch (error) {
            setErrorMessage("Invalid credentials or error occurred. Please try again.");
            Logger.error("Error Signing in", error);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription>Enter your organization and email</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordReset} className="w-full">
                        <div className="flex flex-col gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="organization" className="block text-left text-sm">Organization</Label>
                                <Input
                                    id="organization"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    placeholder="ABEX"
                                    required
                                    className="hover:border-[#3ac285]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="block text-left text-sm">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                    className="hover:border-[#3ac285]"
                                />
                            </div>
                            
                            <Button type="submit" className="w-full hover:border-green-600 dark:bg-[#3ac285] dark:hover:bg-[#32a16d] transition-colors">Request OTP</Button>
                        </div>
                        {errorMessage && (
                            <div className="mt-4 text-center text-red-500">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mt-4 text-center text-sm">
                            <span>Remembered your password? </span>
                            <a href="/auth/sign-in" className="text-blue-500 hover:text-[#3ac285]">Sign In</a>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {showOTP && (
                <div className="flex items-center">
                    <InputOTP maxLength={5}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                        </InputOTPGroup>
                    </InputOTP>
                </div>
            )}
        </div>
    )
}