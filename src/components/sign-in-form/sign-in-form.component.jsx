import { useState } from 'react';
import { 
    signInWithGooglePopup,
    signInAuthUserWithEmailAndPassword
} from '../../utils/firebase/firebase.utils';

import FormInput from '../form-input/form-input.component';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import './sign-in-form.styles.scss';

const defaultFormFields = {
    email: '',
    password: '',
}

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password, } = formFields;
    
    const signInWithGoogle = async () => {
        const { user } = await signInWithGooglePopup(); 
    }

    const handleChange = (event) => {
        const { name, value }  = event.target;

        setFormFields({...formFields, [name]: value});
    };
    
    const resetForm = () => {
        setFormFields(defaultFormFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault ();
        try {
            const { user } = await signInAuthUserWithEmailAndPassword(email, password);
            resetForm();
        } catch(error){  
            switch(error.code){
                case "auth/wrong-password ":
                    alert('Incorrect password for emails');
                    break;
                case "auth/user-not-found":
                    alert('Incorrect password for emails');
                    break;
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
                    <Button buttonType={BUTTON_TYPE_CLASSES.google} type='button'  onClick={signInWithGoogle}>Google Sign In</Button>
                </div> 
            </form>
        </div>
            
        )
    }

export default SignInForm;