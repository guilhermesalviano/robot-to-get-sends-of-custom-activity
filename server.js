const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const PORT = 3000;

// Rota da API
app.get('/api/journey', async (req, res) => {
    const { cookie, xcsrftoken } = req.headers;
    const { activityId } = req.body;
    try {
        let page = 1;
        const pageSize = 1000;
        const response = await getCustomSends(cookie, xcsrftoken, activityId, page, pageSize);
        const amountResults = response.data.count;
        let results = response.data.items.map((object) => {
            return {
                contactKey: object.contactKey,
                transactionTime: object.transactionTime,
                activityName: object.activityName,
                status: object.status,
                clientStatus: object.clientStatus
            }
        });
        if (pageSize < amountResults) {
            page++;
            const pages = Math.ceil(amountResults/pageSize);
            while (page <= pages) {
                const response = await getCustomSends(cookie, xcsrftoken, activityId, page, pageSize);
                results.push(...response.data.items.map((object) => {
                    return {
                        contactKey: object.contactKey,
                        transactionTime: object.transactionTime,
                        activityName: object.activityName,
                        status: object.status,
                        clientStatus: object.clientStatus
                    }
                }));
                page++;
            }
        }
        return res.json(results);
    } catch (error) {
        // Em caso de erro, enviamos uma resposta de erro
        console.log(error)
        res.status(500).json({ error: "erro, olhe o log."});
    }
});

async function getCustomSends(cookie, xcsrftoken, activityId, page, pageSize) {
    return await axios.request({
        method: 'POST',
        url: `https://jbinteractions.s11.marketingcloudapps.com/fuelapi/interaction/v1/interactions/journeyhistory/search?$page=${page}&$pageSize=${pageSize}`,
        headers: {
            'Cookie': cookie,
            'X-CSRF-Token': xcsrftoken
        },
        data: {
            activityIds: [
                activityId
            ],
            activityTypes: [
                "REST"
            ],
            contactKeys: [],
            start: "2023-10-28T17:54:28.117Z",
            end: null,
            clientStatuses: [
                "AllActivityMembership"
            ]
        },
      
    });
}

// Inicializa o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
