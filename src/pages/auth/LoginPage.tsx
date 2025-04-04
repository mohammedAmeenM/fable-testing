import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { loginUser } from '../../api/services/authServices';
import { LoginSchema } from '../../validation/ValidationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/redux';
import { loginSuccess } from '../../redux/slices/authSlice';


// Define the form values interface
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Define the status state interface
interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

// Create validation schema with Yup


const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rememberedEmail = useSelector((state: RootState) => state.auth.userEmail);

  // Initial form values
  const initialValues: LoginFormValues = {
    email: rememberedEmail || '',
    password: '',
    rememberMe: false
  };

  // Form submission handler with proper types
  const handleSubmit = async (
    values: LoginFormValues, 
    { setSubmitting, setStatus }: FormikHelpers<LoginFormValues>
  ) => {
    // Clear any previous status messages
    setStatus(undefined);
    
    try {
      // Call the signin API endpoint
     const response:any = await loginUser(values)

      if (response.data.accessToken || response.data.userId) {
             // Store authentication state in Redux
             dispatch(loginSuccess({ userId:response.data.userId,accessToken: response.data.accessToken, email: values.rememberMe ? values.email : '' }));
     
             setStatus({ type: 'success', message: 'Login successful! Redirecting...' } as StatusMessage);
             
             setTimeout(() => {
               navigate('/');
             }, 1500);
           }
     
      
    } catch (error) {
      console.error('Login error:', error);
      
   
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 py-4">
          <h2 className="text-center text-white text-2xl font-bold">Welcome Back</h2>
        </div>
        
        <div className="p-8">
          {/* Welcome text */}
          <div className="text-center mb-8">
            <p className="text-gray-600">Sign in to access your account</p>
          </div>
          
          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status, errors, touched }) => (
              <Form>
                {/* Display status messages */}
                {status && (
                  <div className={`mb-4 p-3 rounded ${
                    (status as StatusMessage).type === 'success' 
                      ? 'bg-green-100 border border-green-400 text-green-700' 
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    {(status as StatusMessage).message}
                  </div>
                )}
                
                {/* Email field */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                    placeholder="you@example.com"
                  />
                  <ErrorMessage 
                    name="email" 
                    component="p" 
                    className="mt-1 text-xs text-red-500" 
                  />
                </div>
                
                {/* Password field */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                      Password
                    </label>
                    <span 
                      onClick={() => navigate('/forgot-password')} 
                      className="text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      Forgot password?
                    </span>
                  </div>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage 
                    name="password" 
                    component="p" 
                    className="mt-1 text-xs text-red-500" 
                  />
                </div>
                
                {/* Remember me checkbox */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <Field
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                </div>
                
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-medium ${
                    isSubmitting 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </Form>
            )}
          </Formik>
          
          {/* Signup option */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <span 
                onClick={() => navigate('/signup')} 
                className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
          
          {/* Alternative login options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200">
                Google
              </button>
              
              <button type="button" className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(LoginPage);