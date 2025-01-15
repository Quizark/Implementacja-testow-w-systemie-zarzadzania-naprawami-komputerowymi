# Testowanie i Jakość Oprogramowania

# Stanisław Mendel 35684

# Implementacja testów w systemie zarządzania naprawami komputerowymi

# Opis projektu

Projekt "Implementacja testów w systemie zarządzania naprawami komputerowymi" ma na celu opracowanie i wdrożenie testów jednostkowych oraz integracyjnych dla funkcji systemu. System ten umożliwia zarządzanie naprawami urządzeń, w tym monitorowanie statusów napraw, zarządzanie danymi klientów, urządzeń oraz pracowników, a także administrowanie dostępem użytkowników.

# Uruchamianie projektu

Aby poprawnie uruchomić aplikację, należy wykonać następujące kroki:

1. **Uruchamianie całej Aplikacji**
   - Przejdź do katalogu głównego projektu, następnie uruchom `Run_Full_App.bat`.
      Plik ten automatycznie uruchomi API oraz aplikację internetową.
2. **Uruchomienie serwera API**  
   - Przejdź do katalogu głównego projektu, następnie uruchom `Run_Api.bat`.

3. **Uruchomienie serwisu Angular**  
   - Przejdź do katalogu głównego projektu, następnie uruchom `Run_App.bat`.

4. **Uruchomienie wszystkich testów**  
   - Przejdź do katalogu głównego projektu, następnie uruchom `Run_All_Tests.bat`. Plik ten automatycznie uruchomi testy dla springboot oraz dla angulara.

5. **Uruchomienie testów Angular** 
   - Przejdź do katalogu głównego projektu, następnie uruchom `test_angular.bat`.

6. **Uruchomienie testów SpringBoot** 
   - Przejdź do katalogu głównego projektu, następnie uruchom `test_springboot.bat`

# Testy

## Testy integracyjne

