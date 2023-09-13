const express = require('express');
const fs = require('fs')
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

const surveyResponses = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname)); // Serve static files from the current directory

app.get('/survey', (req, res) => {
  

  // Read the survey responses from the JSON file
  fs.readFile('survey_responses.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Parse the JSON data to an array
    surveyResponses = JSON.parse(data);

    // Send the survey responses as the API response
    // res.json(surveyResponses);
  });

  res.render('survey');
});

app.post('/submit', (req, res) => {
    const candidateName = req.body.candidateName;

    const numQuestions = 20; // Number of questions
    const responses = [];
  
    // Loop through the questions and extract the selected options
    for (let i = 1; i <= numQuestions; i++) {
      const question = `q${i}`;
      const selectedOption = req.body[question];
  
      if (selectedOption !== undefined) {
        // Only include questions that the user has answered (not left blank)
        responses.push({
          question: `Question ${i}`,
          option: `Option ${selectedOption}`,
        });
      }
    }
  
    // Store the candidate name and responses in the surveyResponses array
    surveyResponses.push({
        candidateName: candidateName,
        responses: responses,
    });
  
    // Append the responses to a file
    const responseData = JSON.stringify(surveyResponses, null, 2); // Convert responses to JSON format
    fs.appendFile('survey_responses.json', responseData, (err) => {
        if (err) {
        console.error('Error appending responses to file:', err);
        // Handle the error here
        } else {
        console.log('Responses appended to file successfully.');
        // Redirect to a thank-you page or display a confirmation message
        res.send('Thank you for submitting the survey!');
        }
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});