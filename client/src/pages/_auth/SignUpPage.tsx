import React, { useState } from 'react';

import NavbarComponent from '../../layout/sidebar/Sidebar';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { SidebarProvider } from '../../components/ui/sidebar';

const SignUpComponent: React.FC = () => {
    const [formData, setFormData] = useState({
        organization: "",
        username: "",
        email: "",
        password: ""
    });

    const [orgList, setOrgList] = useState<string[]>(["OpenAI", "TechVerse", "DevGroup"]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign in data submitted:", formData);
        // move to the dashboard if successful auth
    }

    return (
        <>
            <Card className='w-full max-w-2xl min-w-[400px] flex flex-col justify-between p-10 sm:p-12 shadow-lg mx-auto mt-12'>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Register your credentials</CardDescription>
                </CardHeader>
                <CardContent className=''>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <Label htmlFor='email' className='block text-left text-sm text-gray-600'>Email</Label>
                            <Input name='email' type='email' value={formData.email} onChange={handleChange} required className='text-gray-600 hover:border-[#3ac285]' />
                        </div>
                        <div>
                            <Label htmlFor='password' className='block text-left text-sm text-gray-600'>Password</Label>
                            <Input name='password' type='password' value={formData.password} onChange={handleChange} required className='text-gray-600 hover:border-[#3ac285]' />
                        </div>
                        <Button type='submit' className='w-full hover:border-green-600 dark:bg-[#3ac285] dark:hover:bg-[#32a16d] transition-colors'>Sign In</Button>
                    </form>
                    <div className='text-sm mt-4'>
                        <span>Have an account? </span>
                        <a href='/auth/sign-in' className='text-blue-500 hover:text-[#3ac285]'>Sign In</a>
                        <span> instead</span>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default SignUpComponent;