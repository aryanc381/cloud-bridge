const express = require('express');
const dotenv = require('dotenv');
const httpProxy = require('http-proxy');
dotenv.config();

const app = express();
const PORT = 8000;
const BASE_PATH = 'https://vercel-clone-outputs.s3.ap-south-1.amazonaws.com/__outputs'
app.listen(PORT, () => { console.log(`Reverse Proxy is listening at PORT ${PORT}`)});

const proxy = httpProxy.createProxy();

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    const resolvesTo = `${BASE_PATH}/${subdomain}`

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if(url === '/') { proxyReq.path += 'index.html' }
    return proxyReq
});