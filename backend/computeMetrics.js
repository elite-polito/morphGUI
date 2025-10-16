const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, './logs/logs_user17.txt');
fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the log file:', err);
        return;
    }

    const logs = data.split('\n').filter(line => line.trim() !== '');

    let startTime = null;
    let endTime = null;
    let generateCount = 0;
    let resetCount = 0;
    let previousCount = 0;
    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    let totalGenerationTime = 0;
    let generationTimes = [];

    logs.forEach(log => {
        const timestamp = new Date(log.substring(0, 29));
        const action = log.match(/\[(.*?)\]/)?.[1];

        switch (action) {
            case 'START':
                startTime = timestamp;
                break;
            case 'END':
                endTime = timestamp;
                break;
            case 'GENERATE':
                generateCount++;
                const startGenerate = timestamp;
                logs.forEach(followingLog => {
                    const followingTimestamp = new Date(followingLog.substring(0, 29));
                    if (followingLog.includes('[END-GENERATE]')) {
                        const generationDuration = (followingTimestamp - startGenerate) / 1000; // in seconds
                        generationTimes.push(generationDuration);
                        totalGenerationTime += generationDuration;
                        return;
                    }
                });
                break;
            case 'RESETUI':
                resetCount++;
                break;
            case 'PREVIOUSUI':
                previousCount++;
                break;
            case 'ERROR':
                errorCount++;
                break;
            case 'WARNING':
                warningCount++;
                break;
            case 'INFO':
                infoCount++;
                break;
            default:
                break;
        }
    });

    const deltaTime = (endTime - startTime) / 1000 / 60; // in seconds
    const avgGenerationTime = totalGenerationTime / generationTimes.length || 0;

    console.log('Delta Time (minutes):', deltaTime);
    console.log('GENERATE Count:', generateCount);
    console.log('RESETUI Count:', resetCount);
    console.log('PREVIOUSUI Count:', previousCount);
    console.log('ERROR Count:', errorCount);
    console.log('WARNING Count:', warningCount);
    console.log('INFO Count:', infoCount);
    console.log('Average Generation Time (seconds):', avgGenerationTime.toFixed(2));
});
