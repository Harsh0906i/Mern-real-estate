import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../Firebas';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Redux/user/userSlice';
export default function Oauth() {
    const dispatch = useDispatch();
    async function HandleGoogleClick() {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            console.log(result);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <button type='button' onClick={HandleGoogleClick} className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ">
            Continue with Google
        </button>
    )
}
