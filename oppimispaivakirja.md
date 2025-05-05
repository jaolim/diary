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

### 04.05.2025

**Commit 17:** Reduced Camera picture resolution to limit storage usage

Katsoin tässä kohdassa myös mahdollisuutta pitää koko tarinalista muistissa ja hoitaa filteröinti ohjelmalogiikassa tietokantakyselyn sijaan, mutta ensimmäinen toteutus aiheutti bugeja renderöinnissä screenejä vaihdettaessa, joten jätin sen tekemättä.

**Commit 18:** Fixed broken logic for validating unique username in signup screen

### Android build

Kokeilin tässä kohtaan androidille asennettavan buildin luontia. Tein tätä varten EAS tilin ja käytin [expon ohjeita](https://docs.expo.dev/build/introduction/).
Ensimmäinen yritys tuotti .aab tiedoston, jonka asennus android puhelemiin olisi vaatinut erillisen sovelluksen, joten selvitin, että eas:in konffaus tapahtuu projektikansiossa olevan *eas.json* tiedoston kautta, ja lisäsin sinne productionin alle .apk tyypin määrityksen.

```
"android": {
  "buildType": "apk"
  }
```

Tämän jälkeen ajoin buildin uudestaan, ja lopputuloksena oli Android puhelimellani ilman lisäohjelmia asennettava ja toimiva versio.

**Commit 19:** Added comments to code, added summary rection to learning dairy

### 05.05.2025

**Commit 20:** Removed FlatList and added ScrollView to viewStory screen, added icons to most buttons

### Yhteenveto

Alustavien speksien ominaisuuksista päädyin toteuttamaan kohdat 1 ja 2 kokonaisuudessaan ja kohdan 4 osittain.
Kokonaan speksien ulkopuolisena ominaisuutena toteutin sovelluksen taustakuvien haun NASA:n APOD palvelusta ja kamerakuvien pysyvän tallenuksen lokaaliin tiedostojärjestelmään (aluksi oli tarkoitus tallentaa tietokantaan).

Pääsyy ominasuuksien supistemiselle oli odotettua työläämpi toteutus lokaaliin tallennukseen, jossa jouduin SQLite tietokannan lisäksi käyttämään FileSystemin kautta lokaalia tallennustilaa.
Lisäksi omien kontekstien kirjoitus osoittautui vievän olettamaani enemmän aikaa, joten en kokenut pilvitallennuksen implementointia mielekkäänä, koska en olettanut ajan riittävän sen saamiseen järkevälle tasolle.

En ollut myöskään käyttänyt TypeScriptiä ennen tätä kurssia, joten vaikka kirjoitin valta osa viikkotehtävistä sitä käyttäen, oli siihen totuttelu myös projektia hidastava tekijä

Alkuperäistä suunnitelmaa laajempi toteutus oli aktiivista käyttäjää seuraava ja kirjautumis- sekä käyttäjänluontifunktioita tarjoava custom context AuthContext.

#### Lopullinen rakenne

Sovellus koostuu *Home*, *NewStory*, *ViewStory*, *Signin* ja *Signup* ruuduista, joiden välinen navigaatio on hoidettu *react-navigationin* *stack* navigaattorilla.

**Ruudut:**
- Home: appin kotivisu, joka sisältää eri navigaationäppäimiä, sekä listan tarinoista, joita klikkaamalla pääsee tarkempaan näkymään kyseisestä tarinasta
- NewStory: sivu uuden tarinan luonnille, jossa voidaan myös avata kameranäkymä kuvan ottamiseen, jos sellainen halutaan liittää tarinaan
- ViewStory: yksittäisen tarinan näkymä, jossa on mahdollista kommentoida tarinaa
- Signin: kirjautumissivu käyttäjille
- Signup: sivu uuden käyttäjän luonnille

*Viewstory* saa halutun tarinan id:n *react-navigationin* *routen* kautta. Muut sivut käyttävät konteksteja yhteisiin muuttujiin.

**Kontekstit:**

- Navigaatio (react-navigation): NavigationContinainer - useNavigation
- Tietokanta (expo-sqlite): SQLiteProvider - useSQLiteContext
- Taustakuva (custom): BackgroundProvider - useBackground
- Käyttäjän tunnistus (custom): AuthProvider - useAuth

**Aputiedostot:**

- customTypes.ts: TypeScript tyypimäärittelyjä
- styles.ts: custom stylesheet
- initializeDatabase.tsx: database konfiguraatio

**Rakenne (importit jätetty pois)**

App.tsx:
```
const Stack = createStackNavigator<NavigatorParams>();

export default function App() {
  return (
    <PaperProvider>
      <SQLiteProvider databaseName="stories.db" onInit={initializeDatabase}>
        <BackgroundProvider>
          <AuthProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="NewStory" component={NewStory} />
                <Stack.Screen name="ViewStory" component={ViewStory} />
                <Stack.Screen name="Signin" component={Signin} />
                <Stack.Screen name="Signup" component={Signup} />
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </BackgroundProvider>
      </SQLiteProvider>
    </PaperProvider>
  )
}
```

**Luentojen ulkpuoliset kirjastot/laiteominaisuudet**

*En pitänyt kirjaa siitä, mitkä asiasta olivat jo luennoilta tuttuja, joten tämä lista on kirjoitettu muistini varassa selatessani importit läpi, eli virheitä saattaa olla.*

- expo-file-system(laiteominaisuus/kirjasto): kirjasto tiedostojärjestelmän hallintaan
- dayjs(kirjasto): kirjasto aikojan käsittelyyn

**Android buildin repositorio:** https://github.com/jaolim/diary-android-build

*Buildi tehty EAS Buildin kautta käyttäen maksutonta versiota*

## Lähteet

*Pitääkseni lähdemerkinnät mielekkäinä, olen listannut vain ne lähteet, joilla on ollut merkittävä merkitys koodini rakenteeseen.*

Juha Hinkula. [Mobile Programming Course - kurssimateriaali](https://haagahelia.github.io/mobilecourse/docs/intro/)

Youtube. Net Ninja. [Complete React Native Tutorial #14 - Making an Auth Context](https://www.youtube.com/watch?v=Ky43ve3b9Ss)

Youtube. Net Ninja. [Complete React Native Tutorial #15 - Logging Users In](https://www.youtube.com/watch?v=RcrWlOgL1hM)