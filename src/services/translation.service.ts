
export class TranslationService {
    public constructTranslations (dutchText: string, englishText: string) {
        return [
            {
                language_code: 'nl',
                text: dutchText,
            },
            {
                language_code: 'en',
                text: englishText,
            }
        ];
    }
}