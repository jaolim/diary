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

### 08.04.2025

Olin jo aiemmin pyöritellyt eri moduuleja testiprojektissa varmistaakseni niiden yhteensopivuuden, mutta tässä kohtaan aloitin varsinaisen lopputyöprojektin

Tein projektin käyttäen expon blank typescript templatea ```npx create-expo-app diary -- template blank-typescript```.

**Commit 1:** Added files for styles and types and first 2 screens

**Commit 2:** Implemented basic navigation between screens with React Stack Navigator

**Commit 3:** Added react-native-paper and fixed module resolution for typescript

- TypeScriptillä oli ongelmia tunnistaa react-navigation moduuli päivityksen jälkeen. Korjasin määrittelemällä *tsconfigissa* ```"moduleResolution": "Bundler"```

**Commit 4:** Added SQLiteDatabase and some functions for testing it

- Eri sivut ovat *SQLiteProviderin* providerin sisällä ja tietokannan käsittelyyn käytetään *useSQLiteContext* kontekstia.

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