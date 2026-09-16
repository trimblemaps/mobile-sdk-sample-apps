import {
  getAvoidFavorSets,
  type AvoidFavorsOptions,
  type AvoidFavorsResult,
} from "@trimblemaps/services-react-native";

const EMPTY_AVOID_FAVORS_RESULT: AvoidFavorsResult = {
  totalAFSetCount: 0,
  afSets: [],
};

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return "";
}

function isEmptyAvoidFavorsResponse(error: unknown): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  if (!message) {
    return false;
  }

  return (
    message.includes("http 204") ||
    message.includes("empty avoid/favor") ||
    message.includes("correct format") ||
    message.includes("no content") ||
    message.includes("unexpectedly found 0 bytes") ||
    message.includes("zero bytes") ||
    message.includes("couldn't be read")
  );
}

/**
 * List avoid/favor sets for the initialized account.
 * Treats HTTP 204 / empty-body responses as "no sets configured".
 */
export async function fetchAvoidFavorSets(
  options: Pick<AvoidFavorsOptions, "pageSize" | "pageNumber">,
): Promise<AvoidFavorsResult> {
  try {
    return await getAvoidFavorSets(options);
  } catch (error) {
    if (isEmptyAvoidFavorsResponse(error)) {
      return EMPTY_AVOID_FAVORS_RESULT;
    }
    throw error;
  }
}
