# Satiscraft

Ein 3D-Browserspiel, das Minecraft und Satisfactory mischt: Du baust eine Blockwelt ab und errichtest darin Fabriken mit Minern, Förderbändern und Verarbeitungsmaschinen.

## Starten

Öffne `index.html` in einem aktuellen Browser auf dem PC. Chrome, Edge und Firefox funktionieren. Three.js r128 wird von cdnjs geladen, du brauchst also eine Internetverbindung.

## Steuerung

| Taste | Aktion |
|---|---|
| WASD | Laufen |
| Rechte Maus halten + ziehen | Kamera drehen |
| Mauszeiger | Zielen |
| Leertaste / Shift | Springen / rennen |
| Linke Maus halten | Abbauen; bei Maschinen: abreißen (volle Rückerstattung) |
| Rechtsklick (ohne Ziehen) | Block setzen (Auswahl mit 1–4); im Baumodus: abbrechen |
| Esc | Pause |
| Q | Baumenü |
| R / Mausrad | Bauvorschau drehen |
| E | Maschine öffnen |
| I | Inventar |

## Spielprinzip

- **Werkzeugstufen:** Hand → Holz- → Stein- → Eisen- → Stahlspitzhacke. Jede Stufe schaltet härtere Erze frei: Stein und Kohle, dann Kupfer und Eisen, dann Gold, zuletzt Titan.
- **Miner:** Setz ihn auf ein Erzvorkommen oder auf Stein. Das Abbauziel (Erze oder Stein) wählt er automatisch; im Maschinenfenster (E) kannst du es umstellen. Jeder Erzblock darunter enthält 40 Einheiten. Der Miner baut den Bereich Schicht für Schicht ab.
- **Gebäude:** Sie brauchen eine ebene, freigeräumte Fläche, je nach Gebäude 1×1, 2×2, 2×3 oder 3×3.
- **Anschlüsse:** Grüne Pfeile sind Eingänge, orange Pfeile sind Ausgänge.
- **Bänder kreuzen:** Die Förderbandbrücke ist 3 Felder lang und überspannt 1 Feld, die lange Brücke ist 5 lang und überspannt 3. Unter dem Bogen kann ein anderes Band durchlaufen. Alternativ baust du die Brücke selbst aus Blöcken: Bänder steigen und fallen pro Feld um einen Block und werden dabei als Rampe dargestellt.
- **Lager:** Die Lagerkiste (1×1, 999 Items) nimmt aus jeder Richtung an. Der Lagercontainer (2×2, 1.500 Items, 4 Eingänge) und das Industrielager (3×3, 5.000 Items, 5 Eingänge) nehmen nur an ihren markierten Eingängen an.
- **Meilensteine:** Oben links steht jeweils der nächste Schritt.
- **Speichern:** Der Spielstand wird im `localStorage` des Browsers gespeichert.

## Sicherheit

- **Content Security Policy:** `index.html` setzt eine strenge CSP. Skripte kommen nur aus `game.js` und dem festen three.js-Pfad auf cdnjs, Inline-Skripte sind gesperrt. Es gibt keine Netzwerkverbindungen (`connect-src 'none'`), keine Plugins, Formulare oder `<base>`.
- **Speicherstände:** Sie werden beim Laden streng geprüft, weil sich auf `*.github.io` alle Pages-Seiten eines Kontos denselben `localStorage` teilen. Nur bekannte Item- und Gebäudetypen, gültige Zahlen und Koordinaten innerhalb der Welt werden übernommen. Kaputte Stände führen zu einer neuen Welt statt zu einem Absturz.
- **Keine Nutzerdaten:** Das Spiel hat kein Backend, keine Cookies und kein Tracking. Die Seite sendet keinen Referrer.
- **Subresource Integrity:** three.js r128 wird mit einem SHA-384-Hash geladen. Eine veränderte CDN-Datei führt der Browser nicht aus.
