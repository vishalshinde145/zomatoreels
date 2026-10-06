import { useState, FormEvent} from 'react';

import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [role,setRole] = useState<'user' | 'partner'>('user');
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading]=useState<boolean>(false);
    const [message, setMessage]=useState<string>('');

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        try{
            setMessage(`OTP sent to your mail! ${email}`);
        }catch(error){
            console.log(error);
            setMessage("Something went wrong");
        }finally{
            setLoading(false);
        }
    }
}
