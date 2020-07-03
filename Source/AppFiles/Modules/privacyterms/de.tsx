import * as React from 'react';

const getPrivacyTerms_de=() => {
    return (
        <div className="text">
            <h1 className="ff-title">
                Registrierung
            </h1>
            <p>
                Dieses Addon benötigt Bentuzerinformationen um ein Konto zu eröffnen:
            </p>
            <ul>
                <li>
                    Vorname
                </li>
                <li>
                    Nachname
                </li>
                <li>
                    E-mail Adresse
                </li>
                <li>
                    Passwort
                </li>
            </ul>
            <p>
                Diese Daten werden zu einem externen Service verschlüsselt übermittelt und verschlüsselt aufbewart.
            </p>
            <h1 className="ff-title">
                Login
            </h1>
            <p>
                Dieses Addon benötigt Benutzerinformationen um sich einzuloggen:
            </p>
            <ul>
                <li>
                    E-mail Adresse
                </li>
                <li>
                    Passwort
                </li>
            </ul>
            <p>
                Nachdem Prozess des Einloggens werden diese Informationen verschlüsselt und lokal im eigenen Browsers des Benutzers gespeichert. Diese Speicherung erfolgt so lange, bis man sich eigenstängig ausloggt order
                den lokalen "Browser Cache und Daten" löscht.

                Danach muss man sich erneut authentifizieren.
            </p>
            <h1 className="ff-title">
                LocalStorage
            </h1>
            <p>
                Dieses Addon hat lokal gespeichert Daten:
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
                Alle von den oben genannten Listen werden lokal im Browser gespeichert - localStorage - und von dieser Erweiterung genutzt.
                Alle neu hinzugefügten/ gelöschten Elemente aus den o.g. Listen werden remote gespeichert.
                
                Diese Daten übertragung erfolgt auch verschlüsselt.

                Falls einzelene Einträge aus der Liste entfernt werden, werden diese auch von dem Remote Speichermedium komplett entfernt.
                Falls eine einzelne List aufgerufen wird, werden die lokalen und Remote Daten mit einander synchronisiert.
            </p>
            <h1 className="ff-title">
                Benutzerkonto Löschen
            </h1>
            <p>
                Um ein Benutzerkonto zu löschen muss man derzeitig authentifiziert/ eingeloggt sein und sein eigenes Passwort für die Benutzerprofil Löschung, in das vorgegebene Eingabe Feld, eingeben um zu bestätigen,
                dass Sie auch die Person sind um die es sich eigentlich handelt.

                Nach dem Prozess der Löschung des Benutzerprofiles, wird der Account nicht mehr zur Verfügung stehen.
            </p>
            <h1 className="ff-title">
                Keine Haftung für Schäden jeglicher Art
            </h1>
            <p>
                Diese Erweiterung wird auf eigene Gefahr benutzt und der Autor dieser Applikation übernimmt keine Haftung für Schäden jeglicher Art.
            </p>
        </div>
    );
};

export default getPrivacyTerms_de;