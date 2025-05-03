# Oppimispäiväkirja - Mobiiliohjelmointikurssin lopputyö: react native sovellus

## Päiväkirjasovellus

### Alustavat speksit:

Seuraava kuvaus otettu suoraan tehtävästä lopputyön aihevalinta:

Jaoettelen suunnitellut ominaisuudet eri kategorioihin tärkeyden mukaan, joista lähtökohtaisesti oletan toteuttavani kategoriat 1-3, ja joista loput ovat lisäominaisuuksia, joita toteutan käytettävän ajan mukaan.

1. Ydin: Päiväkirjatyyppinen sovellus, johon tallennetaan tarinoita, jotka koostuvat vähintään otsikosta ja sisältävät kuva -ja tekstikentät, joiden täyttäminen on vapaaehtoista. Tarinat tallennetaan lokaaliin tietokantaan ja ne näytetään oletusarvoisesti listana ajan mukaan järjestettynä.

2. Ydin: Uusien käyttäjien luonti ja mahdollisuus jakaa tarina näkymään muille käyttäjille.

3. Ydin: Omien tarinoiden varmennus pilvitietokantaan ja synkkausmahdollisuus eri laitteiden välillä, sekä tarinoiden jakaminen muille käyttäjille pilvitietokannan kautta.

4. Lisäominaisuudet 1: Reaktiot ja kommentointi omiin tai toisten jaettuihin tarinoihin.

5. Lisäominaisuudet 2: Laajennettu filteröinti tarinalistalle, joka sisältää eri tagejä tarinoiden kategorisointiin ja kalenterinäkymän.

6. Lisäominaisuudet 3: Vapaa ajankohdan määritys tarinalle ja mahdollisuus lisätä tarinaan muita tarinoita kommentteina. Esimerkiksi alunperin tulevaisuuteen merkattu festaripäivä, johon päivän aikana lisätään kuvia esiintyjistä kommentteina.

7. Lisäominaisuudet 4: Karttanäkymä tarinoille ja haku osoitteen tai paikan nimen perusteella.

## Oppimispäiväkirjan rakenne

Käytän lähtökohtana projektin commit viestejä ja lisään omilla kommenteille kontekstia jos siihen on tarvetta.
Numerointi on selkeyden vuoksi hieman eri, kuin projektissa, koska tähän listaan vain merkittävät commitit.
Täysi commit historia löytyy projektin repositioriosta.

### 08.04.2025

Olin jo aiemmin pyöritellyt eri moduuleja testiprojektissa varmistaakseni niiden yhteensopivuuden, mutta tässä kohtaan aloitin varsinaisen lopputyöprojektin

Tein projektin käyttäen expon blank typescript templatea ```npx create-expo-app diary -- template blank-typescript```.

**Commit 1:** Added files for styles and types and first 2 screens

**Commit 2:** Implemented basic navigation between screens with React Stack Navigator

**Commit 3:** Added react-native-paper and fixed module resolution for typescript

- TypeScriptillä oli ongelmia tunnistaa react-navigation moduuli päivityksen jälkeen. Korjasin määrittelemällä *tsconfigissa* ```"moduleResolution": "Bundler"```

**Commit 4:** Added SQLiteDatabase and some functions for testing it

- Eri sivut ovat *SQLiteProviderin* providerin sisällä ja tietokannan käsittelyyn käytetään *useSQLiteContext* hookkia.

**Commit 5:** added learning diary

- Päivitän oppimispäiväkirjaa projektin edetessä markdown tiedostoon

Tähän asti tulleet toiminnallisuudet olin kokeillut jo testiprojektissa, joten ongelmia ei juuri tullut vastaan.

Projetkin rakenne (App.tsx return kohta):

```
<PaperProvider>
	<SQLiteProvider databaseName="stories.db" onInit={initializeDatabase}>
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="NewStory" component={NewStory} />
			</Stack.Navigator>
		</NavigationContainer>
	</SQLiteProvider>
</PaperProvider>
```

- Itse komponenttien sisältö on vielä täysin testivaiheessa

### 17.04.2025

**Commit 6:** Added added timestamp and ID generation logic for stories and a view page for them selectable from the rendered flatlist

- Klikattava FlatList toteutettu TouchableOpacity wrapperillä
- Aikaan käytetään day.js:ää ja se tallennataan stringinä formatoituna ISO muotoon
- ID koostuu aika + header stringeistä

### 20.04.2025

**Commit 7:** Added camera screen for taking pictures.

- TODO: Lisättävä pysyvä tallennus kuville

