
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Describes an outfit from an image using a text-generation model.
 * @param imageBase64 The base64 encoded image string.
 * @param mimeType The MIME type of the image.
 * @returns A string describing the outfit.
 */
export async function describeOutfit(imageBase64: string, mimeType: string): Promise<string> {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType,
        },
    };

    const textPart = {
        text: "Describe the clothing item in this image in detail. Focus on the style, color, pattern, and type of clothing. This description will be used by another AI to place it on a person.",
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
}

/**
 * Edits a person's photo to show them wearing a described outfit.
 * @param personImageBase64 The base64 encoded image of the person.
 * @param personMimeType The MIME type of the person's image.
 * @param outfitDescription The text description of the outfit.
 * @returns An object containing the base64 string of the generated image and any accompanying text.
 */
export async function tryOnOutfit(personImageBase64: string, personMimeType: string, outfitDescription: string): Promise<{ image?: string; text?: string }> {
    const imagePart = {
        inlineData: {
            data: personImageBase64,
            mimeType: personMimeType,
        },
    };

    const textPart = {
        text: `Based on the provided outfit description, realistically edit this person's photo to show them wearing it. Preserve the person's face, body shape, and the background as much as possible. Maintain the original image resolution. Outfit description: ${outfitDescription}`,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let generatedImage: string | undefined;
    let generatedText: string | undefined;

    if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
                generatedImage = part.inlineData.data;
            }
            if (part.text) {
                generatedText = part.text;
            }
        }
    }

    return { image: generatedImage, text: generatedText };
}
