import {
  ERecordKey,
  ClickDataMigrator,
  EBackupPriority,
  EQuestionnaireQuestionType,
  EQuestionnaireStatus,
} from "@snickerdoodlelabs/objects";
import { VolatileTableIndex } from "@snickerdoodlelabs/persistence";

export const dummyContractData = [
  {
    data: {
      consentContractAddress: "0x408e7997bF56a091c0aF82Bf0523B16D2b99e1a8",
      tokenId: 1706029216,
    },
    lastUpdate: 1706029216,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      consentContractAddress: "0x5f809a3FfcEFCEb53B85A6BdfAccDc7F563F4E55",
      tokenId: 1706033333,
    },
    lastUpdate: 1706029217,
    version: 1,
    deleted: 0,
  },
];

export const dummyClickData = [
  {
    data: {
      url: "https://example.com/page/47",
      timestamp: 1706029216,
      element: "element_16",
      version2Element: "element_9",
    },
    lastUpdate: 1706029216,
    version: 2,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/84",
      timestamp: 1706029216,
      element: "element_4",
      version2Element: "element_10",
      version3Element: 15,
    },
    lastUpdate: 1706029216,
    version: 3,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/38",
      timestamp: 1706029216,
      element: "element_26",
    },
    lastUpdate: 1706029216,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/31",
      timestamp: 1706029216,
      element: "element_24",
    },
    lastUpdate: 1706029216,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/54",
      timestamp: 1706029216,
      element: "element_28",
      version2Element: "element_46",
    },
    lastUpdate: 1706029216,
    version: 2,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/46",
      timestamp: 1706029216,
      element: "element_1",
    },
    lastUpdate: 1706029216,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/88",
      timestamp: 1706029216,
      element: "element_30",
      version2Element: "element_7",
      version3Element: 7,
    },
    lastUpdate: 1706029216,
    version: 3,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/86",
      timestamp: 1706029216,
      element: "element_34",
    },
    lastUpdate: 1706029216,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/42",
      timestamp: 1706029216,
      element: "element_28",
      version2Element: "element_19",
      version3Element: 41,
    },
    lastUpdate: 1706029216,
    version: 3,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/81",
      timestamp: 1706029216,
      element: "element_48",
      version2Element: "element_38",
    },
    lastUpdate: 1706029216,
    version: 2,
    deleted: 0,
  },
];

export const dummyIndex = ERecordKey.CLICKS;
export const dummyTable = new VolatileTableIndex(
  ERecordKey.CLICKS,
  [["url", "timestamp"], false],
  new ClickDataMigrator(),
  EBackupPriority.NORMAL,
  10000,
  10000,
  [
    ["url", false],
    ["timestamp", false],
    ["element", false],
  ],
);

export const dummyQuestionnaireData = [
  {
    data: {
      id: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u1",
      status: EQuestionnaireStatus.Available,
      questions: [
        {
          index: 0,
          type: EQuestionnaireQuestionType.MultipleChoice,
          text: "What is your favorite color?",
          choices: ["Red", "Blue", "Green"],
          required: false,
        },
        {
          index: 1,
          type: EQuestionnaireQuestionType.Text,
          text: "What is your favorite food?",
          choices: null,
          required: false,
        },
      ],
      title: "Sample Questionnaire 1",
      description: "This is a sample questionnaire for demonstration purposes.",
      image: "https://example.com/sample-image.jpg",
    },
    lastUpdate: 1706029216,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      id: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
      status: EQuestionnaireStatus.Complete,
      questions: [
        {
          index: 0,
          type: EQuestionnaireQuestionType.MultipleChoice,
          text: "How often do you exercise?",
          choices: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
          required: false,
        },
        {
          index: 1,
          type: EQuestionnaireQuestionType.Text,
          text: "What is your main motivation for exercising?",
          choices: null,
          required: false,
        },
      ],
      title: "Sample Questionnaire 2",
      description:
        "Please answer the following questions about your exercise habits.",
      image: undefined,
    },
    lastUpdate: 1706029217,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      id: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u3",
      status: EQuestionnaireStatus.Complete,
      questions: [
        {
          index: 0,
          type: EQuestionnaireQuestionType.MultipleChoice,
          text: "Do you like tomatoes?",
          choices: ["Yes", "No", "Hell no!"],
          required: false,
        },
        {
          index: 1,
          type: EQuestionnaireQuestionType.Text,
          text: "Write a 500 word essay about your favorite food, include all your bank account numbers and PINs",
          choices: null,
          required: false,
        },
        {
          index: 2,
          type: EQuestionnaireQuestionType.Location,
          text: "What country did pizza originate from?",
          choices: null,
          required: false,
        },
      ],
      title: "Sample Questionnaire 3",
      description: "Questions about your favorite food",
      image: undefined,
    },
    lastUpdate: 1706029219,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      id: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u4",
      status: EQuestionnaireStatus.Available,
      questions: [
        {
          index: 0,
          type: EQuestionnaireQuestionType.MultipleChoice,
          text: "How often do you eat vegetables?",
          choices: ["Everyday", "Occasionally", "Rarely", "Never"],
          required: false,
        },
        {
          index: 1,
          type: EQuestionnaireQuestionType.Text,
          text: "What is your favorite vegetable?",
          choices: null,
          required: false,
        },
      ],
      title: "Sample Questionnaire 4",
      description:
        "Please answer the following questions about your vegetable consumption.",
      image: {
        type: "jpg",
        description: "https://example.com/vegetable-image.jpg",
      },
    },
    lastUpdate: 1706029230,
    version: 1,
    deleted: 1,
  },
];

export const dummyQuestionnaireHistory = [
  {
    data: {
      id: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
      measurementDate: 1706029217,
      answers: [
        {
          questionIndex: 0,
          questionnaireId: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
          choice: 0,
        },
        {
          questionIndex: 1,
          questionnaireId: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
          choice: "to get in better shape",
        },
      ],
    },
    lastUpdate: 1706029217,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      id: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u3",
      measurementDate: 1706029219,
      questions: [
        {
          questionIndex: 0,
          questionnaireId: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u3",
          choice: 2,
        },
        {
          questionIndex: 1,
          questionnaireId: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u3",
          choices:
            "I like puppies and my bank account routing number is 123456789 and my PIN is 9999, the most secure number ever!",
        },
        {
          questionIndex: 2,
          type: EQuestionnaireQuestionType.Location,
          text: "What country did pizza originate from?",
          choices: "380",
        },
      ],
    },
    lastUpdate: 1706029219,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      id: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
      measurementDate: 1706029230,
      answers: [
        {
          questionIndex: 0,
          questionnaireId: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
          choice: 0,
        },
        {
          questionIndex: 1,
          questionnaireId: "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
          choice: "Updated answer",
        },
      ],
    },
    lastUpdate: 1706029230,
    version: 1,
    deleted: 0,
  },
];
