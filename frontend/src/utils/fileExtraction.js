import * as mammoth from 'mammoth';

/**
 * Extract text from different file types
 * @param {File} file - The file to extract text from
 * @returns {Promise<string>} The extracted text
 */
export const extractText = async (file) => {
    const extension = file.name.split('.').pop().toLowerCase();

    try {
        if (extension === 'pdf') {
            return await extractPDF(file);
        } else if (extension === 'docx') {
            return await extractDOCX(file);
        } else if (extension === 'html') {
            return await extractHTML(file);
        } else {
            return await file.text();
        }
    } catch (error) {
        console.error(`Error extracting text from ${file.name}:`, error);
        throw new Error(`Failed to extract text from ${file.name}`);
    }
};

const extractPDF = async (file) => {
    // For PDF, we need to inform the user about the limitation
    return await file.text() + '\n\n⚠️ Note: PDF parsing requires server-side processing. This is raw PDF content.';
};

const extractDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

const extractHTML = async (file) => {
    const text = await file.text();
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
};
