'use client'
import React from 'react'
import { SubmitHandler,useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import InputField from '@/components/forms/InputField'
import SelectField from '@/components/forms/SelectField'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'
import {CountrySelectField }from '@/components/forms/CountrySelectField'
import FooterLink from '@/components/forms/FooterLink'
import { signUpWithEmail } from '@/lib/actions/auth.actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'



const SignUp = () => {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        
        defaultValues:{
            fullName: '',
            email:'',
            password:'',
            country:'IN',
            investmentGoals:'Growth',
            riskTolerance:'Medium',
            preferredIndustry:'Technology'
        },
        mode: 'onBlur'
    },);
    
    const onSubmit = async (data: SignUpFormData) => {
            try {
                
                const result = signUpWithEmail(data);
                if((await result).success) router.push('/')

            } catch (error) {
                console.error(error);
                toast.error('Sign up failed',{
                    description: error instanceof Error ? error.message: 'Failed to create an account'
                })
            }
    }


    

  return (
    <>
    <h1 className='form-title'>Sign Up & Personalize</h1>

    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'> 
        <InputField
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            register={register}
            error={errors.fullName}
            validation={{required:'Full name is required', minLength: 2}}
        />

        <InputField
    name="email"
    label="Email"
    placeholder="johndoe@gmail.com"
    register={register}
    error={errors.email}
    validation={{
        required: 'Email is required',
        pattern: {
            value: /^\w+@\w+\.\w+$/,
            message: 'Please enter a valid email address',
        },
    }}
/>

        <InputField
            name="password"
            label="Password"
            type='password'
            placeholder="Enter a strong password"
            register={register}
            error={errors.password}
            validation={{required:'Password is required', minLength: 8}}
        />

        <CountrySelectField
            name="country"
            label="Country"
            control={control as any}
            error={errors.country}
            required
        />

        <SelectField
            name="investmentGoals"
            label="Investment Goals"
            control={control as any}
            placeholder="Select your investment goal"
            options={INVESTMENT_GOALS}
            error={errors.investmentGoals}
            required
        />

        <SelectField
            name="riskTolerance"
            label="Risk Tolerance"
            control={control as any}
            placeholder="Select your risk level"
            options={RISK_TOLERANCE_OPTIONS}
            error={errors.riskTolerance}
            required
        />

        <SelectField
            name="preferredIndustry"
            label="Preferred Industry"
            control={control as any}
            placeholder="Select your preferred industry"
            options={PREFERRED_INDUSTRIES}
            error={errors.preferredIndustry}
            required
        />

        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
            {isSubmitting ? 'Creating Account' : 'Start Your Investing Journey'}
        </Button>

        <FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in"/>
    </form>
    </>
  )
}

export default SignUp