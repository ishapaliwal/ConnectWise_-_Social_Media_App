import { useAuth } from '../contexts/AuthContext';

const { currentUser } = useAuth();
console.log("logged in user ID", currentUser?.id);