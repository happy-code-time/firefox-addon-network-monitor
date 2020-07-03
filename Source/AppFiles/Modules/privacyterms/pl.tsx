import * as React from 'react';

const getPrivacyTerms_pl=() => {
    return (
        <div className="text">
            <h1 className="ff-title">
                Rejestracja
            </h1>
            <p>
                Ten dodatek wymaga informacji o użytkowniku, aby otworzyć konto:
            </p>
            <ul>
                <li>
                    Imię
                </li>
                <li>
                    Nazwisko
                </li>
                <li>
                    Adres e-mail
                </li>
                <li>
                    Hasło
                </li>
            </ul>
            <p>
                Dane są przesyłane w postaci zaszyfrowanej do usługi zewnętrznej i przechowywane w postaci zaszyfrowanej.
            </p>
            <h1 className="ff-title">
                Login
            </h1>
            <p>
                Ten dodatek potrzebuje informacji o użytkowniku, aby się zalogować:
            </p>
            <ul>
                <li>
                    Adres e-mail
                </li>
                <li>
                    Hasło
                </li>
            </ul>
            <p>
                Po zalogowaniu się informacje są szyfrowane i przechowywane lokalnie we własnej przeglądarce użytkownika. Przechowywanie odbywa się do momentu wylogowania lub samodzielnego zamówienia
                usuwa lokalną „pamięć podręczną przeglądarki i dane”.

                Następnie musisz ponownie uwierzytelnić.
            </p>
            <h1 className="ff-title">
                LocalStorage
            </h1>
            <p>
                Ten dodatek zapisujhe dane lokalnie:
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
            </ul>
            <p>
                Wszystkie powyższe listy są rozpoznawane lokalnie w przeglądarce - localStorage.
                Wszystkie nowe lub kasowane elementy z tych list są przechowywane na zdalnym serwerze.
                Te dane są synchronizowane podczas odwiedzania stron list, dodawanie lub kasowanie elementów do jednej z list.
                Wtedy gdy element zostanie skasowany, nie ma możliwości jego odzyskania. 
            </p>
            <h1 className="ff-title">
                Usuń konto użytkownika
            </h1>
            <p>
                Aby usunąć konto użytkownika, musisz być aktualnie uwierzytelniony / zalogowany i wprowadź swoje hasło w celu usunięcia profilu użytkownika w określonym polu wejściowym, aby potwierdzić
                że jesteś także osobą, o której mówisz.

                Po usunięciu profilu użytkownika konto nie będzie już dostępne.
            </p>
            <h1 className="ff-title">
                Nie ponosimy odpowiedzialności za jakiekolwiek szkody
            </h1>
            <p>
                To rozszerzenie jest używane na własne ryzyko, a autor tej aplikacji nie ponosi żadnej odpowiedzialności za jakiekolwiek szkody.
            </p>
        </div>
    );
};

export default getPrivacyTerms_pl;