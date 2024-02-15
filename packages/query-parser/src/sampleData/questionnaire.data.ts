export const questionnaireData = JSON.stringify(
{
        name: "Text Questionnaire",
        description: "This Questionnaire is used for basic Web2 activity",
        image: "www.google.com/fake-image.png",
        questions: {
            q1: {
                questionType: "text",
                question: "What is your name?"
            },
            q2: {
                questionType: "multipleChoice",
                question: "What is your political party affiliation?",
                options: ["Democrat", "Republican", "Independent", "Other"]
            }
        },
}
);
