const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
const PORT = 3000;

// Rota da API
app.get('/api/journey', async (req, res) => {
    const { cookie, xcsrftoken } = req.headers;

    try {
        const response = await axios.request({
            method: 'POST',
            url: `https://jbinteractions.s11.marketingcloudapps.com/fuelapi/interaction/v1/interactions/journeyhistory/search?$page=1&$pageSize=100`,
            headers: {
                'Cookie': cookie,
                'X-CSRF-Token': xcsrftoken
            },
            data: {
                activityIds: [
                    "70d062a6-09a2-429e-94b4-1b42e8a8b007"
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
        return res.json(response.data);
    } catch (error) {
        // Em caso de erro, enviamos uma resposta de erro
        console.log(error)
        res.status(500).json({ error: "erro, olhe o log."});
    }
});

// Inicializa o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
