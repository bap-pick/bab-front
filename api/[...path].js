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
        const { path } = req.query;
        const endpoint = Array.isArray(path) ? `/${path.join('/')}` : `/${path}`;
        
        // 쿼리 파라미터 추출 및 전달
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(req.query)) {
            if (key !== 'path') {  // 'path'는 제외
                queryParams.append(key, value);
            }
        }
        const queryString = queryParams.toString();
        const fullUrl = queryString 
            ? `${EC2_URL}${endpoint}?${queryString}`
            : `${EC2_URL}${endpoint}`;
        
        // Authorization 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
        };
        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        }

        const response = await fetch(fullUrl, {
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