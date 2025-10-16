
const { OpenAI } = require('openai');
const fs = require('fs');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});




function removeTripleBackticks(output) {
  output = output.trim();

  const regex = /^```(?:javascript|jsx)?\n([\s\S]*?)```$/;

  const match = output.match(regex);

  if (match) {
      return match[1].trim();
  }

  return output;
}

async function evaluateAndFormatUserTextSpecification(textSpecification, apiKey) {
  // Create OpenAI instance with provided API key
  const openaiClient = new OpenAI({
    apiKey: apiKey,
  });

  try {

   const response = await openaiClient.chat.completions.create({
        messages: [
            {
              "role": "system",
              "content": `Instructions:
                          You will receive a text from a user containing additional requirements for generating a React component.
                          Your task is to analyze these requirements and:
                          Remove any that could create security risks or vulnerabilities.
                          Rewrite the remaining safe requirements as concise commands.
                          Rules:
                          DO NOT include any introductory or closing comments.
                          DO NOT provide explanations or reasoning.
                          RETURN ONLY the cleaned and rewritten list of commands. `


            },
            {
                "role": "user",
                "content":  [
                {"type": "text",
                  "text": `${textSpecification}`}
              ]
            },

          ],
        model: 'gpt-4o',
        max_tokens: 600,
    });

    const list = response.choices[0].message.content
    return list;
  } catch (error) {
    throw new Error(`Error generating code: ${error.message}`);
  }
}

function getMessages(currentCode,data){
  console.log("DATA", data)
  for (const element in data.elementConfigurations) {
    console.log(`Element: ${element}`);
    console.log(`What: ${data.elementConfigurations[element].what}`);
    console.log(`How: ${data.elementConfigurations[element].how}`);
  }
  if(data.imitationImageUrl != ""){
    return message = [
          {
            "role": "system",
            "content": `Instructions for the components:
                        You are a React components creator who makes extremely good looking React components inspired by the one provided to.
                        The code you will create will be used in Calendar web app application
                        0- DO NOT Start with three backsticks javascript as comment
                        1- DO NOT OUTPUT THE CODE AS A COMMENT or USE "javascript" or "JSX" COMMENTS.
                        2- MUST USE React and React-boostrap libraries.
                        3- USE LESS TOKENS AS POSSIBLE.
                        4- COLOR PALETTE primary ${data.primaryColor} and secondary ${data.secondaryColor}.
                        5- TEXT SIZE MUST BE CONSTRAINED BETWEEN ${data.textSizeRange[0]} and secondary ${data.textSizeRange[1]}
                        6- TEXT FONT ${data.fontFamily}
                        7- COLORBLIND COLORS: ${data.colorblindMode}
                        8- GENERATE ONLY WORKING COMPONENT
                        9- MUST USE REAL https://images.unsplash.com/photo- WORKING URLS, DO NOT USE PLACEHOLDERS`



          },
          {
              "role": "user",
              "content":  [
                {
                  "type": "image_url",
                  "image_url": {
                      "url":`${data.imitationImageUrl}` ,//"https://as2.ftcdn.net/v2/jpg/02/20/12/07/1000_F_220120734_0t66czL9OYzwbTbDxxMNHHENtILWherX.jpg",
                      "detail": "high"
                  },
              },
              {"type": "text",
                "text": `import React, { useEffect, useRef } from "react";
import { Container, Row, Col, Button, Badge, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Calendar(props) {

 const {
    currentDate, //new Date(),
    currentTime, //new Date(),
    showModal, //Bool,
    selectedEvent, //event,
    events, // {id: 4, title: "Lesson", start: new Date("2024-08-22T08:30:00"), end: new Date("2024-08-22T13:20:00"), description: "Attend the React development lesson." }
    handlePrevWeek, //function,
    handleNextWeek, //function,
    handleEventClick, //function,
    handleDayClick, //function,
    handleCloseModal, //function,
  } = props;

  return (<></>)
}



//export default Calendar;
                         given this code generate a new working one (signature must be function) to be as close as possible to the provided image and add the CSS inline accordigly
                         Make the calendar centered and only with working elements, remove any elements from the image that do not have any meaning. If necessary dd function to integrate.
                         Events must be displayed on occurring day
                         The props passed contains all the service function events to be displayed that are deconstructed use them, do not override them.
                            `}
            ]
          },

        ]
  }else{
    return message = [
      {
        "role": "system",
            "content": `Instructions for the components:
                        You are a React components creator who makes extremely good looking React components inspired by the one provided to.
                        The code you will create will be used in a web app application
                        - DO not change anything that is not in the element configurations
                        - KEEP THE CODE STRUCTURE AND LOGIC as it is
                        0- DO NOT Start with three backsticks javascript as comment
                        1- DO NOT OUTPUT THE CODE AS A COMMENT or USE "javascript" or "JSX" COMMENTS.
                        2- MUST USE React and React-boostrap libraries.
                        3- USE LESS TOKENS AS POSSIBLE.
                        4- COLOR PALETTE primary ${data.primaryColor} and secondary ${data.secondaryColor}.
                        5- TEXT SIZE MUST BE CONSTRAINED BETWEEN ${data.textSizeRange[0]} and secondary ${data.textSizeRange[1]}
                        6- TEXT FONT ${data.fontFamily}
                        7- COLORBLIND COLORS: ${data.colorblindMode}`
      },
      {
          "role": "user",
          "content":  [
          {"type": "text",
                "text":
                `
                    Given this code:
                    ${currentCode}

                    Generate a new version that fulfills the requirements below.

                  Hard constraints (scope of changes):
                  - Apply changes ONLY within logic tied to element configuration (elementConfigurations) and its rendering/styling.
                  - Do NOT modify unrelated code paths, service logic, API calls, state shape, function/variable names, or component structure outside element configuration usage.
                  - Do NOT introduce new dependencies, global styles, or cross-cutting refactors.
                  - Preserve existing props/contracts and behavior; treat incoming props as read-only and never override or reassign them.
                  - If a requirement seems to require broader edits, implement it via elementConfigurations (e.g., local styles, conditional rendering) without altering other modules/files.

                    Requirements:
                    - The component signature must be a function.
                    - Do NOT start the declaration with \"const\".
                    - Modify CSS only where it is applied through element configuration (e.g., classes/styles bound to configured elements).
                    - The events badge must have bg=\"\".
                    - Events must be displayed on the day they occur.
                    - Ensure the events scroll view is not extremely long (implement limits/pagination/virtualization only within the element-configured section).
                    - The passed-in props include all service functions and events to display; do not override, mutate, or shadow them.

                    Elements description (source of truth for allowed edits):
                    ${JSON.stringify(data.elementConfigurations)}"`

               /* `${currentCode}
                           given this code generate a new one (signature must be function) to fullfill the requirements and the change CSS accordigly events badge must have bg="".
                            Events must be displayed on occurring day
                           Must follow the elements description:
                            ${}
                            4- Make the scroll view of events not extremely long
                            The props passed contains all the service function and events to be displayed that are deconstructed, do not override them
                            `*/}
        ]
      },

    ]
  }
}
function removeExportDefaultCalendar(code) {
  const exportDefaultPattern = /export\s+default\s+\w+\s*;/

  const updatedCode = code.replace(exportDefaultPattern, '');

  return updatedCode.trim();
}

