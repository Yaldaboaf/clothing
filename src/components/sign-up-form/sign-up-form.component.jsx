import { useState } from 'react';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import FormInput from '../form-input/form-input.component.jsx';
import './sign-up-form.styles.scss';
import '../button/button.component.jsx';
import Button from '../button/button.component.jsx';


const defaultFormFields = {
    displayName : '',
    email: '',
    password: '',
    confirmPassword: '',
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({...formFields, [name]: value});
    };
    
    const resetForm = () => {
        setFormFields(defaultFormFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault ();

        if(password !== confirmPassword) {
                alert ('password do not match');
            return;
        }
        
        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);
            await createUserDocumentFromAuth(user, { displayName });
            resetForm();
        } catch(error){ 
            console.log('user creation encountered an error', error)
        }
    };

    return (
        <div className='sign-up-container'>
            <h2>Dont have an account?</h2>
            <span>Sign Up with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Dispay Name" 
                    type="text" 
                    required 
                    onChange={handleChange} 
                    value={displayName} 
                    name="displayName"
                />
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
                <FormInput 
                    label="Confirm Password" 
                    type="password" 
                    required 
                    onChange={handleChange} 
                    value={confirmPassword} 
                    name="confirmPassword"/>
                <Button buttonType='google' type='submit'>Sign Up</Button>
            </form>
        </div>
        
    )
}

export default SignUpForm;