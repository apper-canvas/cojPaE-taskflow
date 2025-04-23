import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setupAuth, selectIsAuthenticated, selectAuthError } from '../../features/auth/authSlice';

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Setup authentication UI
    dispatch(setupAuth({
      elementId: '#authentication',
      onSuccess: () => {
        navigate('/dashboard');
      }
    }));
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">TaskFlow</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        {/* Authentication container for Apper UI */}
        <div 
          id="authentication" 
          className="min-h-[400px] flex items-center justify-center"
        />
        
        {/* Display authentication errors */}
        {authError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {authError}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;