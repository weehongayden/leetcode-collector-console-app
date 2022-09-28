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

export const questionLeetCodeQuery = `
    query problemsetQuestionList(
        $categorySlug: String
        $limit: Int
        $skip: Int
        $filters: QuestionListFilterInput
    ) {
        problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            total: totalNum
            questions: data {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                title
                titleSlug
                topicTags {
                    name
                    id
                    slug
                }
                status
            }
        }
    }`;
