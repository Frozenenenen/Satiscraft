# Satiscraft

Ein 3D-Browserspiel, das Minecraft und Satisfactory mischt: Du baust eine Blockwelt ab und errichtest darin Fabriken mit Minern, Förderbändern und Verarbeitungsmaschinen.

## Starten

Öffne `index.html` in einem aktuellen Browser auf dem PC. Chrome, Edge und Firefox funktionieren. Three.js r128 wird von cdnjs geladen, du brauchst also eine Internetverbindung.

## Steuerung

| Taste | Aktion |
|---|---|
| WASD / Maus | Laufen und umsehen |
| Leertaste / Shift | Springen / rennen |
| Linke Maus halten | Abbauen; bei Maschinen: abreißen (volle Rückerstattung) |
| Rechte Maus | Block setzen (Auswahl mit 1–4) |
| Q | Baumenü |
| R / Mausrad | Bauvorschau drehen |
| E | Maschine öffnen |
| I | Inventar |

## Spielprinzip

- **Werkzeugstufen:** Hand → Holz- → Stein- → Eisen- → Stahlspitzhacke. Jede Stufe schaltet härtere Erze frei: Stein und Kohle, dann Kupfer und Eisen, dann Gold, zuletzt Titan.
- **Miner:** Setz ihn auf ein Erzvorkommen. Jeder Erzblock darunter enthält 40 Einheiten. Der Miner baut den Bereich Schicht für Schicht ab.
- **Gebäude:** Sie brauchen eine ebene, freigeräumte Fläche, je nach Gebäude 1×1, 2×2, 2×3 oder 3×3.
- **Anschlüsse:** Grüne Pfeile sind Eingänge, orange Pfeile sind Ausgänge.
- **Meilensteine:** Oben links steht jeweils der nächste Schritt.
- **Speichern:** Der Spielstand wird im `localStorage` des Browsers gespeichert.

## Sicherheit

- **Content Security Policy:** `index.html` setzt eine strenge CSP. Skripte kommen nur aus `game.js` und dem festen three.js-Pfad auf cdnjs, Inline-Skripte sind gesperrt. Es gibt keine Netzwerkverbindungen (`connect-src 'none'`), keine Plugins, Formulare oder `<base>`.
- **Speicherstände:** Sie werden beim Laden streng geprüft, weil sich auf `*.github.io` alle Pages-Seiten eines Kontos denselben `localStorage` teilen. Nur bekannte Item- und Gebäudetypen, gültige Zahlen und Koordinaten innerhalb der Welt werden übernommen. Kaputte Stände führen zu einer neuen Welt statt zu einem Absturz.
- **Keine Nutzerdaten:** Das Spiel hat kein Backend, keine Cookies und kein Tracking. Die Seite sendet keinen Referrer.
- **Offen:** Für three.js fehlt noch ein Subresource-Integrity-Hash (`integrity="sha384-…"`). Alternativ kann man `three.min.js` direkt ins Repo legen.
