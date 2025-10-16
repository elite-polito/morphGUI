const fs = require('fs');
const path = require('path');

const easyLogsDir = path.join(__dirname, './logsEasy');
const difficultLogsDir = path.join(__dirname, './logsHard');
const outputFilePath = path.join(__dirname, 'log_summary.json');

const processLogData = (data) => {
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

    const deltaTime = startTime && endTime ? (endTime - startTime) / 1000 / 60 : 0; // in minutes
    const avgGenerationTime = generationTimes.length ? (totalGenerationTime / generationTimes.length) : 0;

    return {
        deltaTimeMinutes: deltaTime,
        generateCount: generateCount,
        resetCount: resetCount,
        previousCount: previousCount,
        errorCount: errorCount,
        warningCount: warningCount,
        infoCount: infoCount,
        avgGenerationTimeSeconds: avgGenerationTime.toFixed(2)
    };
};

// Function to read and process log files for each user
const generateUserLogsSummary = () => {
    const easyFiles = fs.readdirSync(easyLogsDir).filter(file => path.extname(file) === '.txt');
    const difficultFiles = fs.readdirSync(difficultLogsDir).filter(file => path.extname(file) === '.txt');

    const summary = {};

    const userCount = Math.min(easyFiles.length, difficultFiles.length);
    for (let i = 0; i < userCount; i++) {
        const easyFile = easyFiles[i];
        const difficultFile = difficultFiles[i];
        const easyFilePath = path.join(easyLogsDir, easyFile);
        const difficultFilePath = path.join(difficultLogsDir, difficultFile);

        const userIdentifier = path.parse(easyFile).name;

        const easyData = fs.readFileSync(easyFilePath, 'utf8');
        const difficultData = fs.readFileSync(difficultFilePath, 'utf8');

        summary[userIdentifier] = {
            age: '', // blank field
            gender: '', // blank field
            studyOrWorkingField: '', // blank field
            calendarUsage: '', // blank field
            confidencePrompt: '', // blank field
            experienceInUI: '', // blank field
            easy: {
                fileName: easyFile,
                ...processLogData(easyData)
            },
            difficult: {
                fileName: difficultFile,
                ...processLogData(difficultData)
            }
        };
    }

    return summary;
};

const summary = generateUserLogsSummary();
fs.writeFileSync(outputFilePath, JSON.stringify(summary, null, 2), 'utf8');
console.log('Log summary written to', outputFilePath);
