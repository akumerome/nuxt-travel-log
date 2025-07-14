import { resolveNuxtModule } from "nuxt/kit";
import { SafeParseError } from "zod";

// export function formatBodyValidationErrors(result: SafeParseError<unknown>) {
//     const statusMessage = result
//         .error
//         .issues
//         .map(issue => `${issue.path.join("")}: ${issue.message}`)
//         .join("; ");

//     return statusMessage;
// }

export function formatBodyValidationErrors(result: SafeParseError<unknown>): { name: string; message: string }[] {
    return result.error.issues.map(issue => ({
        name: issue.path.join(""),
        message: issue.message,
    }));
}

