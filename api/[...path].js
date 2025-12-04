export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const EC2_URL = process.env.EC2_API_URL;
        
        const { path } = req.query;
        const endpoint = Array.isArray(path) ? `/${path.join('/')}` : `/${path}`;
        
        console.log(`[Proxy] Final EC2 Endpoint: ${EC2_URL}${fullEndpoint}`);
        
        const response = await fetch(`${EC2_URL}${endpoint}`, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
}