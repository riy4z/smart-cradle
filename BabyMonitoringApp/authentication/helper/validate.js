import { authenticate } from "./helper";
import Toast from 'react-native-toast-message';

export async function usernameValidate(values){
    const errors = usernameVerify({}, values);
    if(values.username){
       const {status } = await authenticate(values.username);

       if(status !== 200){
        errors.exist = Toast.show('User does not exist...!')
       }
    }    
    return errors;
}


/** validate password */
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

/** validate reset password */
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        errors.exist = Toast.show("Password not match...!");
    }

    return errors;
}

/** validate register form */
export async function registerValidation(values){
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

/** validate profile page */
export async function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}

/** validate username */
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = Toast.show('Username Required...!');
    }else if(values.username.includes(" ")){
        error.username = Toast.show('Invalid Username...!')
    }

    return error;
}

/** validate password */
function passwordVerify(errors = {}, values) {
    /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const capitalLetter = /[A-Z]/;
  
    if (!values.password) {
      errors.password = Toast.show("Password Required...!");
    } else if (values.password.includes(" ")) {
      errors.password = Toast.show("Wrong Password...!");
    } else if (values.password.length < 8) {
      errors.password = Toast.show("Password must be more than 8 characters long");
    } else if (!specialChars.test(values.password)) {
      errors.password = Toast.show("Password must have at least one special character");
    } else if (!capitalLetter.test(values.password)) {
      errors.password = Toast.show("Password must have at least one capital letter");
    }
  
    return errors;
  }
  

/** validate email */
function emailVerify(error ={}, values){
    if(!values.email){
        error.email = Toast.show("Email Required...!");
    }else if(values.email.includes(" ")){
        error.email = Toast.show("Wrong Email...!")
    }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) && !/^[0-9]+@[A-Za-z]+\.[A-Za-z]{2,}$/i.test(values.email)) {
        error.email = Toast.show("Invalid email address...!");
    }

    return error;
}