export const questionGoogleQuery = `
    query getCompanyTag($slug: String!) {
        companyTag(slug: $slug) {
            name
            questions {
                ...questionFields
                __typename
            }
            frequencies
             __typename
        }
        favoritesLists {
                publicFavorites {
                ...favoriteFields
                __typename
            }
            privateFavorites {
                ...favoriteFields
                __typename
            }
            __typename
        }
    }
    fragment favoriteFields on FavoriteNode {
        idHash
        id
        name
        isPublicFavorite
        viewCount
        creator
        isWatched
        questions {
            questionId
            title
            titleSlug
            __typename
        }
        __typename
    }
    fragment questionFields on QuestionNode {
        status
        questionId
        questionFrontendId
        title
        titleSlug
        translatedTitle
        stats
        difficulty
        isPaidOnly
        topicTags {
            name
            translatedName
            slug
            __typename
        }
        __typename
    }`;
