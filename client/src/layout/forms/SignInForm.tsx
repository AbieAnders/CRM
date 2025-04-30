import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { cn, Logger } from "../../lib/utils";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function SignInFormComponent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [organization, setOrganization] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            organization,
            username,
            email,
            password,
        };
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/sign-in/", { //change the endpoint for production
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            const data = await response.json();

            //tokens
            sessionStorage.setItem("access", data["access-token"]);
            sessionStorage.setItem("refresh", data["refresh-token"]);

            //org data for tables
            sessionStorage.setItem("organization", organization);
            sessionStorage.setItem("username", username);

            navigate("/dashboard");
        }
        catch (error) {
            setErrorMessage("Invalid credentials or error occurred. Please try again.");
            Logger.error("Error Signing in", error);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription>Enter your credentials</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="w-full">
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
                                <Label htmlFor="username" className="block text-left text-sm">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="real person"
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
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="block text-sm">Password</Label>
                                    <a href="/auth/forgot-password" className="block text-sm text-blue-500 hover:text-[#3ac285]">Forgot password?</a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="password"
                                    required
                                    className="hover:border-[#3ac285]"
                                />
                            </div>
                            <Button type="submit" className="w-full hover:border-green-600 dark:bg-[#3ac285] dark:hover:bg-[#32a16d] transition-colors">Sign In</Button>
                        </div>
                        {errorMessage && (
                            <div className="mt-4 text-center text-red-500">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mt-4 text-center text-sm">
                            <span>Don't have an account? </span>
                            <a href="/auth/sign-up" className="text-blue-500 hover:text-[#3ac285]">Sign Up</a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}