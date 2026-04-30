const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_PARSE_MODEL = process.env.OPENAI_PARSE_MODEL || 'gpt-5.4-mini';

const listeningSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        sections: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    title: { type: 'string' },
                    instructions: { type: 'string' },
                    type: {
                        type: 'string',
                        enum: ['form', 'table', 'mcq', 'image'],
                    },
                    content: { type: 'string' },
                    questions: {
                        type: 'array',
                        minItems: 1,
                        items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                id: { type: 'integer' },
                                type: { type: 'string', enum: ['input'] },
                                answer: { type: 'string' },
                            },
                            required: ['id', 'type', 'answer'],
                        },
                    },
                },
                required: ['title', 'instructions', 'type', 'content', 'questions'],
            },
        },
    },
    required: ['sections'],
};

const parsingPrompt = [
    'You convert IELTS listening worksheets into structured JSON.',
    'Return only the structured result that matches the provided schema.',
    'Detect natural IELTS sections, instructions, visible prompt content, and numbered questions.',
    "Use section type 'table' for grids or tabular prompts, 'mcq' for multiple-choice prompts, 'image' only when the source clearly depends on an image layout, otherwise use 'form'.",
    'Keep wording close to the source text, but clean OCR noise when obvious.',
    "For every question, set type to 'input'.",
    'If the correct answer is not visible in the uploaded source, leave answer as an empty string.',
    'Do not add commentary, markdown, or explanation.',
].join(' ');

function normalizeSections(parsed) {
    const sections = Array.isArray(parsed?.sections) ? parsed.sections : [];

    return sections.map((section, sectionIndex) => ({
        title: String(section?.title || `Part ${sectionIndex + 1}`).trim(),
        instructions: String(
            section?.instructions || 'Write ONE WORD AND/OR A NUMBER for each answer.'
        ).trim(),
        type: ['form', 'table', 'mcq', 'image'].includes(section?.type) ? section.type : 'form',
        content: String(section?.content || '').trim(),
        questions: Array.isArray(section?.questions)
            ? section.questions.map((question, questionIndex) => ({
                  id: Number(question?.id) || questionIndex + 1,
                  type: 'input',
                  answer: String(question?.answer || '').trim(),
              }))
            : [],
    }));
}

export async function parseTest(req, res) {
    const rawText = req.body?.text?.trim();

    if (!rawText) {
        return res.status(400).json({ message: 'Extracted text is required.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
            message: 'OPENAI_API_KEY is missing on the server.',
        });
    }

    try {
        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: DEFAULT_PARSE_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: parsingPrompt,
                    },
                    {
                        role: 'user',
                        content: `Convert the following IELTS listening source into structured JSON.\n\nSOURCE TEXT:\n${rawText}`,
                    },
                ],
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'ielts_listening_structure',
                        strict: true,
                        schema: listeningSchema,
                    },
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data?.error?.message || 'OpenAI parsing request failed.',
            });
        }

        const refusal = data?.choices?.[0]?.message?.refusal;
        if (refusal) {
            return res.status(422).json({
                message: 'The parser refused to structure this document.',
            });
        }

        const content = data?.choices?.[0]?.message?.content;
        const parsed = typeof content === 'string' ? JSON.parse(content) : null;
        const normalized = normalizeSections(parsed).filter((section) => section.questions.length);

        if (!normalized.length) {
            return res.status(422).json({
                message: 'No structured IELTS sections were detected.',
            });
        }

        return res.status(200).json({
            message: 'Listening test parsed successfully!',
            data: {
                sections: normalized,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to parse listening test.',
        });
    }
}
