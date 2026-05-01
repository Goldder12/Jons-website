import fs from 'fs';
import path from 'path';
import { listeningTasks } from '../data/db.js';

const removableUploadPrefixes = [
    'uploads/audio/',
    'uploads/listening-video/',
    'uploads/listening-content/',
];
const validLevels = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

function removeUploadedAsset(filePath) {
    if (!filePath || !removableUploadPrefixes.some((prefix) => filePath.startsWith(prefix))) {
        return;
    }

    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
    }
}

function cleanupFiles(files = []) {
    files.forEach(removeUploadedAsset);
}

function normalizeQuestion(question, index) {
    const answer = typeof question === 'string' ? question.trim() : question?.answer?.trim();
    if (!answer) {
        return null;
    }

    return {
        id: Number(question?.id) || index + 1,
        answer,
    };
}

function parseSections(rawSections, contentImagePath = '') {
    const parsedSections = JSON.parse(rawSections || '[]');
    if (!Array.isArray(parsedSections)) {
        return null;
    }

    return parsedSections
        .map((section) => {
            const type = section?.type?.trim();
            const questions = Array.isArray(section?.questions)
                ? section.questions.map(normalizeQuestion).filter(Boolean)
                : [];

            const normalizedContent =
                type === 'image'
                    ? contentImagePath || section?.content?.trim() || ''
                    : section?.content?.trim() || '';

            return {
                title: section?.title?.trim() || '',
                instructions: section?.instructions?.trim() || '',
                type,
                content: normalizedContent,
                questions,
            };
        })
        .filter((section) => section.title || section.instructions || section.questions.length);
}

function isValidSection(section) {
    const validTypes = new Set(['form', 'table', 'mcq', 'image']);
    if (!section?.title || !section?.instructions || !validTypes.has(section.type)) {
        return false;
    }

    if (!Array.isArray(section.questions) || !section.questions.length) {
        return false;
    }

    if (section.type === 'image' && !section.content) {
        return false;
    }

    if (section.type !== 'image' && !section.content) {
        return false;
    }

    return section.questions.every((question) => question?.answer);
}

function normalizeAnswers(rawAnswers) {
    const parsedAnswers = JSON.parse(rawAnswers || '[]');
    if (!Array.isArray(parsedAnswers)) {
        return null;
    }

    return parsedAnswers
        .map((answer, index) => {
            const normalizedAnswer = typeof answer === 'string' ? answer.trim() : answer?.answer?.trim();
            if (!normalizedAnswer) {
                return null;
            }

            return {
                id: Number(answer?.id) || index + 1,
                answer: normalizedAnswer,
            };
        })
        .filter(Boolean);
}

function getVideoValue(videoType, videoFile, videoLink) {
    if (videoType === 'upload' && videoFile) {
        return `uploads/listening-video/${videoFile.filename}`;
    }

    if (videoType === 'link' && videoLink) {
        return videoLink;
    }

    return '';
}

export function getListeningTasks(req, res) {
    return res.status(200).json({
        message: 'Listening tasks fetched successfully!',
        data: listeningTasks,
    });
}

export function createListeningTask(req, res) {
    const title = req.body.title?.trim();
    const level = req.body.level?.trim();
    const audioFile = req.files?.audio?.[0];
    const videoFile = req.files?.videoFile?.[0];
    const contentImage = req.files?.contentImage?.[0];
    const contentHtml = req.body.content?.trim() || '';
    const videoType = req.body.videoType?.trim() || 'none';
    const videoLink = req.body.videoLink?.trim() || '';
    const uploadedFiles = [
        audioFile ? `uploads/audio/${audioFile.filename}` : '',
        videoFile ? `uploads/listening-video/${videoFile.filename}` : '',
        contentImage ? `uploads/listening-content/${contentImage.filename}` : '',
    ].filter(Boolean);

    if (!audioFile) {
        cleanupFiles(uploadedFiles);
        return res.status(400).json({ message: 'Audio is required for listening task.' });
    }

    let sections;
    let answers = [];
    try {
        sections = parseSections(
            req.body.sections,
            contentImage ? `uploads/listening-content/${contentImage.filename}` : ''
        );
        answers = normalizeAnswers(req.body.answers) || [];
    } catch (error) {
        cleanupFiles(uploadedFiles);
        return res.status(400).json({ message: 'Listening content must be valid JSON.' });
    }

    const hasValidVideoType = ['none', 'upload', 'link'].includes(videoType);
    const hasValidVideoSource =
        videoType === 'none' ||
        (videoType === 'upload' && Boolean(videoFile)) ||
        (videoType === 'link' && Boolean(videoLink));

    const normalizedSections =
        Array.isArray(sections) && sections.length
            ? sections
            : contentHtml && answers.length
              ? [
                    {
                        title: 'Listening Task',
                        instructions: 'Answer every blank while listening.',
                        type: 'form',
                        content: contentHtml,
                        questions: answers,
                    },
                ]
              : null;

    if (
        !title ||
        !validLevels.has(level) ||
        !Array.isArray(normalizedSections) ||
        !normalizedSections.length ||
        !normalizedSections.every(isValidSection) ||
        !hasValidVideoType ||
        !hasValidVideoSource
    ) {
        cleanupFiles(uploadedFiles);
        return res.status(400).json({
            message:
                'Title, level, required audio, a valid section, and any selected optional video source are required.',
        });
    }

    const newListeningTask = {
        id: listeningTasks.length
            ? Math.max(...listeningTasks.map((task) => Number(task.id) || 0)) + 1
            : 1,
        title,
        level,
        audio: `uploads/audio/${audioFile.filename}`,
        video: getVideoValue(videoType, videoFile, videoLink),
        content: contentHtml || normalizedSections[0]?.content || '',
        answers: answers.length ? answers : normalizedSections[0]?.questions || [],
        sections: normalizedSections,
    };

    listeningTasks.push(newListeningTask);

    return res.status(201).json({
        message: 'Listening task created successfully!',
        data: newListeningTask,
    });
}

export function deleteListeningTask(req, res) {
    const id = Number(req.params.id);
    const taskIndex = listeningTasks.findIndex((task) => Number(task.id) === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Listening task not found!' });
    }

    const [task] = listeningTasks.splice(taskIndex, 1);
    removeUploadedAsset(task.audio);
    removeUploadedAsset(task.video);
    task.sections.forEach((section) => {
        if (section.type === 'image') {
            removeUploadedAsset(section.content);
        }
    });

    return res.status(200).json({ message: 'Listening task deleted successfully!' });
}
