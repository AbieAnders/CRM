import React from 'react';
import { ResetPasswordComponent } from '../../layout/forms/ResetPasswordForm';

const ForgotPasswordComponent: React.FC = () => {
    return (
        <>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full sm:w-[400px] sm:h-[450px] md:w-[400px] md:h-[450px] lg:w-[400px] lg:h-[450px]">
                    <ResetPasswordComponent />
                </div>
            </div>
        </>
    )
}

export default ForgotPasswordComponent;