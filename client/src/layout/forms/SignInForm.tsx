import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { cn } from "../../lib/utils";

export function SignInFormComponent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [organization, setOrganization] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            username,
            email,
            password,
            organization,
        };

        try {
            const response = await fetch("http://localhost:8000/api/auth/sign-up/", {
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
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.acess);
            window.location.href = "/dashboard";
        }
        catch (error) {
            console.error(error);
            setError("Login failed. Revise your credientials");
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
                    <form className="w-full">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="block text-left text-sm">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    required
                                    className="hover:border-[#3ac285]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="block text-sm">Password</Label>
                                    <a href="/auth/forgot-password" className="block text-sm text-blue-500 hover:text-[#3ac285]">Forgot password?</a>
                                </div>
                                <Input id="password" type="password" placeholder="all silver tea cups" required className="hover:border-[#3ac285]" />
                            </div>
                            <Button type="submit" className="w-full hover:border-green-600 dark:bg-[#3ac285] dark:hover:bg-[#32a16d] transition-colors">Sign In</Button>
                            <Button variant="outline" className="w-full hover:border-green-600 dark:bg-[#3ac285] dark:hover:bg-[#32a16d] transition-colors">Login with Google</Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <span>Don't have an account? </span>
                            <a href="/auth/sign-up" className="text-blue-500 hover:text-[#3ac285]">Sign up</a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}