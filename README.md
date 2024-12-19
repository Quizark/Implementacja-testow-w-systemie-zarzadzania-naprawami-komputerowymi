# Testowanie i Jakość Oprogramowania

# Stanisław Mendel 35684

# Implementacja testów w systemie zarządzania naprawami komputerowymi

# Opis projektu

//TODO


# Uruchamianie projektu

Aby poprawnie uruchomić aplikację, należy wykonać następujące kroki:

1. **Uruchomienie serwera API**  
   Otwórz projekt backendowy w IDE, np. IntelliJ IDEA. Upewnij się, że środowisko jest poprawnie skonfigurowane (np. bazy danych, porty itp.), a następnie uruchom serwer API.  

2. **Uruchomienie serwisu Angular**  
   Przejdź do katalogu projektu frontendowego w terminalu, używając odpowiedniej ścieżki. Następnie uruchom serwis Angular za pomocą polecenia:  
   ```bash
   ng serve

3. **Uruchomienie wszystkich testów**  
   Przejdź do katalogu głównego projektu, następnie uruchom `Run_All_Tests.bat`. Plik ten automatycznie uruchomi testy dla springboot oraz dla angulara.

4. **Uruchomienie testów Angular** 
   Przejdź do katalogu głównego projektu, następnie uruchom `test_angular.bat`.

5. **Uruchomienie testów SpringBoot** 
   Przejdź do katalogu głównego projektu, następnie uruchom `test_springboot.bat`

6. **Testy manualne**
   Testy manualne znajdują się w pliku `Testy manualne - Implementacja-testow-w-systemie-zarzadzania-naprawami-komputerowymi.docx`.

# Testy

//TODO

# Dokementacja API

//TODO

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

//TODO