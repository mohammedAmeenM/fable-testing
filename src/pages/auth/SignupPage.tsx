import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { signupUser } from '../../api/services/authServices';
import { RootState } from '../../app/redux';
import { useDispatch, useSelector } from 'react-redux';
import { signupSuccess } from '../../redux/slices/authSlice';
import { SignupSchema } from '../../validation/ValidationSchema';

// Define the form values interface
interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

// Define the status state interface
interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Accessing userEmail from Redux state
  const rememberedEmail = useSelector((state: RootState) => state.auth.userEmail);

  // Initial form values
  const initialValues: SignupFormValues = {
    email: rememberedEmail || '', 
    password: '',
    confirmPassword: ''
  };

  // Form submission handler with proper types
  const handleSubmit = async (
    values: SignupFormValues, 
    { setSubmitting, setStatus, resetForm }: FormikHelpers<SignupFormValues>
  ) => {
    // Clear any previous status messages
    setStatus(undefined);
    
    try {
      // Call the signup API endpoint
      const response: any = await signupUser(values);

      console.log('Signup response:', response);
      

      if (response.data.data.accessToken|| response.data.data.id) {
         localStorage.setItem('token', response.data.data.accessToken);

        dispatch(signupSuccess({ userId: response.data.data.id, email: values.email }));
        setStatus({
          type: 'success',
          message: 'Account created successfully! Redirecting to login...'
        } as StatusMessage);
        
        // Reset the form
        resetForm();

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/create/profile');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 py-4">
          <h2 className="text-center text-white text-2xl font-bold">Create Account</h2>
        </div>
        
        <div className="p-8">
          {/* Welcome text */}
          <div className="text-center mb-8">
            <p className="text-gray-600">Join us today and start your journey</p>
          </div>
          
          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
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
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
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
                  <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
                </div>
                
                {/* Confirm Password field */}
                <div className="mb-8">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage 
                    name="confirmPassword" 
                    component="p" 
                    className="mt-1 text-xs text-red-500" 
                  />
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
                      Processing...
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </Form>
            )}
          </Formik>
          
          {/* Login option */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <span 
                onClick={() => navigate('/login')} 
                className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                Sign in
              </span>
            </p>
          </div>
          
          {/* Alternative signup options */}
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

export default memo(SignupPage);