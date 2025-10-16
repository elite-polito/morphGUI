'use strict';
const port = process.env.PORT || 3001;
// Removed authentication imports - no login needed
const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path')

// Removed session and passport configuration - no authentication needed
const { creatorTool} = require('./tools/creatorTool');
const app = new express();
const logger = require('./tools/logger')
app.use(express.json());


//Middleware
const corsOptions  = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: process.env.NODE_ENV !== 'production'
}

app.use(cors(corsOptions));

// Removed all authentication middleware and passport configuration

// Serve static files from frontend build directory in production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendBuildPath));
    
    // Serve index.html for all routes (SPA routing)
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
}


app.post('/api/log', async(req, res)=> {
    const { userId } = req.query;
    const message = req.body.message
    const type = req.body.type
    // Validate inputs
    switch(type){
        case 0:
            logger.start(userId,message)
            break
        case 1:
            logger.generate(userId,message)
            break
        case 2:
            logger.endgenerate(userId,message)
            break
        case 3:
            logger.resetUI(userId,message)
            break
        case 4:
            logger.prevUI(userId,message)
            break
        case 5:
            logger.info(userId,message)
            break
        case 6:
            logger.warn(userId,message)
            break
        case 7:
            logger.error(userId,message)
            break
        case 8:
            logger.end(userId,message)
            break

        default:
            logger.info(userId,message)
            break

    }
    res.sendStatus(200)
})

// Removed authentication endpoints - no login/logout needed

// Removed database-dependent endpoints - using localStorage instead

app.post('/api/update-customization', async (req, res) => {
    const { userId, appType } = req.query;
    const { data, apiKey, currentCode } = req.body;
    
    if (!userId) {
        return res.status(400).send('Bad Request');
    }
    
    if (!apiKey) {
        return res.status(400).send('OpenAI API Key required');
    }
    
    try {
        const generatedCode = await generateComponentCode(data, apiKey, appType || 'calendar', currentCode)
        return res.status(200).json({ code: generatedCode })
    } catch (error) {
        console.error('Error during customization update:', error);
        return res.status(500).send('Internal Server Error');
    }

});

// Removed generation count endpoints - using localStorage instead


// Removed component-code endpoint - using localStorage instead

// New endpoint to validate OpenAI API key
app.post('/api/validate-api-key', async (req, res) => {
    const { apiKey } = req.body;
    
    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
    }
    
    try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({
            apiKey: apiKey,
        });
        
        // Make a simple test call to validate the API key
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: "Hello, this is a test message to validate the API key."
                }
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 10,
            temperature: 0
        });
        
        if (response && response.choices && response.choices.length > 0) {
            res.json({ valid: true, message: 'API key is valid and working' });
        } else {
            res.status(400).json({ valid: false, error: 'Invalid API response' });
        }
    } catch (error) {
        console.error('API key validation error:', error.message);
        res.status(400).json({ 
            valid: false, 
            error: error.message.includes('401') ? 'Invalid API key' : 
                   error.message.includes('429') ? 'API rate limit exceeded' :
                   error.message.includes('insufficient_quota') ? 'API quota exceeded' :
                   'API key validation failed'
        });
    }
});

// New endpoint to get default component code for localStorage initialization
app.get('/api/default-component-code', (req, res) => {
    try {
        const appType = req.query.appType || 'calendar';
        let defaultCodePath;
        
        if (appType === 'ecommerce') {
            defaultCodePath = path.join(__dirname, 'default-code', 'default-ecommerce-component.jsx');
        } else if (appType === 'dashboard') {
            defaultCodePath = path.join(__dirname, 'default-code', 'default-dashboard-component.jsx');
        } else {
            defaultCodePath = path.join(__dirname, 'default-code', 'default-component.jsx');
        }
        
        if (!fs.existsSync(defaultCodePath)) {
            return res.status(404).json({ error: 'Default component file not found' });
        }
        
        const defaultCode = fs.readFileSync(defaultCodePath, 'utf-8');
        res.json({ code: defaultCode });
    } catch (error) {
        console.error('Error reading default component:', error);
        res.status(500).json({ error: 'Error reading default component file' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

async function generateComponentCode(data, apiKey, appType = 'calendar', providedCurrentCode = null) {
    try {
        let currentCode;
        
        // Use provided current code from localStorage if available, otherwise fall back to default
        if (providedCurrentCode) {
            currentCode = providedCurrentCode;
            console.log('Using current UI code from localStorage for generation');
        } else {
            // Get default component code from file based on app type
            let defaultCodePath;
            if (appType === 'ecommerce') {
                defaultCodePath = path.join(__dirname, 'default-code', 'default-ecommerce-component.jsx');
            } else if (appType === 'dashboard') {
                defaultCodePath = path.join(__dirname, 'default-code', 'default-dashboard-component.jsx');
            } else {
                defaultCodePath = path.join(__dirname, 'default-code', 'default-component.jsx');
            }
            
            if (!fs.existsSync(defaultCodePath)) {
                throw new Error('Default component file not found');
            }
            
            currentCode = fs.readFileSync(defaultCodePath, 'utf-8');
            console.log('Using default component code from file for generation');
        }
        
        return new Promise(async (resolve, reject) => {
            try {
                const fileName = await creatorTool(currentCode, data, apiKey);
                const jsxFilePath = path.join(__dirname, 'temp', `${fileName}.jsx`);

                fs.access(jsxFilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        return reject(new Error('Generated file does not exist'));
                    }
                    try {
                        const jsxCode = fs.readFileSync(jsxFilePath, 'utf-8');
                        
                        // Clean up the file
                       fs.unlink(jsxFilePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${jsxFilePath}`, err);
                            } else {
                                console.log(`File deleted successfully: ${jsxFilePath}`);
                            }
                        });
                        
                        resolve(jsxCode);
                    } catch (error) {
                        reject(error);
                    }
                });

            } catch (error) {
                reject(error);
            }
        });
        
    } catch (error) {
        throw new Error(`Error generating component code: ${error.message}`);
    }
}

// Removed old generateComponent function - using generateComponentCode instead
