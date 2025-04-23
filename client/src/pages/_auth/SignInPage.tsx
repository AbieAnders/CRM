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
                    
                </div>
            </div>
        </>
    )
}

export default SignInComponent;