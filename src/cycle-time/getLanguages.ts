import { PullRequest } from '../generated/types';
import {
  LanguageMetadata,
  LanguageType,
  PullRequestLanguageMetrics,
} from '../types';
import { extensionMap } from '../extensionMap';

function getLanguageType(filepath: string): LanguageType {
  filepath = filepath.toLowerCase();

  for (const [key, value] of Object.entries(extensionMap)) {
    if (filepath.match(key)) {
      return value;
    }
  }

  return LanguageType.Unknown;
}

function getWeightedSize(languageMetadata: LanguageMetadata): number {
  if (
    languageMetadata.languageType === LanguageType.Yarn ||
    languageMetadata.languageType === LanguageType.Patch
  ) {
    return 1;
  }

  return languageMetadata.additions + languageMetadata.deletions;
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
  for (const [, value] of Object.entries(languageMetadata)) {
    languages.push(value);
    const currentWeightedSize: number = getWeightedSize(value);
    if (currentWeightedSize > primaryLanguageLinesChanged) {
      primaryLanguage = value.languageType;
      primaryLanguageLinesChanged = currentWeightedSize;
    }
  }

  return {
    primaryLanguageType: primaryLanguage,
    languages: languages,
  };
}
