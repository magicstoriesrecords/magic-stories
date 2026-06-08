# The Campfire — instrukcja konfiguracji Supabase + Google

Ten dokument prowadzi Cię krok po kroku przez założenie backendu dla feedu **The Campfire**.
Łączny czas: ~15–20 minut. Wszystko na darmowych planach. Na końcu jest sekcja
**„Co przysłać"** — tylko te dwie wartości są mi potrzebne, żeby ruszyć z kodem.

> Słowniczek: *anon key* = publiczny klucz, bezpieczny w przeglądarce. *service_role key* =
> tajny klucz admina — **nigdy go nie wysyłaj ani nie wklejaj do kodu frontu**.

---

## Część 1 — Projekt Supabase (~5 min)

1. Wejdź na **https://supabase.com** → **Start your project** → zaloguj się (najprościej przez GitHub).
2. **New project**:
   - **Name**: `magic-stories`
   - **Database Password**: kliknij *Generate*, **zapisz to hasło** w menedżerze haseł (przyda się, choć ja go nie potrzebuję).
   - **Region**: `Central EU (Frankfurt)` — najbliżej Polski, najniższe opóźnienia.
   - **Plan**: Free.
3. Kliknij **Create new project** i poczekaj ~2 min, aż się postawi.

### Skąd wziąć klucze (potrzebne na koniec)
4. W projekcie: lewy panel → ikona koła zębatego **Project Settings** → **API**.
5. Zanotuj dwie rzeczy:
   - **Project URL** — wygląda jak `https://abcdefgh.supabase.co`
   - **anon public** key — długi ciąg zaczynający się od `eyJ...`

   (Klucz **service_role** z tej samej strony **zignoruj** — jest tajny.)

---

## Część 2 — Klient OAuth w Google Cloud (~8 min)

To pozwala logować się kontem Google. Najbardziej „klikana" część — rób spokojnie po kolei.

1. Wejdź na **https://console.cloud.google.com** (zaloguj się kontem Google).
2. U góry, obok logo, kliknij selektor projektu → **New Project** → nazwa `magic-stories` → **Create**.
   Po utworzeniu upewnij się, że ten projekt jest wybrany w selektorze.
3. W wyszukiwarce u góry wpisz **„OAuth consent screen"** i wejdź tam.
   - **User Type**: `External` → **Create**.
   - **App name**: `Magic Stories Records`
   - **User support email**: Twój e-mail.
   - **Developer contact email**: Twój e-mail.
   - Resztę pól pomiń → **Save and Continue** przez kolejne ekrany (Scopes, Test users) aż do końca.
   - Na ekranie **Test users** dodaj swój e-mail (i ewentualnie kilka osób do testów), żeby
     móc się logować zanim aplikacja przejdzie weryfikację. Przy 20–50 znajomych osobach
     można działać w trybie testowym/„In production" bez pełnej weryfikacji Google.
4. W wyszukiwarce wpisz **„Credentials"** → wejdź → **+ Create Credentials** → **OAuth client ID**.
   - **Application type**: `Web application`
   - **Name**: `magic-stories-web`
   - **Authorized JavaScript origins** — dodaj (przycisk *Add URI*):
     - `http://localhost:3000`
     - `https://magic-stories-three.vercel.app`
   - **Authorized redirect URIs** — dodaj **dokładnie** ten adres, podmieniając `TWOJ-REF`
     na początek Twojego Project URL z Części 1 (czyli `abcdefgh` z `https://abcdefgh.supabase.co`):
     - `https://TWOJ-REF.supabase.co/auth/v1/callback`
   - **Create**.
5. Pojawi się okienko z **Client ID** i **Client Secret** — zostaw je otwarte / skopiuj oba,
   przydadzą się w następnej części.

---

## Część 3 — Połącz Google z Supabase (~2 min)

1. Wróć do Supabase → lewy panel → **Authentication** → **Sign In / Providers** (lub **Providers**).
2. Z listy wybierz **Google** → przełącz **Enable**.
3. Wklej:
   - **Client IDs** ← *Client ID* z Google.
   - **Client Secret** ← *Client Secret* z Google.
4. **Save**.

---

## Część 4 — Adresy przekierowań w Supabase (~2 min)

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL**: `https://magic-stories-three.vercel.app`
3. **Redirect URLs** — dodaj oba (przycisk *Add URL*):
   - `http://localhost:3000/**`
   - `https://magic-stories-three.vercel.app/**`
4. **Save**.

---

## Co przysłać mi 📩

Wystarczą **dwie** wartości z Części 1:

```
Project URL:  https://TWOJ-REF.supabase.co
anon key:     eyJ...
```

Te dwie wartości są publiczne (i tak trafiają do przeglądarki), więc można je bezpiecznie podać.

**Nie wysyłaj:** hasła do bazy, klucza `service_role`, ani Client Secret z Google — te zostają u Ciebie.

Gdy je dostanę:
1. Wpinam klienta Supabase do Next.js i ekran logowania Google.
2. Stawiam tabele (`profiles`, `posts`, `likes`, `replies`) skryptem SQL, który Ci wcześniej pokażę.
3. Budujemy feed The Campfire fazami, zaczynając od logowania i profili.

> Klucze dorzucimy też do Vercela (Settings → Environment Variables) jako
> `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_ANON_KEY` — przeprowadzę Cię przez to,
> gdy będziemy wdrażać.
