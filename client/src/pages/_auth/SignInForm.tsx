import React, { useState } from 'react';

import SidebarComponent from '../../layout/sidebar/Sidebar';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Sidebar } from 'lucide-react';
import { SidebarProvider } from '../../components/ui/sidebar';
import { SignInFormComponent } from '../../layout/forms/SignInForm';

const SignInComponent: React.FC = () => {
    const [formData, setFormData] = useState({
        //username: "",
        email: "",
        password: ""
    });

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
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full sm:w-[400px] sm:h-[450px] md:w-[400px] md:h-[450px] lg:w-[400px] lg:h-[450px]">
                    <SignInFormComponent />
                    <Card className='w-full max-w-2xl min-w-[400px] flex flex-col justify-between p-10 sm:p-12 shadow-lg mx-auto mt-12'>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">Enter your credentials</CardDescription>
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
                            <div className="mt-4 text-center text-sm">
                                <span>Don't have an account? </span>
                                <a href='/auth/sign-up' className='text-blue-500 hover:text-[#3ac285]'>Sign Up</a>
                                <span> instead</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default SignInComponent;