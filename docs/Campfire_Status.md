# Magic Library — status projektu (community feed)

> Plik: `docs/Campfire_Status.md` (nazwa historyczna — funkcja została
> przemianowana z „The Campfire" na **Magic Library**).

Ostatnia aktualizacja: **2026-06-08**
Repozytorium: `C:\Projekty\magic-stories` · Stack: Next.js 16 + React 19 + Tailwind v4 (App Router)

> **Rename (2026-06-08):** „The Campfire" (`/campfire`) → **Magic Library /
> Magiczna Biblioteka** (`/library`). W nawigacji „Magic Library". Wewnętrzny
> folder komponentów został `src/components/campfire/` (niewidoczny dla
> użytkownika), kanał realtime to `library-feed`.

---

## 1. Czym jest Magic Library

Feed społecznościowy dla strony Magic Stories Records, wzorowany na
fcbarca.com/la-rambla. Wpisy z linkami (YouTube / SoundCloud / X) i ich
osadzaniem, lajki i odpowiedzi, logowanie przez Google, proste profile,
artyści oznaczeni inaczej i podpięci do kart w `/authors`. Skala startowa:
~20–50 osób.

Trasa: **`/library`** · nazwa „Magic Library" (nagłówek „Magiczna Biblioteka").
W nawigacji (desktop + mobile). Stara trasa `/campfire` już nie istnieje (404).

---

## 2. Decyzje techniczne

- **Backend: Supabase** (Postgres + Auth Google + Storage + Realtime + RLS).
- Logowanie **Google OAuth** przez Supabase (PKCE, `@supabase/ssr`).
- **Row Level Security** na wszystkich tabelach; klient w przeglądarce używa
  tylko klucza publishable.
- Realtime: lajki, odpowiedzi i nowe/edytowane/usunięte wpisy aktualizują się
  na żywo (publikacja `supabase_realtime`, kanał `library-feed`).

---

## 3. Adresy, identyfikatory, klucze

| Co | Wartość |
|---|---|
| Supabase Project URL | `https://vvikwcgpotxukitlkswi.supabase.co` |
| Supabase project ref | `vvikwcgpotxukitlkswi` |
| Region bazy | Central EU (Frankfurt) · eu-central-1 |
| Publishable (anon) key | `sb_publishable_HBFNZg2RPJ45ESzrr5WThQ_TgXSA-aD` (publiczny, w `.env.local`) |
| Google OAuth Client ID | `366247334798-jsv8h98r441qckifh8sp07edsruhu84o.apps.googleusercontent.com` |
| Supabase Auth redirect (Google) | `https://vvikwcgpotxukitlkswi.supabase.co/auth/v1/callback` |
| Produkcja (Vercel) | `https://magic-stories-three.vercel.app` |
| Dev lokalny | `http://localhost:3000` · feed: `/library` · profil: `/account` |

**Poza repo (NIE w dokumentach):** Supabase `service_role` key, hasło do bazy
Postgres, Google **Client Secret**.

Zmienne środowiskowe (`.env.local`, gitignored):
```
NEXT_PUBLIC_SUPABASE_URL=https://vvikwcgpotxukitlkswi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HBFNZg2RPJ45ESzrr5WThQ_TgXSA-aD
```

---

## 4. Co zrobione

### FAZA 1 — logowanie + profile ✅
- Logowanie Google, sesja w cookies (middleware odświeża), strona `/account`.
- Edycja nazwy użytkownika, nazwy wyświetlanej i avatara (upload do Storage).
- Wskaźnik konta w nawigacji (avatar/nazwa, live-update bez przeładowania).

### FAZA 2 — feed Magic Library ✅
- Trasa `/library` (night-sky), „Magic Library" w nawigacji.
- Composer wpisów (treść + opcjonalny link), lista najnowsze u góry.
- Osadzanie linków: YouTube i SoundCloud (iframe), X/Twitter (widget),
  pozostałe jako estetyczna karta linku.

### FAZA 3 — lajki + odpowiedzi (realtime) ✅
- Lajki: serce + licznik, klik = polub/cofnij (optymistycznie), tylko zalogowani.
- Odpowiedzi: rozwijany wątek pod wpisem (lista + pole odpowiedzi).
- Realtime: cudze lajki, odpowiedzi i nowe wpisy pojawiają się na żywo.