Tässä kohdassa tuli ensimmäinen huomattava ongelma vastaan; kuvan tallennus SQLite tietokantaan base64 muodosa kaataa appin.
En ole vielä päättänyt pyrinkö saamaan suoran tallennuksen SQLiteen onnistumaan, tallennanko jotenkin muuten paikallisesti ja lisään vain viittauksen SQLite tietokantaan, vai siirränkö koko tietokannan verkkoon ja tallennan sinne.
Muuten logiikka tietokannan lisäysten suhteen on kunnossa, joten muiden toiminnallisuuksien kehitys onnistuu, vaikka tämän ratkaisu jätettäisiin myöhemmälle.

### 27.04.2025

**Commit 8:** Removed camera screen and added its functionality directly to newStory screen via a toggleable <Modal> element

- Tällä tavoin ei tarvitse miettiä kuvien siirtelyä screenien väliä ennen niiden tallentamista.

### 28.04.2025

**Commit 9:** Added file system storage support via expo-file-system module for permanently storing photos with URI stored in the SQLite db for fetching them.

- Kuvat renderöityvät ehdollisesti HomeScreen FlatListiin ja ViewStory screeniin.

Tämä oli ratkaisuni *Commit 7* kohdassa tulleseen ongelmaan kuvien tallennukseen.

### 01.05.2025

**Commit 10:** Added users table to database, custom context and hook for tracking active user, and rudementary sign up and sign in pages.

- Contextiin ja hookkin käytetty lähteenä Net Ninjan Youtube tutoriaaleja [Complete React Native Tutorial #14 - Making an Auth Context](https://www.youtube.com/watch?v=Ky43ve3b9Ss) ja [Complete React Native Tutorial #15 - Logging Users In](https://www.youtube.com/watch?v=RcrWlOgL1hM)

**Commit 11:** Added logic for login validation and a table for tracking an active user.

- Salasanat tallennetaan selkokielisinä, eli nykyinen toteutus on tietoturvallisuudeltaan hyvin puutteellinen.


### 02.05.2025

**Commit 12:** Added private: boolean to Story type and updated fetch logic for stories table to only include public stories or private stories from active user


**Tilannepäivitys speksien suhteen:**

Alkuperäisistä ydinominaisuukista on nyt teknisesti toteutettu 1 ja 2.
Ominaisuus 3, eli tarinoiden tallennus pilveen, olisi suhteellisen helposti toteutettavissa yksinkertaisessa muodossa, mutta mielekäs toteutus vaatisi myös tietoturvallisemman tavan hoitaa salasanojen tallennus.
Lisäksi jo yksinkertaisella toteutuksella olisi potentiaalia aiheuttaa useita aikaa vieviä ongelmakohtia, koska jo tämä tarkoittaisi kahden eri tilassa olevan tietokannan välistä ylläpitoa, joten jätän tämän tavoitteen pienemmälle prioriteetille.

Uudistetut prioriteetit:
1. Käyttöliittymä
2. Tarinoiden paikannus Maa + Paikkakunta tägeillä
3. Tarinoiden filteröinti
4. Tarinoiden kommentointi
5. Pilvitoiminnallisuus (ja ennakkovaatimuksena tietoturvallisempi login toiminnallisuus)

Tällä hetkellä uskon toteuttavani näistä 1 varmuudella, 2 todennäköisesti, 3 mahdollisesti ja 4+ epätodennäköisesti, koska oletan siinä kohdassa katsovani aikani olevan paremmin käytetty esimerkiksi käyttöliittymän ulkoasun parannuksiin.

**Expo tilanne**

Expo 53 olisi saatavilla, mutta päädyin tällä hetkellä pitämään projektini expo 52:ssa. Tämä saattaa vielä muuttua, ja tulen todennäköisesti projektin valmistuttua katsomaan, saanko päivityksen onnistumaan kivuttomasti.

**Commit 13:** Added functionality for deleting stories if the author is currently logged in, backgroundContext for fetching a random image from NASA's API and passing the url to all screens, <ImageBackground> element to most screens using the fetched picture, cleaned up multiple testing elements, added multiple conditional renders based on login status.

- API kutsussa käytetään NASAn julkista avainta, jonka päivittäinen käyttörajoitus on 50 kutsua per IP.

**Commit 14:** Added logic for automatically returning to homescreen after succesful login

**Commit 15:** Added comments for stories

### 03.05.2025

**Commit 16:** Added deletion of assosiacted image on story deletation and a backup source for background image if the API request fails

## Lähteet

Pitääkseni lähdemerkinnät mielekkäinä, olen listannut vain ne lähteet, joilla on ollut merkittävä merkitys koodini rakenteeseen.

Juha Hinkula. [Mobile Programming Course - kurssimateriaali](https://haagahelia.github.io/mobilecourse/docs/intro/)

Youtube. Net Ninja. [Complete React Native Tutorial #14 - Making an Auth Context](https://www.youtube.com/watch?v=Ky43ve3b9Ss)

Youtube. Net Ninja. [Complete React Native Tutorial #15 - Logging Users In](https://www.youtube.com/watch?v=RcrWlOgL1hM)