import React, { useState } from 'react';
import { SignInFormComponent } from '../../layout/forms/SignInForm';

const SignInComponent: React.FC = () => {
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