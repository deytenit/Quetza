import { DlpDump, dlpExtractorKey, DlpInfo } from "../types";

export const dlpExtractorsValues = ["Youtube", "Soundcloud"] as const;

/**
 * Defines structure for an extractor that will be called by dlpInfo.
 *
 * For example:
 *
 * @see {@link youtubeExtractor | the youtubeExtractor(...) function }
 */
type dlpExtractor = (arg0: DlpDump, arg1: (arg0: string) => Promise<DlpInfo>) => Promise<DlpInfo>;

export function isDlpExtractorKey(that: string): that is dlpExtractorKey {
    return dlpExtractorsValues.includes(that as dlpExtractorKey);
}

/**
 * Resolves data that was extracted by dlp (depending on extractor_key).
 *
 * @returns DlpInfo generated from dump provided
 *
 * @param dump - Parsed dlp output
 * @param dlpInfo - Function to call if any other information needed
 * (will recurcively call next extractor after its run)
 */
const youtubeExtractor: dlpExtractor = async (dump, dlpInfo) => {
    if (dump.id && dump.title && dump.duration) {
        const result = {
            url: `https://www.youtube.com/watch?v=${dump.id}`,
            title: dump.title,
            thumbnail: `https://img.youtube.com/vi/${dump.id}/default.jpg`,
            duration: dump.duration
        };

        return [[result], []];
    }

    return await dlpInfo(dump.original_url);
};

/**
 * {@inheritdoc youtubeExtractor}
 */
const soundcloudExtractor: dlpExtractor = async (dump, dlpInfo) => {
    if (dump.title && dump.duration && dump.thumbnail) {
        const result = {
            url: dump.webpage_url ?? dump.original_url,
            title: dump.title,
            thumbnail: dump.thumbnail,
            duration: dump.duration
        };

        return [[result], []];
    }

    return await dlpInfo(dump.original_url);
};

const extractors: Record<dlpExtractorKey, dlpExtractor> = {
    Youtube: youtubeExtractor,
    Soundcloud: soundcloudExtractor
};

export default extractors;
