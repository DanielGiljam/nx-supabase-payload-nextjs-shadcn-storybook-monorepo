import type {BeforeSync, DocToSync} from "@payloadcms/plugin-search/types";

export const beforeSyncWithSearch: BeforeSync = async ({
    originalDoc,
    searchDoc,
    // eslint-disable-next-line @typescript-eslint/require-await -- [bulk suppress]
}) => {
    const {
        doc: {relationTo: collection},
    } = searchDoc;

    const {slug, id, categories, title, meta} = originalDoc;

    const modifiedDocument: DocToSync = {
        ...searchDoc,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- [bulk suppress]
        slug,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- [bulk suppress]
        meta: {
            ...meta,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access -- [bulk suppress]
            title: meta?.title || title,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access -- [bulk suppress]
            image: meta?.image?.id || meta?.image,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- [bulk suppress]
            description: meta?.description,
        },
        categories: [],
    };

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    if (categories && Array.isArray(categories) && categories.length > 0) {
        // get full categories and keep a flattened copy of their most important properties
        try {
            const mappedCategories = categories.map((category) => {
                // @ts-expect-error TODO
                const {id, title} = category;

                return {
                    relationTo: "categories",
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- [bulk suppress]
                    id,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- [bulk suppress]
                    title,
                };
            });

            modifiedDocument["categories"] = mappedCategories;
        } catch {
            console.error(
                `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
            );
        }
    }

    return modifiedDocument;
};
