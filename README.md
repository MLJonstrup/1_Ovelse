Hejsa,

Her er et par ting som er gode at vide. 

1. Appen åbnes fra folderen "1_Ovelsesopgave" hvori alle components også ligger
2. Jeg har slettet hele node_modules mappen, så den skal lige installeres i ovenstående mappe inden appen åbnes
3. Jeg har selv brugt følgende komando for at åbne: npx expo start --tunnel  ved ikke om det 
4. Jeg prøvede at lave dark mode, men det virkede ikke. Login, logud, opret bruger og ændring af bruger virker + lokation.

Jeg have nogle problemer med node_modules efter at have slettet dem, men følgende virkede for mig: 
    npm cache clean --force
    rm -rf node_modules package-lock.json
    npm install
    npx expo install expo

Held og lykke!