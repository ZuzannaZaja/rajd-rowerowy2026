# Współpraca — Quiz SEP G1 / F-Gazy

## Cel projektu
Strona z quizem ABCD i fiszkami (Fiszki) do nauki pytań z egzaminu SEP G1 i F-Gazy.
Hostowana na **GitHub Pages** jako strona statyczna.

## Przebieg współpracy

### 1. Przygotowanie danych
- Źródło: pliki `.md` z pytaniami i odpowiedziami
- Konwersja do JSON: skrypty Node.js (`convert-sep2.js`, `convert-fgazy.js`)
- Liczba pytań: **SEP G1 = 276**, **F-Gazy = 204**
- Usunięto duplikaty w F-Gazy (199 → 204, konwerter pomijał duplikaty tekstu)
- Zachowano duplikaty w SEP (8 pytań ma identyczny tekst ale różne odpowiedzi)

### 2. Struktura aplikacji
- Czysty HTML/CSS/JS — brak frameworków, bibliotek, zależności
- Jeden plik `app.js` zawiera całą logikę
- `style.css` — wszystkie style
- `index.html` — szkielet strony
- `questions-sep.js` / `questions-fgazy.js` — dane

### 3. Funkcjonalności (w kolejności implementacji)

| Krok | Co zrobiono |
|------|-------------|
| 1 | Podstawowy quiz ABCD — losowanie pytań, 4 opcje, podsumowanie |
| 2 | Menu: wybór zestawu → trybu → rozmiaru (10, 20, Wszystkie, Zakres) |
| 3 | Quiz zakresowy: Od–Do + przyciski sekcji (1-30, 31-60, ...) |
| 4 | Fiszki: karta z odpowiedzią, nawigacja, skok do pytania, Pokaż wszystkie |
| 5 | Trudniejsze dystraktory — z grupy 20, scoring po nakładaniu słów |
| 6 | "Umiem" — przycisk, localStorage, synchronizacja między widokami |
| 7 | Testy: jednostkowe + przepływowe (Node.js), DOM (przeglądarkowe) |

### 4. Konwencje
- Język UI: **polski**
- Język kodu: **angielski** (nazwy zmiennych, funkcji)
- Brak komentarzy w kodzie
- `classList` do pokazywania/ukrywania elementów (nie `style.display = 'none'`)
- `localStorage` do trwałego stanu (klucz `quizKnown`)
- Klucz "Umiem": `"{nazwa_zestawu}::{indeks}"` (indeks, nie tekst — odporny na duplikaty)

### 5. Testowanie
- `tests.js` — testy jednostkowe (Node.js, `eval` danych)
- `tests2.js` — testy przepływów quizów i fiszek (Node.js)
- `test.html` — testy DOM w przeglądarce (do odpalenia na żywo)
- Uruchomienie: `node tests.js`, `node tests2.js`

### 6. Wdrożenie
- Pliki przesyłane ręcznie przez web UI GitHub
- GitHub Pages automatycznie buduje i publikuje
- URL: `https://zuzannazaja.github.io/quiz-app/`
- Cache: po aktualizacji trzeba odświeżyć z pominięciem cache (Ctrl+F5)

### 7. Ustalenia z użytkownikiem
- Stan "Umiem" per-urządzenie (localStorage) — wystarcza dla grupy docelowej (mobilni)
- Bez logowania, bez Firebase
- Dystraktory mają być trudne — podobne tekstowo do poprawnej odpowiedzi
- Duplikaty pytań w SEP są OK — to różne pytania które brzmią tak samo
