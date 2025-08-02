const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

// In-memory storage for feedback data (for demonstration)
let feedbackData = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
   
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
   
    // API endpoints
    if (pathname === '/api/feedback' && req.method === 'POST') {
        // Handle feedback submission
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
       
        req.on('end', () => {
            try {
                const feedback = JSON.parse(body);
               
                // Add server timestamp and ID
                feedback.serverId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                feedback.serverTimestamp = new Date().toISOString();
               
                feedbackData.push(feedback);
               
                console.log('📝 New feedback received:', feedback.rating, 'at', new Date().toLocaleString());
               
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Feedback saved successfully',
                    id: feedback.serverId
                }));
            } catch (error) {
                console.error('Error processing feedback:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
        return;
    }
   
    if (pathname === '/api/feedback' && req.method === 'GET') {
        // Return all feedback data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(feedbackData));
        return;
    }
   
    if (pathname === '/api/feedback/stats' && req.method === 'GET') {
        // Return feedback statistics
        const stats = {
            total: feedbackData.length,
            good: feedbackData.filter(f => f.rating === 'good').length,
            nice: feedbackData.filter(f => f.rating === 'nice').length,
            cool: feedbackData.filter(f => f.rating === 'cool').length,
            awesome: feedbackData.filter(f => f.rating === 'awesome').length
        };
       
        stats.satisfaction = feedbackData.length > 0 ?
            Math.round(((stats.cool + stats.awesome) / feedbackData.length) * 100) : 0;
           
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
        return;
    }
   
    if (pathname === '/api/feedback/clear' && req.method === 'DELETE') {
        // Clear all feedback data
        feedbackData = [];
        console.log('🗑️ All feedback data cleared');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'All data cleared' }));
        return;
    }
   
    // Serve static files
    let filePath = pathname === '/' ? './index.html' : '.' + pathname;
   
    // Security check - prevent directory traversal
    filePath = path.resolve(filePath);
    const rootDir = path.resolve('./');
    if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
   
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
   
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Server running on port ' + PORT);
    console.log('📊 Feedback Form: /');
    console.log('📈 Admin Dashboard: /admin.html');
    console.log('🔧 API Endpoints:');
    console.log('   - POST /api/feedback (submit feedback)');
    console.log('   - GET /api/feedback (get all feedback)');
    console.log('   - GET /api/feedback/stats (get statistics)');
    console.log('   - DELETE /api/feedback/clear (clear all data)');
    console.log('\n💡 Environment: ' + (process.env.NODE_ENV || 'development'));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server shutting down...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});