1. [shouldCreateDeviceSuccessfully](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/DeviceControllerTest.java#L29-L48) 
- Testuje endpoint POST /devices/create.
- Sprawdza, czy można poprawnie utworzyć urządzenie przy użyciu prawidłowego tokenu sesji.
- Weryfikuje, czy odpowiedź zawiera status 201 Created, odpowiedni komunikat i poprawne dane utworzonego urządzenia.
---
2. [shouldReturnDevicesByEmail](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/DeviceControllerTest.java#L50-L62)
- Testuje endpoint GET /devices/email/{email}.
- Sprawdza, czy można pobrać listę urządzeń przypisanych do danego adresu e-mail przy użyciu prawidłowego tokenu sesji.
- Weryfikuje, czy odpowiedź zwraca status 200 OK i jest w formacie JSON.
---
3. [shouldReturnDeviceNotFoundWhenDeviceDoesNotExist](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/DeviceControllerTest.java#L64-L78)
- Testuje endpoint GET /devices/deviceWithDetails.
- Sprawdza, czy aplikacja zwraca status 404 Not Found i odpowiedni komunikat w przypadku, gdy urządzenie o podanych parametrach (kod i e-mail) nie istnieje.
---
4. [shouldGetAllPersonsWhenSessionIsValid](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/PersonControllerTest.java#L46-L57)
- Testuje endpoint GET /persons.
- Sprawdza, czy można poprawnie pobrać listę wszystkich osób przy użyciu prawidłowego tokenu sesji.
- Weryfikuje, czy odpowiedź zwraca status 200 OK i jest w formacie JSON.
---
5. [shouldCreateNewUser](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/PersonControllerTest.java#L58-L75)
- Testuje endpoint POST /persons/create.
- Sprawdza, czy można poprawnie utworzyć nową osobę przy użyciu prawidłowego tokenu sesji.
- Weryfikuje, czy odpowiedź zwraca status 201 Created.
---
6. [shouldNotCreatePersonWithDuplicateEmail](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/PersonControllerTest.java#L76-L94)
- Testuje endpoint POST /persons/create.
- Sprawdza, czy aplikacja uniemożliwia utworzenie nowej osoby z duplikatem adresu e-mail istniejącego w bazie danych.
- Weryfikuje, czy odpowiedź zwraca status 409 Conflict oraz komunikat "Email already in use".
---
7. [shouldGetTasksForUserWithValidSession](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/TaskControllerTest.java#L32-L43)
- Testuje endpoint GET /tasks/{email}.
- Sprawdza, czy można poprawnie pobrać listę zadań przypisanych do użytkownika z podanym adresem e-mail przy użyciu prawidłowego tokenu sesji.
- Weryfikuje, czy odpowiedź zwraca status 200 OK.
---
8. [shouldRegisterNewUser](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/UserControllerRegisterTest.java#L41-L56)
- Testuje endpoint POST /users/register.
- Sprawdza, czy można poprawnie zarejestrować nowego użytkownika przy użyciu poprawnych danych (adres e-mail, hasło, imię, nazwisko).
- Weryfikuje, czy odpowiedź zwraca status 201 Created.
---
9. [shouldNotRegisterExistingUser](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/UserControllerRegisterTest.java#L58-L73)
- Testuje endpoint POST /users/register.
- Sprawdza, czy aplikacja zwraca odpowiedni błąd, gdy użytkownik próbuje zarejestrować się z już istniejącym adresem e-mail.
- Weryfikuje, czy odpowiedź zwraca status 409 Conflict.

---
10. [shouldNotRegisterUserWithBadEmail](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/UserControllerRegisterTest.java#L75-L90)
- Testuje endpoint POST /users/register.
- Sprawdza, czy aplikacja zwraca błąd, gdy użytkownik próbuje zarejestrować się z nieprawidłowym formatem adresu e-mail.
- Weryfikuje, czy odpowiedź zwraca status 400 Bad Request oraz odpowiedni komunikat o błędzie: "Invalid email format".

---
11. [shouldUpdateUserIsAdminToTrue](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/spring-boot-mongodb/src/test/java/com/example/springbootmongodb/test/UserControllerTest.java#L34-L62)
- Testuje endpoint PUT /users/{id}.
- Sprawdza, czy można poprawnie zaktualizować wartość pola isAdmin użytkownika na true, korzystając z prawidłowego tokenu sesji.
- Weryfikuje, czy odpowiedź zwraca status 200 OK oraz czy pole isAdmin w zwróconych danych użytkownika ma wartość true.
---

## Testy jednostkowe

1. [should filter tasks based on search query](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/notificationscreen/notificationscreen.component.spec.ts#L35-L50)
- Testuje funkcjonalność filtrowania zadań na podstawie zapytania wyszukiwania.
- Sprawdza, czy lista zadań jest poprawnie filtrowana na podstawie podanego zapytania. 
- Weryfikuje, czy po wywołaniu metody handleSearch zadania zostały odpowiednio przefiltrowane, a liczba wyników oraz opis zadania odpowiadają oczekiwaniom.
---
2. [checking if the task list is loaded](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/notificationscreen/notificationscreen.component.spec.ts#L51-L66)
- Testuje, czy lista zadań jest poprawnie ładowana. 
- Sprawdza, czy po wywołaniu metody loadTasks lista zadań jest poprawnie załadowana z mockowanego serwisu. 
- Weryfikuje, czy po załadowaniu danych lista tasks i filteredTasks zawiera te same dane, co mockowane zadania.
---
3. [should submit valid form and call API](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/search-for-client/search-for-client.component.spec.ts#L30-L48)
- Testuje, czy formularz jest poprawnie wysyłany i wywołuje odpowiedni endpoint API. 
- Sprawdza, czy po wypełnieniu formularza z prawidłowymi danymi i jego wysłaniu, metoda getDeviceWithDetails jest wywoływana z odpowiednimi parametrami. 
- Weryfikuje, czy po otrzymaniu odpowiedzi od API, następuje przekierowanie użytkownika na stronę /ClientFinalScreen z odpowiednimi danymi urządzenia.
---
4. [should not call fetchPersonDataByEmail if session token is missing](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/workprogressdetialscreen/workprogressdetialscreen.component.spec.ts#L60-L74)
- Testuje, czy metoda fetchPersonDataByEmail nie jest wywoływana, gdy brak jest tokenu sesji. 
- Sprawdza, czy w przypadku, gdy token sesji jest null, metoda fetchPersonDataByEmail nie zostanie wywołana. 
- Weryfikuje, czy personData jest ustawione na pusty obiekt w takim przypadku.
---
5. [should log error if session token is null](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/workprogressdetialscreen/workprogressdetialscreen.component.spec.ts#L76-87)
- Testuje, czy logowany jest błąd, gdy token sesji jest null. 
- Sprawdza, czy w przypadku, gdy token sesji jest null, zostanie wywołana funkcja console.error z odpowiednim komunikatem o błędzie. 
- Weryfikuje, czy komunikat o braku tokenu sesji pojawi się w konsoli.
---
6. [should update tasks after marking a task as done](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/notificationdonescreen/notificationdonescreen.component.spec.ts#L45-L56)
- Testuje, czy lista zadań jest aktualizowana po oznaczeniu zadania jako zakończonego. 
- Sprawdza, czy po wywołaniu metody markTaskAsDone z odpowiednim identyfikatorem zadania, metoda markTaskAsDone w ApiConnectionService jest wywoływana z odpowiednimi argumentami. 
- Weryfikuje, czy po zakończeniu zadania metoda fetchTasks jest wywoływana, aby zaktualizować listę zadań.
---
7. [should log error when fetching tasks fails](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/notificationdonescreen/notificationdonescreen.component.spec.ts#L58-L68)
- Testuje, czy błąd jest logowany, gdy pobieranie zadań kończy się niepowodzeniem. 
- Sprawdza, czy w przypadku błędu podczas wywołania metody fetchTasks (symulowanego przez throwError), w konsoli zostanie zalogowany odpowiedni komunikat o błędzie. 
- Weryfikuje, czy komunikat o błędzie jest wyświetlany z obiektem błędu.
---
8. [should submit login form and navigate to home on success](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/loginscreen/loginscreen.component.spec.ts#L43-L59)
- Testuje, czy formularz logowania jest poprawnie przesyłany, a użytkownik jest przekierowywany na stronę główną po pomyślnym logowaniu. 
- Sprawdza, czy po wywołaniu metody handleSubmit z odpowiednimi danymi logowania (adres e-mail i hasło), metoda login w serwisie ApiConnectionService jest wywoływana z poprawnymi parametrami (adres e-mail i hasło). 
- Weryfikuje, czy po uzyskaniu poprawnej odpowiedzi (zawierającej token sesji), użytkownikowy e-mail i token sesji są ustawiane w serwisie UserService, a także czy wyświetlany jest komunikat o pomyślnym logowaniu. Na końcu sprawdza, czy następuje przekierowanie użytkownika do strony głównej (/home).

---
9. [should display an error message on login failure](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/AplikacjaInternetowa/src/app/screens/loginscreen/loginscreen.component.spec.ts#L61-L73)
- Testuje, czy komunikat o błędzie jest wyświetlany, gdy logowanie kończy się niepowodzeniem. 
- Sprawdza, czy po wywołaniu metody handleSubmit z niepoprawnymi danymi logowania (złym hasłem), metoda login w serwisie ApiConnectionService jest wywoływana z odpowiednimi parametrami. 
- Następnie, po uzyskaniu błędu, testuje, czy odpowiedni komunikat o błędzie jest wyświetlany w postaci powiadomienia za pomocą MatSnackBar.

---
10. [should initialize the form with employee data]()
- Testuje, czy formularz jest inicjalizowany z danymi pracownika. 
- Sprawdza, czy po załadowaniu komponentu formularz zawiera odpowiednie dane (imię, nazwisko, email, specjalizacja) dla pracownika, którego dane są przekazywane przez history.state. 
- Weryfikuje, czy status administratora (isAdmin) jest ustawiony poprawnie.
---
11. [should toggle admin status and update the server]()
- Testuje, czy po zmianie statusu administratora zostaje on poprawnie zaktualizowany na serwerze. 
- Sprawdza, czy metoda toggleAdmin w serwisie ApiConnectionService jest wywoływana z odpowiednimi parametrami.
- Weryfikuje czy status administratora (isAdmin) komponentu zmienia się zgodnie z oczekiwaniami (z true na false).
---
12. [should save employee data and navigate back]()
- Testuje, czy dane pracownika są poprawnie zapisane i użytkownik zostaje przekierowany z powrotem. 
- Sprawdza, czy metoda saveEmployee w serwisie ApiConnectionService jest wywoływana z odpowiednimi parametrami. 
- Weryfikuje, czy po zapisaniu danych wywoływana jest metoda goBack, która ma na celu nawigację z powrotem.
---
13. [should delete employee and navigate back]()
- Testuje, czy pracownik jest poprawnie usuwany i użytkownik zostaje przekierowany z powrotem. 
- Sprawdza, czy metoda deleteEmployee w serwisie ApiConnectionService jest wywoływana z odpowiednim identyfikatorem pracownika (który jest pusty w tym teście).
- Weryfikuje czy po usunięciu wywoływana jest metoda goBack.


# Dokementacja API

![Obraz dokumentacji API](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/blob/main/Dokumentacja%20API.png)

[Dokumentacja API w SwaggerHub](https://app.swaggerhub.com/apis/akademiatarnowska-920/Implementacja_Testow_Systemu_Zarzadzania_Naprawami/1.0.0)

[Dokumentacja Lokalna znajduje się tutaj](https://github.com/Quizark/Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi/tree/main/Dokumentacja%20API) - wystarczy pobrać i uruchomić index.html

[Dokumentacja API w SwaggerUI](http://localhost:8080/swagger-ui/index.html) - dostępna  po uruchomieniu aplikacji serwerowej

# Przypadki testowe dla testera manualnego (TestCase) 

| **ID**        | **TSZNIT001**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Dodanie nowego klienta do systemu                                              |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu.                  |
| **Kroki testowe** | 1. Naciśnij przycisk Add New Client.                                          |
|               | 2. Uzupełnij pole ‘Name’ imieniem ‘Jan’.                                      |
|               | 3. Uzupełnij pole ‘Surname’ nazwiskiem ‘Kowalski’.                            |
|               | 4. Uzupełnij pole ‘Email’ emailem ‘J.Kowalski@example.com’.                   |
|               | 5. Uzupełnij pole ‘Phone Number’ numerem ‘123123123’.                         |
|               | 6. Naciśnij przycisk Add Client.                                              |
| **Oczekiwany rezultat** | Użytkownik zostanie przeniesione do menu głównego oraz zostanie wyświetlony komunikat ‘Client added succefully’. |

---

| **ID**        | **TSZNIT002**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Dodanie nowego zgłoszenia do systemu                                           |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu. System posiada utworzonego klienta z adresem email ‘J.Kowalski@example.com’. |
| **Kroki testowe** | 1. Naciśnij przycisk Add New Report.                                         |
|               | 2. Wybierz email klienta ‘J.Kowalski@example.com’ z rozwijalnego menu.        |
|               | 3. Zaznacz Yes pod tekstem ‘Device Work’.                                     |
|               | 4. Zaznacz Yes pod tekstem ‘Device Complete’.                                 |
|               | 5. Zaznacz No pod tekstem ‘Visible Damage’.                                   |
|               | 6. Zaznacz No pod tekstem ‘Code Assigned’.                                    |
|               | 7. Wpisz ‘Test dodania urządzenia’ w pole tekstowe ‘Description of the problem’. |
|               | 8. Naciśnij przycisk Add Report.                                              |
| **Oczekiwany rezultat** | Wyświetlony zostanie komunikat z numerem urządzenia. Po zaakceptowaniu użytkownik zostanie przeniesiony do menu głównego. |

---

| **ID**        | **TSZNIT003**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Dodanie nowego zgłoszenia z widoczną wadą urządzenia do systemu                |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu. System posiada utworzonego klienta z adresem email ‘J.Kowalski@example.com’. |
| **Kroki testowe** | 1. Naciśnij przycisk Add New Report.                                         |
|               | 2. Wybierz email klienta ‘J.Kowalski@example.com’ z rozwijalnego menu.        |
|               | 3. Zaznacz Yes pod tekstem ‘Device Work’.                                     |
|               | 4. Zaznacz Yes pod tekstem ‘Device Complete’.                                 |
|               | 5. Zaznacz Yes pod tekstem ‘Visible Damage’.                                  |
|               | 6. Zaznacz No pod tekstem ‘Code Assigned’.                                    |
|               | 7. Wpisz ‘Test dodania urządzenia z widocznym problemem’ w pole tekstowe ‘Description of the problem’. |
|               | 8. Naciśnij przycisk Add Report.                                              |
| **Oczekiwany rezultat** | Wyświetlony zostanie komunikat z numerem urządzenia. Po zaakceptowaniu użytkownik zostanie przeniesiony do menu dodania nowego zdjęcia urządzenia. |

---

| **ID**        | **TSZNIT004**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Dodanie nowego zdjęcia urządzenia do zgłoszenia z widoczną wadą urządzenia.   |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu. System posiada utworzonego klienta z adresem email ‘J.Kowalski@example.com’. |
| **Kroki testowe** | 1. Naciśnij przycisk Add New Report.                                         |
|               | 2. Wybierz email klienta ‘J.Kowalski@example.com’ z rozwijalnego menu.        |
|               | 3. Zaznacz Yes pod tekstem ‘Device Work’.                                     |
|               | 4. Zaznacz Yes pod tekstem ‘Device Complete’.                                 |
|               | 5. Zaznacz Yes pod tekstem ‘Visible Damage’.                                  |
|               | 6. Zaznacz No pod tekstem ‘Code Assigned’.                                    |
|               | 7. Wpisz ‘Test dodania urządzenia z widocznym problemem’ w pole tekstowe ‘Description of the problem’. |
|               | 8. Naciśnij przycisk Add Report.                                              |
|               | 9. Naciśnij przycisk Add Photo.                                               |
|               | 10. Wybierz zdjęcie z urządzenia w formacie PNG.                              |
|               | 11. Naciśnij przycisk Upload Photo.                                           |
| **Oczekiwany rezultat** | Wyświetlony zostanie komunikat o pomyślnym dodaniu zdjęcia do systemu. |

---

| **ID**        | **TSZNIT005**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Wyszukanie przypisanych urządzeń klienta                                      |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu. System posiada utworzonego klienta z adresem email ‘J.Kowalski@example.com’ oraz przypisane do niego urządzenia o numerach ‘1’ i ‘2’. |
| **Kroki testowe** | 1. Naciśnij przycisk Work Progress.                                          |
|               | 2. Wprowadź email ‘J.Kowalski@example.com’ w pole ‘Enter Email to Search For ID’. |
|               | 3. Naciśnij przycisk Search codes by Email.                                  |
| **Oczekiwany rezultat** | Wyświetlony zostanie komunikat z numerami urządzeń ‘Search completed successfully! Code numbers: 1.2’ |

---

| **ID**        | **TSZNIT006**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Wyszukanie informacji o urządzeniu                                            |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu. System posiada zarejestrowane urządzenie z numerem ‘1’. |
| **Kroki testowe** | 1. Naciśnij przycisk Work Progress.                                          |
|               | 2. Wprowadź numer urządzenia ‘1’ w polu ‘Enter Code’.                         |
|               | 3. Naciśnij przycisk Search by Code.                                         |
| **Oczekiwany rezultat** | Przy wprowadzeniu poprawnego numeru urządzenia użytkownik zostanie przeniesiony do ekranu informacji o urządzeniu. Znajdują się tam dane właściciela urządzenia oraz informacje o urządzeniu podane przy tworzeniu zgłoszenia. |

---

| **ID**        | **TSZNIT007**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Wyszukanie detalów o urządzeniu                                               |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu. System posiada urządzenie z przypisanym numerem ‘1’. |
| **Kroki testowe** | 1. Naciśnij przycisk Work Progress.                                          |
|               | 2. Wprowadź numer urządzenia ‘1’ w polu ‘Enter Code’.                         |
|               | 3. Naciśnij przycisk Search by Code.                                         |
|               | 4. Naciśnij przycisk Details.                                                |
| **Oczekiwany rezultat** | Wyświetlony zostanie ekran z aktualnymi informacjami o naprawie urządzenia. Jeżeli urządzenie posiada wcześniej dodane aktualizacje tabela po prawej będzie zawierać dane o pracowniku, który dokonywał aktualizacji, dacie aktualizacji oraz samą informację o aktualizacji. W przypadku braku aktualizacji urządzenie tabela po prawej powinna zawierać tekst ‘Brak informacji’. |

---

| **ID**        | **TSZNIT008**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Dodanie aktualizacji naprawy urządzenia.                                      |
| **Warunki początkowe** | Użytkownik jest zalogowany. Wyświetlany jest ekran menu. System posiada urządzenie z przypisanym numerem ‘1’. |
| **Kroki testowe** | 1. Naciśnij przycisk Work Progress.                                          |
|               | 2. Wprowadź numer urządzenia ‘1’ w polu ‘Enter Code’.                         |
|               | 3. Naciśnij przycisk Search by Code.                                         |
|               | 4. Naciśnij przycisk Details.                                                |
|               | 5. Naciśnij przycisk Update.                                                 |
|               | 6. Wprowadź tekst ‘Aktualizacja’ w polu tekstowym ‘Enter new description’.     |
|               | 7. Naciśnij przycisk Submit.                                                 |
| **Oczekiwany rezultat** | Wyświetlony zostanie komunikat o udanym dodaniu aktualizacji. Po zaakceptowaniu komunikatu użytkownik zostanie przeniesiony do ekranu informacji o detalach urządzenia gdzie wyświetlone zostaną wszystkie informacje wraz z nowo wprowadzonymi aktualizacjami. |

---

| **ID**        | **TSZNIT009**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Dodanie nowego zadania do pracownika.                                         |
| **Warunki początkowe** | Użytkownik jest zalogowany w systemie. Użytkownik posiada status administratora w systemie. Wyświetlany jest ekran menu. System posiada zarejestrowanego pracownika ‘Mateusz Nowak’ ze specjalizacją ‘IT’. System posiada urządzenie z przypisanym numerem ‘1’. |
| **Kroki testowe** | 1. Naciśnij przycisk Managment.                                              |
|               | 2. Naciśnij przycisk Add New Task.                                           |
|               | 3. Wybierz pracownika ‘Mateusz Nowak – IT’ z listy rozwijalnej podpisanej ‘Choose an employee:’. |
|               | 4. Wybierz urządzenie ‘Device 1 - …’ z listy rozwijalnej podpisanej ‘Choose a device:’. |
|               | 5. Wprowadź tekst ‘Test’ w pole podpisane ‘Task Description:’.                |
|               | 6. Naciśnij przycisk Submit Task.                                            |
| **Oczekiwany rezultat** | Wyświetlony zostanie komunikat ‘Task set’. Po zaakceptowaniu komunikatu użytkownik zostaje przeniesiony do managment menu. |

---

| **ID**        | **TSZNIT010**                                                                 |
|---------------|-------------------------------------------------------------------------------|
| **Tytuł**     | Nadanie uprawnień administratora dla pracownika.                              |
| **Warunki początkowe** | Użytkownik jest zalogowany w systemie. Użytkownik posiada status administratora w systemie. Wyświetlany jest ekran menu. System posiada zarejestrowanego pracownika ‘Mateusz Nowak’ ze specjalizacją ‘IT’. |
| **Kroki testowe** | 1. Naciśnij przycisk Managment.                                              |
|               | 2. Naciśnij przycisk Employee Managment.                                     |
|               | 3. Naciśnij przycisk Edit w tabeli z użytkownikiem ‘Mateusz Nowak’.           |
|               | 4. Naciśnij przycisk Set as Admin.                                           |
| **Oczekiwany rezultat** | Przycisk Set as Admin zostanie zastąpiony przyciskiem Set as Not Admin. Użytkownik Mateusz Nowak posiadać będzie uprawnienia administatora. |


# Technologie użyte w projekcie

## FrontEnd:

- Angular
- TypeScript

## Backend:

- Spring Boot
- JSON Web Token
- Haszowanie SHA-256

## Baza danych:

- MongoDB

## Testy: 

### Testy Frontendowe

- Jasmine
- Karma
- Angular TestBed
- HttpClientTestingModule
- RxJS

### Testy Backendowe

- JUnit 5
- Spring Boot Test
- MockMvc
- Jackson ObjectMapper
- JsonPath
- Apache Commons Codec
