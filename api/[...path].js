export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Authorization 추가!

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const EC2_URL = process.env.EC2_API_URL;
        const { path } = req.query;
        const endpoint = Array.isArray(path) ? `/${path.join('/')}` : `/${path}`;
        
        // 요청 헤더 전달 (Authorization 포함)
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Authorization 헤더가 있으면 전달
        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        }

        const response = await fetch(`${EC2_URL}${endpoint}`, {
            method: req.method,
            headers: headers,
            body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
}