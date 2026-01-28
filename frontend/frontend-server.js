const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname));

// Custom Extension-less and Case-insensitive Routing
app.get('/:page', (req, res, next) => {
    let page = req.params.page.toLowerCase();

    // If it has an extension, let express.static handle it
    if (page.includes('.')) return next();

    // Normalize dashboard/profile/history/index
    const validPages = ['dashboard', 'profile', 'history', 'index', 'signup'];
    if (validPages.includes(page)) {
        return res.sendFile(path.join(__dirname, `${page}.html`));
    }
    next();
});

// Explicitly serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Improved Catch-all: Redirect unknown routes to index.html
app.get('*', (req, res) => {
    // If it looks like a file (has a dot) but wasn't found, don't redirect (could be a broken image/script)
    if (req.path.includes('.')) {
        return res.status(404).send('Not Found');
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Frontend server running on http://127.0.0.1:3000');
});
