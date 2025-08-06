<script lang="ts" setup>
import { schema } from "~/shared/utils/validators/images";
import type { Schema } from "~/shared/utils/validators/images";
import type { FormSubmitEvent } from "@nuxt/ui";
import { FetchError } from "ofetch";

const route = useRoute();
const locationsStore = useLocationsStore();
const { currentLocationLog: data, currentLocationLogStatus: status } = storeToRefs(locationsStore);
const { $csrfFetch } = useNuxtApp();
const error = ref<string | null>(null);

const state = reactive<Partial<Schema>>({
    image: undefined
});

/**
 * Asynchronously resizes an HTMLImageElement to a maximum width of 1000 pixels.
 *
 * If the image's width exceeds 1000 pixels, it will be resized down to 1000.
 * Otherwise, it retains its original width. The function returns a `ImageBitmap`
 * representing the resized image.
 *
 * @param {HTMLImageElement} image - The source image to resize.
 * @returns {Promise<ImageBitmap>} A promise that resolves to the resized ImageBitmap.
 */
async function resizeImage(image: HTMLImageElement): Promise<ImageBitmap> {
    const width = Math.min(1000, image.width);

    const resized = await createImageBitmap(image, {
        resizeWidth: width
    });

    return resized;
}

/**
 * Optimizes an ImageBitmap by converting it into a compressed JPEG Blob.
 *
 * This function draws the given ImageBitmap onto an OffscreenCanvas and
 * converts it to a JPEG Blob with 90% quality. It's useful for reducing
 * image size for upload or storage while preserving decent visual fidelity.
 *
 * @param {ImageBitmap} image - The source ImageBitmap to optimize.
 * @returns {Promise<Blob>} A promise that resolves to a JPEG Blob of the optimized image.
 */
async function optimizeImage(image: ImageBitmap): Promise<Blob> {
    // use canvas to optimize image quality and convert it to jpeg
    const canvas = new OffscreenCanvas(image.width, image.height);
    canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(image);
    const blob = await canvas.convertToBlob({
        type: "image/jpeg",
        quality: 0.9,
    });
    return blob;
}

/**
 * Generates a base64-encoded SHA-256 checksum of a given Blob.
 *
 * This function reads the Blob's contents into an ArrayBuffer,
 * computes its SHA-256 hash using the SubtleCrypto API,
 * and returns the result as a base64-encoded string.
 *
 * @param {Blob} blob - The input Blob to compute the checksum for.
 * @returns {Promise<string>} A promise that resolves to the base64-encoded SHA-256 checksum.
 */
async function getChecksum(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

/**
 * Sends a request to obtain a presigned URL for uploading an image.
 *
 * This function posts the image metadata — including its size and a SHA-256 checksum —
 * to a backend endpoint, which responds with a presigned URL for direct upload (e.g., to S3).
 *
 * @param {Blob} blob - The image Blob to be uploaded.
 * @param {string} checksum - The base64-encoded SHA-256 checksum of the Blob.
 * @returns {Promise<Response>} A promise that resolves to the server's response, 
 * typically containing the presigned URL and associated metadata.
 */
async function postPresignedUrl(blob: Blob, checksum: string) {
    const response = await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/sign-image`, {
        method: "POST",
        body: {
            content_length: blob.size,
            checksum,
        }
    });
    return response;
}

/**
 * Formats form data for uploading an image to a storage bucket using a presigned URL.
 *
 * This function creates a `FormData` object, appends the provided fields (typically
 * from a presigned POST response), and includes the image `Blob` under the `"file"` key,
 * which is required by most S3-compatible services.
 *
 * @param {object} fields - Key-value pairs provided by the backend (e.g., AWS S3 POST fields).
 * @param {Blob} blob - The image Blob to upload.
 * @returns {FormData} A FormData object ready to be sent in a POST request to the presigned URL.
 */
function formatLocationLogImageToBucketRequestBody(fields: object, blob: Blob): FormData {
    const data = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
        data.append(key, value as string);
    });
    data.append("file", blob);
    return data;
}

/**
 * Uploads an image to a storage bucket using a presigned URL and form data.
 *
 * This function sends a POST request to the provided presigned `url` using
 * the given `FormData` object, which typically includes authorization fields
 * and the image file. It also sets the `x-amz-checksum-algorithm` header to
 * indicate the use of SHA-256 for integrity verification.
 *
 * @param {string} url - The presigned URL for the storage service (e.g., S3).
 * @param {FormData} data - The FormData object containing upload fields and the file.
 * @returns {Promise<Response>} A promise that resolves to the response from the storage service.
 */
async function postLocationLogImageToBucket(url: string, data: FormData) {
    const response = await $fetch(url, {
        method: "POST",
        body: data,
        headers: {
            "x-amz-checksum-algorithm": "SHA256",
        },
    });
    return response;
}

/**
 * Notifies the backend that an image has been uploaded for a location log.
 *
 * This function sends a POST request with the uploaded image's storage key
 * to associate it with a specific location log. The backend uses this key
 * (typically an S3 object key) to reference the image in future operations.
 *
 * @param {string} key - The storage key (e.g., S3 object key) of the uploaded image.
 * @returns {Promise<Response>} A promise that resolves to the backend's response.
 */
async function postLocationLogImage(key: string) {
    const response = await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/location-log-image`, {
        method: "POST",
        body: {
            key,
        },
    });
    return response;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {

    const image = new Image();
    image.onload = async function () {

        const resized = await resizeImage(image);
        const blob = await optimizeImage(resized);
        const checksum = await getChecksum(blob);

        try {
            const { fields, key, url } = await postPresignedUrl(blob, checksum);
            const data = formatLocationLogImageToBucketRequestBody(fields, blob);
            await postLocationLogImageToBucket(url, data);
            await postLocationLogImage(key);
            await locationsStore.refreshCurrentLocationLog();
            state.image = undefined;
        } catch (e) {
            const fetchError = e as FetchError;
            error.value = fetchError.statusMessage || "An error occured.";
        }
    };
    image.src = URL.createObjectURL(event.data.image);
}
</script>

<template>
<div v-if="status !== 'pending' && data?.data.location_log">
    <div class="space-y-3">
        <h1 class="text-2xl font-bold">{{ data.data.location_log.name }}</h1>
        <div>
            <UForm :schema="schema" :state="state" class="space-y-4 w-96" @submit="onSubmit">
                <UFormField name="image" label="Image" description="JPG, GIF or PNG. 2MB Max.">
                    <UFileUpload v-model="state.image" class="w-96 min-h-48" icon="i-tabler-camera"
                        label="Drop your images here" />
                </UFormField>

                <div class="mt-4 grid">
                    <UAlert v-if="error" class="mb-4" color="error" icon="i-tabler-circle-x" :title="error" />

                    <UButton class="justify-self-end" color="neutral" loading-auto type="submit">Upload image
                    </UButton>
                </div>
            </UForm>
        </div>
    </div>
</div>
</template>