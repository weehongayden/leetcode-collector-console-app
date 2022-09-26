export var mapFrequencyToObject = function (company) {
    var mapObject = [];
    var frequencies = JSON.parse(company.frequencies);
    Object.entries(frequencies).forEach(function (_a) {
        var key = _a[0], v = _a[1];
        company.questions.forEach(function (q) {
            if (key === q.questionId) {
                mapObject.push({
                    frontend_id: parseInt(q.questionFrontendId),
                    title: q.title,
                    title_translated: q.translatedTitle,
                    slug: q.titleSlug,
                    frequency: v[7],
                    stats: JSON.stringify(q.stats),
                    difficulty: q.difficulty,
                    is_paid_only: q.isPaidOnly,
                    tags: JSON.stringify(q.topicTags),
                    status: q.status,
                });
            }
        });
    });
    return mapObject;
};
