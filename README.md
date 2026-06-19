# Pertu MI Ai

![Pertu MI Ai Logo](./src/app/logo.png)

A **Pertu MI Ai** egy helyi hálózaton (offline is) működő, böngészőalapú, többképernyős súgógép- és kijelzőrendszer, amelyet kifejezetten élő podcast adások készítőinek fejlesztettek ki. A rendszer segítségével az operátori vezérlőpult (`/control`) és a műsorvezetői vetítővászon (`/projector`) között rendkívül alacsony (< 5ms) késleltetésű, dinamikus szöveg- és válaszszinkronizáció valósul meg a natív HTML5 `BroadcastChannel` API-n keresztül, teljesen kliensoldalon, szerverháttér nélkül.

---

## 🚀 Telepítési és Indítási Útmutató / Installation Guide

Válassza ki a technikai felkészültségének megfelelő szintet az alábbiak közül, hogy közvetlenül a vonatkozó útmutatóhoz ugorhasson:

* [**Haladó programozóknak (Developer Guide)**](#-halado-programozoknak) — Ha ismeri a Git-et, a Node.js-t és a parancssor használatát.
* [**Kezdőknek és technikai tapasztalattal nem rendelkezőknek (Beginner Guide)**](#-kezdoknek-es-technikai-tapasztalattal-nem-rendelkezoknek) — Részletes, lépésről lépésre követhető útmutató a szükséges szoftverek telepítésével és parancsok magyarázatával.

---

## 💻 Haladó programozóknak

### Előfeltételek
- Node.js (v18 vagy újabb ajánlott)
- npm, yarn vagy pnpm

### Telepítés és Futtatás

1. **Klónozza a repository-t vagy töltse le a fájlokat:**
   ```bash
   git clone <repository-url>
   cd pertu-mi
   ```

2. **Telepítse a függőségeket:**
   ```bash
   npm install
   ```

3. **Indítsa el a fejlesztői szervert:**
   ```bash
   npm run dev
   ```

4. **Nyissa meg a böngészőjében:**
   - **Operátori vezérlőpult (Dashboard):** [http://localhost:3000/control](http://localhost:3000/control)
   - **Műsorvezetői vetítővászon (Projector Screen):** [http://localhost:3000/projector](http://localhost:3000/projector)

### Építés (Production Build)
A statikus Next.js produkciós build elkészítése és futtatása:
```bash
npm run build
npm run start
```

### Kódminőségi ellenőrzések
- Lint vizsgálat: `npm run lint`
- TypeScript típusellenőrzés: `npx tsc --noEmit`

---

## 🟢 Kezdőknek és technikai tapasztalattal nem rendelkezőknek

Ez a részletes útmutató végigvezeti Önt a rendszer futtatásához szükséges lépéseken, még akkor is, ha soha nem használt parancssort vagy programozói eszközöket.

### 1. Lépés: A kód letöltése
1. Ezen az oldalon (ahol a kódot nézi, pl. GitHub) kattintson a zöld **Code** gombra.
2. Válassza a **Download ZIP** lehetőséget a kód letöltéséhez.
3. Keresse meg a letöltött `.zip` fájlt a számítógépén, és csomagolja ki egy mappába (például a Dokumentumok vagy Asztal mappába).

### 2. Lépés: A Node.js telepítése
A program futtatásához szükség van egy ingyenes háttérkörnyezetre, amelyet **Node.js**-nek hívnak.
1. Látogasson el a [nodejs.org](https://nodejs.org) weboldalra.
2. Töltse le és telepítse a **LTS** (hosszú távon támogatott) verziót a számítógépére (ajánlott Windowsra vagy Macre).
3. A telepítés során hagyjon minden beállítást az alapértelmezett értéken, és kattintson a Tovább (Next / Install) gombokra.

### 3. Lépés: A terminál (parancssor) megnyitása
1. **Mac gép használata esetén:** Nyissa meg a Spotlight keresőt (Command + Space billentyűk), gépelje be, hogy `Terminal` (Terminál), majd nyomja le az Entert.
2. **Windows gép használata esetén:** Nyissa meg a Start menüt, gépelje be, hogy `cmd` vagy `Command Prompt` (Parancssor), majd nyomja le az Entert.

### 4. Lépés: Navigálás a kicsomagolt projekt mappájába
A terminálban be kell lépnünk a kicsomagolt mappába a `cd` (change directory) paranccsal.
1. Írja be a terminálba, hogy `cd ` (ügyeljen a szóközre a cd után!).
2. Húzza át az egérrel a kicsomagolt `pertu-mi` mappát közvetlenül a terminál ablakába (ez automatikusan beilleszti a mappa teljes elérési útját).
3. Nyomja meg az **Enter** billentyűt.

### 5. Lépés: A szükséges csomagok telepítése
Most megkérjük a rendszert, hogy töltse le a program futtatásához szükséges külső elemeket (függőségeket).
1. Írja be az alábbi parancsot a terminálba:
   ```bash
   npm install
   ```
2. Nyomja meg az **Enter** billentyűt.
3. Várjon, amíg a folyamat befejeződik (ez eltarthat 1-2 percig. Amikor kész, a terminál újra várja a következő parancsot).

### 6. Lépés: A rendszer elindítása
A telepítés után készen állunk az elindításra!
1. Írja be az alábbi parancsot a terminálba:
   ```bash
   npm run dev
   ```
2. Nyomja meg az **Enter** billentyűt.
3. Ekkor a terminálban megjelenik egy üzenet, hogy a szerver elindult a `http://localhost:3000` címen. (Ne zárja be ezt a terminál ablakot, különben a program leáll!).

### 7. Lépés: A felületek megnyitása és használata
Mivel a rendszer offline szinkronizációt használ, nincs szükség internetre. Nyissa meg a kedvenc webböngészőjét (például Chrome, Safari vagy Edge), és tegye a következőt:
1. **Operátori ablak megnyitása (itt tudja beírni a szövegeket):**
   Írja be a böngésző címsorába: `http://localhost:3000/control`
2. **Műsorvezetői/Vetítési ablak megnyitása (ezt vetíti ki a műsorvezetőnek):**
   Nyisson egy új lapot vagy vigye át a képernyőt egy másik monitorra/projektorra, és írja be: `http://localhost:3000/projector`
3. Próbálja ki! Írjon be egy szöveget a `/control` oldalon a Prompt vagy Válasz mezőbe, és látni fogja, hogy a `/projector` oldalon azonnal megnyílik a tartalom, és elindul az írásanimáció.

---

## ⚙️ Architektúra és működési részletek

A rendszer hátteréről és a részletes technikai részletekről a [handoff.md](handoff.md) fájlban tájékozódhat.
