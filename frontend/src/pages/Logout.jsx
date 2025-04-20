import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  }, [dispatch, navigate]);

  return <p>Logging out...</p>;
}
