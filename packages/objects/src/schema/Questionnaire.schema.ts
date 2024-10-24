export const QuestionnaireSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Asset Metadata",
  type: "object",
  version: "1.0",
  properties: {
    title: {
      type: "string",
      description: "The name of the questionnaire for display purposes",
    },
    description: {
      type: "string",
      description:
        "Description of the purpose of the questionnaire, also used for display purposes",
    },
    image: {
      type: "string",
      description:
        "A URI pointing to a resource with mime type image/* representing the asset to be displayed with this questionnaire for display purposes. Optional.",
    },
    questions: {
      type: "array",
      description: "The individual questions for the questionnaire.",
      items: {
        type: "object",
        properties: {
          questionType: {
            type: "string",
            enum: ["MultipleChoice", "Location", "Text", "Numeric"],
          },
          displayType: {
            type: "string",
            enum: ["Dropdown", "List", "Scale"],
          },
          multiSelect: {
            type: "boolean",
            default: false,
            description:
              "Whether the question allows multiple answers to be selected",
          },
          isRequired: {
            type: "boolean",
            default: false,
            description: "Whether the question is required to be answered",
          },
          lowerLabel: {
            type: "string",
            description: "The label for the lower end of the linear scale",
          },
          upperLabel: {
            type: "string",
            description: "The label for the upper end of the linear scale",
          },
          minimum: {
            type: "number",
            description:
              "Minimum value for numeric questions, or minimum number of answers for multiple choice questions, or minimum length for text questions",
          },
          maximum: {
            type: "number",
            description:
              "Maximum value for numeric questions, or maximum number of answers for multiple choice questions, or maximum length for text questions",
          },
          question: {
            type: "string",
            description: "The actual text of the question",
          },
          options: {
            type: "array",
            description:
              "The options for the multiple choice question. The order they occur is their index for selection",
            items: {
              oneOf: [{ type: "string" }, { type: "number" }],
            },
          },
        },
        required: ["questionType", "question"],
        allOf: [
          {
            if: {
              properties: {
                questionType: { const: "MultipleChoice" },
              },
            },
            then: {
              if: {
                required: ["displayType"],
                properties: {
                  displayType: { const: "Scale" },
                },
              },
              then: {
                dependencies: {
                  lowerLabel: ["upperLabel"],
                  upperLabel: ["lowerLabel"],
                },
                properties: {
                  multiSelect: { const: false },
                  maximum: { not: {} },
                  minimum: { not: {} },
                },
              },
              else: {
                properties: {
                  lowerLabel: { not: {} },
                  upperLabel: { not: {} },
                },
              },

              required: ["options"],
              properties: {
                options: {
                  minItems: 1,
                },
              },
            },
            else: {
              if: {
                not: {
                  properties: {
                    questionType: { const: "Location" },
                  },
                },
              },
              then: {
                properties: {
                  multiSelect: { not: {} },
                },
              },
              properties: {
                options: { not: {} },
                displayType: { not: {} },
                upperLabel: { not: {} },
                lowerLabel: { not: {} },
              },
            },
          },
          {
            if: {
              anyOf: [
                {
                  properties: {
                    questionType: { const: "MultipleChoice" },
                  },
                },
                {
                  properties: {
                    questionType: { const: "Location" },
                  },
                },
              ],
            },
            then: {
              if: {
                anyOf: [
                  {
                    properties: {
                      multiSelect: { const: false },
                    },
                    required: ["multiSelect"],
                  },
                  {
                    not: {
                      required: ["multiSelect"],
                    },
                  },
                ],
              },
              then: {
                properties: {
                  maximum: { not: {} },
                  minimum: { not: {} },
                },
              },
            },
          },
        ],
      },
    },
  },
  required: ["title", "questions"],
};