### Dopieszczenie UI + edycja/usuwanie wpisów ✅
- Przeprojektowane akcje: serce (różowe, animacja „pop") i dymek komentarza,
  hover-pille, separator nad rzędem akcji.
- Edycja własnego wpisu (ołówek) i usuwanie (kosz, z potwierdzeniem).
- Ikony zarządzania tylko dla właściciela (pilnuje też RLS); realtime obejmuje
  edycje i usunięcia.

### Rename + porządki nawigacji ✅ (2026-06-08)
- „The Campfire" → „Magic Library", trasa `/campfire` → `/library`.
- Przycisk CTA w pasku „Open the Library" → **„Browse Releases"** (dalej → `/stories`),
  żeby nie mylił się z pozycją „Magic Library".

### Poza feedem (inny task, dla kontekstu)
- Strona `/authors` ma teraz prawdziwe linki platform dla każdego artysty
  (Facebook / Instagram / Spotify / SoundCloud / Beatport), `PlatformIcons`
  dostał `FacebookIcon`. Etykieta w nawigacji to teraz „Artists" (trasa wciąż `/authors`).

Weryfikacja: `npx tsc --noEmit` (źródła) i `npx eslint src` — czyste.

---

## 5. Baza danych (SQL w `supabase/`)

Uruchamiane kolejno w Supabase → SQL Editor (wszystkie już wykonane):
- `schema_phase1.sql` — `profiles` (+ trigger tworzenia profilu, ochrona
  `role`/`author_slug`, RLS) + bucket `avatars` z politykami.
- `schema_phase2.sql` — `posts` (RLS: odczyt wszyscy, insert/update/delete
  własne) + realtime.
- `schema_phase3.sql` — `likes` (PK `post_id,user_id`) + `replies` + RLS +
  realtime.

---

## 6. Najważniejsze pliki

```
src/lib/supabase/{client,server,middleware}.ts   klienci Supabase
src/middleware.ts                                 odświeżanie sesji
src/lib/links.ts                                  wykrywanie i normalizacja linków
src/lib/time.ts                                   względny czas (PL)
src/app/account/page.tsx                          profil
src/app/auth/callback/route.ts                    OAuth callback
src/app/library/page.tsx                          feed (server fetch + liczniki)
src/components/auth/{SignInButton,SignOutButton,AuthNav}.tsx
src/components/account/ProfileEditor.tsx
src/components/campfire/                           (folder wewnętrzny, nazwa historyczna)
  types.ts            FeedPost / FeedAuthor / Reply
  Feed.tsx            stan listy + handlery + realtime (kanał library-feed)
  Composer.tsx        dodawanie wpisu
  PostCard.tsx        karta wpisu: akcje, edycja, usuwanie
  LikeButton.tsx      serce + animacja
  ReplyThread.tsx     wątek odpowiedzi (fetch + realtime)
  LinkEmbed.tsx       embed YT/SC/X/link
  TimeAgo.tsx         znacznik czasu
src/components/Nav.tsx                             nawigacja (Magic Library, Browse Releases, AuthNav)
supabase/schema_phase{1,2,3}.sql                  schematy
docs/Campfire_Setup_Supabase.md                   instrukcja konfiguracji Supabase
```

Zależności: `@supabase/ssr ^0.10.3`, `@supabase/supabase-js ^2.107.0`.

---

## 7. Wnioski / pułapki (ważne na przyszłość)

- **Deadlock supabase-js (Web Locks):** nigdy nie wołaj metod Supabase
  synchronicznie w callbacku `onAuthStateChange` — zawiesza wszystkie
  zapytania. Odraczać `setTimeout(0)`, używać `session` z argumentu.
- **PGRST201 — niejednoznaczna relacja:** gdy z `posts` prowadzi więcej niż
  jedna droga do `profiles` (bo `likes`/`replies` też wskazują na `profiles`),
  embed `author:profiles(...)` się wywala. Wskazać klucz obcy wprost:
  `author:profiles!posts_author_id_fkey(...)`. Symptom: feed nagle pusty.
- **Środowisko ucina duże zapisy plików** (Edit/Write potrafi obciąć plik
  ~5–7 KB) i potrafi zablokować `rm`/rename plików (lock z Windows). Większe
  pliki zapisywać przez shell `cat > plik <<'EOF'`, weryfikować `wc -l` + `tsc`.
- Walidacja `tsc`: błędy w `.next/dev/types/*` to artefakty serwera dev — liczy
  się czysty wynik dla `src/` (`npx tsc --noEmit | grep -v '^\.next/'`).

---

## 8. Do zrobienia zanim wejdzie na produkcję

1. ~~Vercel → Environment Variables~~ **ZROBIONE (2026-06-08):** w Vercelu
   (projekt `magic-stories`, Production + Preview, bez „Sensitive") dodane
   `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Wejdą przy
   najbliższym deployu (po `git push`).
2. **Google OAuth — tryb testowy.** Aplikacja w „testing"; logują się tylko
   dodani test users. Dla znajomych: dodać ich jako test users albo
   opublikować aplikację („Publish app").
3. Po pushu sprawdzić `/library` na produkcji (logowanie, dodanie wpisu, lajk).

---

## 9. Plan dalej

### FAZA 4 — badge artystów + powiązanie profili (następna)
- Ustawić `role='artist'` + `author_slug` dla artystów (Mazze, label) — przez
  SQL Editor, np.:
  `update public.profiles set role='artist', author_slug='mazze' where username='mazzeofficial';`
- Badge „Artysta" już renderuje się w feedzie i wątkach, gdy `role='artist'`.
  Teraz, gdy `/authors` ma realne karty/slugs, badge można linkować wprost do
  konkretnego artysty (np. `/authors#<slug>` — wymaga kotwic po slug w `/authors`).
- Podstawowa moderacja (np. founder może usuwać cudze wpisy).

### Pomysły na później
- Edycja/usuwanie odpowiedzi (RLS już gotowe), paginacja feedu (>50 wpisów),
  powiadomienia, podgląd kto polubił, licznik znaków w edycji.

---

## 10. Jak wrócić do pracy (skrót)
1. Folder `C:\Projekty\magic-stories`. Dev: `npm run dev` → `http://localhost:3000/library`.
2. Fazy 1–3 + dopieszczenie/edycja/usuwanie + rename działają. Następny krok: Faza 4 (artyści).
3. Schematy: `supabase/schema_phase{1,2,3}.sql`. Instrukcja: `docs/Campfire_Setup_Supabase.md`.
4. Walidacja zmian: `npx tsc --noEmit | grep -v '^\.next/'` oraz `npx eslint src` (czyste).
