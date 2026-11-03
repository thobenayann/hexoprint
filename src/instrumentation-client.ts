import { initBotId } from 'botid/client/core';

// BotID charge son script de défi dans le navigateur et signe chaque appel
// vers les routes listées ici. Sans cette signature, checkBotId() côté serveur
// classe l'appel comme un robot : un script (curl, etc.) qui frappe
// directement l'API est donc refusé.
// Le niveau Basic est écrit en toutes lettres des deux côtés (ici et dans
// chaque route). Côté serveur, il fixe le verdict et la facturation : activer
// l'analyse approfondie dans le tableau de bord Vercel ne les change pas sans
// décision explicite. Côté client, il ne garantit rien : si le défi renvoie
// d=1 (réglage du tableau de bord), le navigateur peut charger le script
// d'analyse approfondie quel que soit ce niveau.
initBotId({
    protect: [
        {
            path: '/api/contact',
            method: 'POST',
            advancedOptions: { checkLevel: 'basic' },
        },
        {
            path: '/api/upload',
            method: 'POST',
            advancedOptions: { checkLevel: 'basic' },
        },
    ],
});
