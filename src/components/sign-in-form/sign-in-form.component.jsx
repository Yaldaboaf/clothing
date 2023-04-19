import { useState } from 'react';
import { 
    signInWithGooglePopup,
    createUserDocumentFromAuth,
    signInAuthUserWithEmailAndPassword
} from '../../utils/firebase/firebase.utils';
import FormInput from '../form-input/form-input.component';
import './sign-in-form.styles.scss';
import Button from '../button/button.component';


const defaultFormFields = {
    email: '',
    password: '',
}

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password, } = formFields;

    const signInWithGoogle = async () => {
        const { user } = await signInWithGooglePopup(); 
        await createUserDocumentFromAuth(user);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({...formFields, [name]: value});
    };
    
    const resetForm = () => {
        setFormFields(defaultFormFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault ();
        try {
            const response = await signInAuthUserWithEmailAndPassword(email, password);
            console.log(response);
            resetForm();
        } catch(error){ 
            switch(error.code){
                case "auth/wrong-password":
                    alert('Incorrect password for emails');
                case "auth/user-not-found":
                    alert('Incorrect password for emails');
                default:
                    console.log(error);
            }
        };
    }

    return (
        <div className='sign-in-container'>
            <h2>Already have an account?</h2>
            <span>Sign In with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput 
                    label="Email" 
                    type="email" 
                    required 
                    onChange={handleChange} 
                    value={email} 
                    name="email"
                />
                <FormInput 
                    label="Password" 
                    type="password" 
                    required 
                    onChange={handleChange} 
                    value={password} 
                    name="password"
                />
                <div className='buttons-container'>
                    <Button type='submit'>Sign In</Button>
                    <Button type='button' buttonType='google' onClick={signInWithGoogle}>Google Sign In</Button>
                </div>
            </form>
        </div>
            
        )
    }

export default SignInForm;