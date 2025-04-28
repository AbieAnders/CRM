import React, { useState } from 'react';

import NavbarComponent from '../../layout/sidebar/Sidebar';
import { SignUpFormComponent } from '../../layout/forms/SignInForm';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { SidebarProvider } from '../../components/ui/sidebar';

const SignUpComponent: React.FC = () => {
    return (
        <>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full sm:w-[400px] sm:h-[450px] md:w-[400px] md:h-[450px] lg:w-[400px] lg:h-[450px]">
                    <SignUpFormComponent />
                </div>
            </div>
        </>
    )
}

export default SignUpComponent;