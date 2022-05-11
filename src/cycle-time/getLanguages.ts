import { PullRequest } from '../generated/types';
import {
  LanguageMetadata,
  LanguageType,
  PullRequestLanguageMetrics,
} from '../types';

function getLanguageType(filepath: string): LanguageType {
  if (
    filepath.endsWith('png') ||
    filepath.endsWith('jpg') ||
    filepath.endsWith('jpeg')
  ) {
    return LanguageType.Image;
  } else if (filepath.endsWith('java')) {
    return LanguageType.Java;
  } else if (filepath.endsWith('js') || filepath.endsWith('jsx')) {
    return LanguageType.Javascript;
  } else if (filepath.endsWith('md')) {
    return LanguageType.Markdown;
  } else if (filepath.endsWith('ts') || filepath.endsWith('tsx')) {
    return LanguageType.Typescript;
  }

  return LanguageType.Unknown;
}

export default function getLanguages(
  pullRequest: PullRequest
): PullRequestLanguageMetrics | null {
  const languageMetadata: { [key: string]: LanguageMetadata } = {};

  pullRequest.files.nodes.forEach((file) => {
    const fileLanguage = getLanguageType(file.path);
    if (fileLanguage in languageMetadata) {
      languageMetadata[fileLanguage].additions += file.additions;
      languageMetadata[fileLanguage].deletions += file.deletions;
    } else {
      languageMetadata[fileLanguage] = {
        languageType: fileLanguage,
        additions: file.additions,
        deletions: file.deletions,
      };
    }
  });

  const languages: LanguageMetadata[] = [];
  let primaryLanguage: LanguageType = LanguageType.Unknown;
  let primaryLanguageLinesChanged = 0;
  for (const [key, value] of Object.entries(languageMetadata)) {
    languages.push(value);
    if (value.additions + value.deletions > primaryLanguageLinesChanged) {
      primaryLanguage = value.languageType;
      primaryLanguageLinesChanged = value.additions + value.deletions;
    }
  }

  return {
    primaryLanguageType: primaryLanguage,
    languages: languages,
  };
}
