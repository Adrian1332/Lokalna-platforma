
# Lokalna Platforma Usług

Aplikacja webowa umożliwiająca dodawanie, edytowanie, usuwanie oraz przeglądanie lokalnych ofert usług. Oferty prezentowane są na mapie oraz w formie listy, z możliwością filtrowania i wyszukiwania.

---------------------------------------------------------------

## Technologie

- **React** – główny framework frontendowy
- **Vite** – szybki bundler do developmentu
- **React Router** – routing między stronami
- **React Leaflet** – integracja z mapą OpenStreetMap
- **SCSS (Sass)** – stylowanie komponentów
- **OpenStreetMap + Leaflet** – renderowanie mapy i znaczników
- **Geocoding API** – automatyczne ustalanie pozycji na podstawie adresu

---------------------------------------------------------------
## Funkcjonalności

- Wyświetlanie ofert na mapie
- Dodawanie nowych ofert (z automatycznym geolokalizowaniem)
- Edycja istniejących ofert
- Usuwanie z potwierdzeniem
- Wyszukiwanie po tytule i opisie
- Filtrowanie po kategorii
- Filtrowanie ofert w promieniu (np. 5 km od adresu)

---------------------------------------------------------------
## Jak uruchomić?

### 1. Wymagania

- Node.js (wersja LTS, np. 18+)
- npm (dołączony z Node)

### 2. Instalacja

```bash
npm install
```

### 3. Uruchomienie w trybie deweloperskim

```bash
npm run dev
```
Po chwili aplikacja będzie dostępna pod adresem:
http://localhost:5173

---------------------------------------------------------------

## Struktura projektu

```
lokalna-platforma/
│
├── public/               # Publiczne pliki statyczne
├── src/
│   ├── components/       # Komponenty jak Navbar, OfferList
│   ├── pages/            # Strony (MapPage, AddEditOffer)
│   ├── styles/           # SCSS dla każdego komponentu
│   ├── data/             # Kategorie i dane startowe
│   ├── App.jsx           # Główna logika aplikacji
│   ├── main.jsx          # Punkt wejścia React
│
├── package.json
├── vite.config.js
└── README.md             # Ten plik
```

---------------------------------------------------------------

## Autor
Adrian Misztal

Projekt przygotowany jako część pracy inżynierskiej 
