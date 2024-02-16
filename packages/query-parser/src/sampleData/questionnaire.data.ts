export const questionnaireData = JSON.stringify(
{
        title: "Text Questionnaire",
        description: "This Questionnaire is used for basic Web2 activity",
        image: "www.google.com/fake-image.png",
        questions: [
            {
                questionType: "text",
                question: "What is your name?"
            },
            {
                questionType: "multipleChoice",
                question: "What is your political party affiliation?",
                options: ["Democrat", "Republican", "Independent", "Other"]
            }
        ]
    });
