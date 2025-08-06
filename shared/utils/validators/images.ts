import { z } from "zod";
import { MAX_IMAGE_SIZE } from "~/lib/constants";

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
};

export const schema = z.object({
    image: z
        .instanceof(File, {
            message: 'Please select an image file.'
        })
        .refine((file) => file.size <= MAX_IMAGE_SIZE, {
            message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_IMAGE_SIZE)}.`
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: 'Please upload a valid image file (JPEG, PNG, or WebP).'
        })
});

export type Schema = z.output<typeof schema>;