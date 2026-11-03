import { initBotId } from 'botid/client/core';

// BotID charge son script de défi dans le navigateur et signe chaque appel
// vers les routes listées ici. Sans cette signature, checkBotId() côté serveur
// classe l'appel comme un robot : un script (curl, etc.) qui frappe
// directement l'API est donc refusé. Mode Basic, sans analyse approfondie.
initBotId({
    protect: [
        {
            path: '/api/contact',
            method: 'POST',
        },
        {
            path: '/api/upload',
            method: 'POST',
        },
    ],
});