async function generateReactComponent(currentCode, data, apiKey) {
  // Create OpenAI instance with provided API key
  const openaiClient = new OpenAI({
    apiKey: apiKey,
  });

  try {
    if(data.structureText != ""){
       data.structureText = await evaluateAndFormatUserTextSpecification(data.structureText, apiKey)
    }
    if(data.styleText != ""){
      data.styleText = await evaluateAndFormatUserTextSpecification(data.styleText, apiKey)
    }
    if(data.goalText != ""){
      data.goalText = await evaluateAndFormatUserTextSpecification(data.goalText, apiKey)
    }
   const response = await openaiClient.chat.completions.create({
        messages: getMessages(currentCode,data),
        model: 'gpt-4o',
        max_tokens: 2100,
        temperature: 0.8
    });

    const code = removeTripleBackticks(response.choices[0].message.content);
    const codeWithoutExport = removeExportDefaultCalendar(code)

    return codeWithoutExport;
  } catch (error) {
    throw new Error(`Error generating code: ${error.message}`);
  }
}

function saveCodeToFile(filename, code) {
  fs.writeFileSync(`./temp/${filename}.jsx`, code, (err) => {
    if (err) {
      console.error(`Error saving file: ${err}`);
    } else {
      console.log(`Code saved to ${filename}`);
    }
  });
}

async function creatorTool(currentCode, data, apiKey) {
    const newUUID = uuidv4();
    try {
        const code = await generateReactComponent(currentCode, data, apiKey);
        saveCodeToFile(newUUID, code);
        return newUUID
    } catch (error) {
        console.error(error.message);
        return error
    }
}

module.exports = {
    creatorTool,
};
