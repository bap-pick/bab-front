export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const EC2_URL = process.env.EC2_API_URL;

        const targetPath = req.url;

        const fullUrl = `${EC2_URL}${targetPath}`;

        // Authorization 헤더 전달
        const headers = {
            'Content-Type': 'application/json',
        };
        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        }

        const response = await fetch(fullUrl, {
            method: req.method,
            headers,
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
}
