export default async function handler(req, res) {
    const EC2_URL = process.env.EC2_API_URL;
    const wsUrl = EC2_URL.replace('http://', 'ws://').replace('https://', 'wss://');
    res.status(200).json({ wsUrl });
}