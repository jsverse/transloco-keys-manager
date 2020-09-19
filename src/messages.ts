import * as locale from 'os-locale';

const _messages = {
  en: {
    keepFlat: 'Keep certain keys flat?',
    keysFound: (keysCount, filesCount) =>
      `${keysCount} keys were found in ${filesCount} ${filesCount > 1 ? 'files' : 'file'}.`,
    startBuild: langsCount => `Starting Translation ${langsCount > 1 ? 'Files' : 'File'} Build`,
    startSearch: 'Staring Search For Missing Keys',
    extract: 'Extracting Template and Component Keys',
    creatingFiles: 'Created the following translation files:',
    merged: len => `Existing translation file${len > 1 ? 's were' : ' was'} found and merged`,
    checkMissing: 'Checking for missing keys',
    pathDoesntExists: `path provided doesn't exists!`,
    pathIsNotDir: `requires a directory.`,
    summary: 'Summary',
    noMissing: 'No missing keys were found',
    defaultValue: 'Enter default key value',
    addMissing: 'Add missing keys automatically?',
    missingValue: 'Missing value for',
    done: 'Done!',
    problematicKeysForUnflat: (keys: string[]) =>
      `The following keys won't be accessible when unflatting the object:\n ${keys.map(k => `"${k}"`).join(', ')}`
  },
  ru: {
    keysFound: (keysCount, filesCount) =>
      `- В ${filesCount} ${filesCount > 1 ? 'файлах' : 'файле'} найдено ${keysCount} ключей.`,
    startBuild: langsCount => `Начало сборки ${langsCount > 1 ? 'файлов' : 'файла'} перевода`,
    startSearch: 'Staring Search For Missing Keys',
    extract: 'Extracting Template and Component Keys',
    creatingFiles: 'Создание новых файлов перевода',
    merged: files => `Existing translation file${files.length > 1 ? 's were' : ' was'} found and merged 🧙`,
    checkMissing: 'Checking for missing keys',
    summary: 'Summary',
    noMissing: 'No missing keys were found',
    done: 'Готово!',
    problematicKeysForUnflat: (keys: string[]) =>
      `The following keys won't be accessible when unflatting the object:\n ${keys.map(k => `"${k}"`).join(', ')}`
  },
  fr: {
    keysFound: (keysCount, filesCount) =>
      `- ${keysCount} clés ${filesCount} ${filesCount > 1 ? 'fichiers' : 'fichier'}.`,
    startBuild: langsCount => `Initialisation de la traduction des ${langsCount > 1 ? 'fichiers' : 'fichier'}`,
    startSearch: 'Staring Search For Missing Keys',
    extract: 'Extracting Template and Component Keys',
    creatingFiles: 'Création des nouveaux fichiers de traduction',
    merged: files => `Existing translation file${files.length > 1 ? 's were' : ' was'} found and merged 🧙`,
    checkMissing: 'Checking for missing keys',
    summary: 'Summary',
    noMissing: 'No missing keys were found',
    done: 'Fini!',
    problematicKeysForUnflat: (keys: string[]) =>
      `The following keys won't be accessible when unflatting the object:\n ${keys.map(k => `"${k}"`).join(', ')}`
  },
  es: {
    keysFound: (keysCount, filesCount) =>
      `- ${keysCount} llaves fueron encontradas en ${filesCount} ${filesCount > 1 ? 'archivos' : 'archivo'}.`,
    startBuild: langsCount => `Iniciando la construcción del ${langsCount > 1 ? 'archivos' : 'archivo'} de traducción`,
    startSearch: 'Staring Search For Missing Keys',
    extract: 'Extracting Template and Component Keys',
    creatingFiles: 'Creando nuevos archivos de traducción',
    merged: files => `Existing translation file${files.length > 1 ? 's were' : ' was'} found and merged 🧙`,
    checkMissing: 'Checking for missing keys',
    summary: 'Summary',
    noMissing: 'No missing keys were found',
    done: '¡Completo!',
    problematicKeysForUnflat: (keys: string[]) =>
      `The following keys won't be accessible when unflatting the object:\n ${keys.map(k => `"${k}"`).join(', ')}`
  }
};

export const messages = getMessages();

export function getMessages() {
  const [localLang] = locale.sync().split('-');
  return _messages[localLang] || _messages.en;
}
