import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { cn, Logger } from "../../lib/utils";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Check, ChevronsUpDown, Eye, EyeOff } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/ui/command';

export function OrgFormComponent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [organization, setOrganization] = useState("");
    const [orgExists, setOrgExists] = useState(false);
    const [organizations, setOrganizations] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [open, setOpen] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/auth/organizations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setOrganizations(data);
            })
            .catch((err) => {
                Logger.error("Error fetching organizations", err);
                setOrganizations([]);
            });
    }, []);

    useEffect(() => {
        if (organization.trim() !== "") {
            const exists = organizations.some((org) => org.toLowerCase() === organization.toLowerCase());
            setOrgExists(exists);
        } else {
            setOrgExists(false);
        }
    }, [organization, organizations]);

    /*
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (organization.trim() !== "") {
                fetch(`http://127.0.0.1:8000/organizations/check-exists?name=${encodeURIComponent(organization)}`)
                    .then(res => res.json())
                    .then(data => {
                        setOrgExists(data.exists);
                    })
                    .catch(err => {
                        Logger.error("Error checking organization existence", err);
                        setOrgExists(false);
                    });
            } else {
                setOrgExists(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [organization]);*/

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            organization,
            role,
            username,
            email,
            password,
        };
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/sign-up/", { //change the endpoint for production
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
            sessionStorage.setItem("access", data["access-token"]);
            sessionStorage.setItem("refresh", data["refresh-token"]);
            sessionStorage.setItem("role", role);
            navigate("/dashboard");
        }
        catch (error) {
            setErrorMessage("Invalid credentials or error occurred. Please try again.");
            Logger.error("Error Signing in", error);
        }
    };

    const organizationOptions = organizations.map((org) => ({
        value: org,
        label: org,
    }));

    const filteredOrganizations = organizationOptions.filter((org) =>
        org.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription>Register your credentials</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="w-full">
                        <div className="flex flex-col gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="organization" className="block text-left text-sm">Organization</Label>

                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            {organization || "Select organization..."}
                                            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput
                                                value={searchValue}
                                                onValueChange={(value) => setSearchValue(value)}
                                                maxLength={39}
                                                placeholder="Search organization..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No matching organization</CommandEmpty>
                                                <CommandGroup heading="Available">
                                                    {filteredOrganizations.map((org) => (
                                                        <CommandItem
                                                            key={org.value}
                                                            value={org.value}
                                                            onSelect={(currentValue) => {
                                                                setOrganization(currentValue);
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            {org.label}
                                                            <Check
                                                                className={cn("ml-auto h-4 w-4", organization === org.value ? "opacity-100" : "opacity-0")}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                                {searchValue && !organizationOptions.some((org) =>
                                                    org.label.toLowerCase() === searchValue.toLowerCase()) && (
                                                        <CommandItem
                                                            onSelect={() => {
                                                                setOrganization(searchValue);
                                                                setOpen(false);
                                                            }}
                                                            className="text-green-600"
                                                        >
                                                            Register "{searchValue}"
                                                        </CommandItem>
                                                    )}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role" className="block text-left text-sm">Role</Label>

                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="hover:border-[#3ac285]">
                                        <span className="truncate font-normal">
                                            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Organization Role"}
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent className="hover:border-[#3ac285]">
                                        <SelectGroup>
                                            {!orgExists ? (
                                                <SelectItem value="owner">Owner</SelectItem>
                                            ) : (
                                                <>
                                                    <SelectItem value="head">Head</SelectItem>
                                                    <SelectItem value="member">Member</SelectItem>
                                                </>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username" className="block text-left text-sm">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="real person"
                                    required
                                    autoComplete="username"
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
                                    autoComplete="email"
                                    className="hover:border-[#3ac285]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="block text-sm">Password</Label>
                                    <Link to="/auth/forgot-password" className="block text-sm text-blue-500 hover:text-[#3ac285]">Forgot password?</Link>
                                </div>
                                <div className='relative'>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="all silver tea cups"
                                        required
                                        autoComplete="current-password"
                                        className="pr-12 hover:border-[#3ac285]"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-auto text-gray-500 hover:border-[#3ac285] hover:text-[#3ac285] focus:outline-none focus:ring-0"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full hover:border-green-600 dark:bg-[#3ac285] dark:hover:bg-[#32a16d] transition-colors">Sign Up</Button>
                        </div>
                        {errorMessage && (
                            <div className="mt-4 text-center text-red-500">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mt-4 text-center text-sm">
                            <span>Already have an account? </span>
                            <Link to="/auth/sign-in" className="text-blue-500 hover:text-[#3ac285]">Sign In</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}