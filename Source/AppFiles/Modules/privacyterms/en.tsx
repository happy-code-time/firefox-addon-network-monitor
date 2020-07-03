import * as React from 'react';

const getPrivacyTerms_en=() => {
    return (
        <div className="text">
            <h1 className="ff-title">
                Registration
            </h1>
            <p>
                This addon requires user information to create an account. 
                1 registration = 1 Account used on all my extension available under my 
                firefox account. 
                
                <br/>
                <br/>

                You can use fake data. 
                
                <br/>
                <br/>

                The only relevant information is the email address.
                If you forgot the password to your account, the passwort reset process will send you an email to 
                your REAL email account otherwise your account is not accessable. 
            </p>
            <ul>
                <li>
                    First name
                </li>
                <li>
                    Surname
                </li>
                <li>
                    E-mail address
                </li>
                <li>
                    Password
                </li>
            </ul>
            <p>
                This data is transmitted encrypted to an external service and stored encrypted.
            </p>

            <h1 className="ff-title">
                Login
            </h1>
            <p>
                This addon needs user information to log in:
            </p>
            <ul>
                <li>
                    E-mail address
                </li>
                <li>
                    Password
                </li>
            </ul>
            <p>
                After the process of logging in, this information is encrypted and stored locally in the user's own browser. This storage is carried out until you log out or order yourself
                clears the local "browser cache and data".

                Then you have to authenticate again.
            </p>
            <h1 className="ff-title">
                LocalStorage
            </h1>
            <p>
                This addon has locally saved data:
            </p>
            <ul>
                <li>
                    Blacklist domains
                </li>
                <li>
                    Blacklist cookies
                </li>
                <li>
                    Blacklist urls
                </li>
                <li>
                    Blacklist urls includes
                </li>
                <li>
                    Blacklist iframes
                </li>
                <li>
                    Whitelist domains
                </li>
                <li>
                    Block HTML by Class, Href and Id
                </li>
            </ul>

            <p>
                All of the above lists are stored locally in the browsers - localStorage - and owned by the browser.
            
                If you are logged in - all of the above lists are stored remotly.
                If your are logged in an you are adding or deleting an list/ list entry, then the same action are made on the remote service/ backend.
            </p>
            <h1 className="ff-title">
                Delete user account
            </h1>
            <p>
                To delete a user account you have to be currently authenticated / logged in and enter your own password for the user profile deletion in the given input field to confirm
                that you are also the person you are talking about.
                After the process of deleting the user profile, the account will no longer be available.
            </p>


            <h1 className="ff-title">
                No liability for damage of any kind
            </h1>
            <p> 
                This extension is used at your own risk and the author of this application assumes no liability for damage of any kind.    
            </p>
        </div>
    );
};

export default getPrivacyTerms_en;