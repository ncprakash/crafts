'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have more than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    phone_num: z
      .string()
      .length(10, { message: "Phone number must be 10 digits" })
      .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const SignUpForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone_num: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
  try {
    const { username, email, password, phone_num } = values;

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ✅ send only what your backend expects
      body: JSON.stringify({
        username,
        email,
        password,
        phone_num,
      }),
    });

    if (response.ok) {
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/sign-in');
    } else {
      const errorData = await response.json();
      toast.error(errorData?.message || 'Registration failed');
    }
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong. Please try again.');
  }
};

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="johndoe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="mail@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Re-enter password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_num"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
                    <Input {...field} placeholder="9876543210" className="pl-12" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Sign Up
          </Button>
        </form>
      </Form>

      <p className="text-center mt-4 text-gray-600">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
