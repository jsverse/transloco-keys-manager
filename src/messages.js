const messages = {
  en: {
    src: 'Please specify the root source of your project.',
    output: 'Please specify the output folder for the translation files.',
    config: 'Please specify the path to Transloco config.',
    langs: 'To which languages you want to create files for?',
    keepFlat: 'Keep certain keys flat?',
    hasScope: 'Do you have scopes defined?',
    keysFound: (keysCount, filesCount) =>
      `- ${keysCount} keys were found in ${filesCount} ${filesCount > 1 ? 'files' : 'file'}.`,
    startBuild: langsCount => `Starting Translation ${langsCount > 1 ? 'Files' : 'File'} Build`,
    startSearch: 'Staring Search For Missing Keys',
    extract: 'Extracting Template and Component Keys',
    creatingFiles: 'Creating new translation files',
    merged: files => `Existing translation file${files.length > 1 ? 's were' : ' was'} found and merged 🧙`,
    checkMissing: 'Checking for missing keys',
    pathDoesntExists: `The path provided for the translation files doesn't exists!`,
    noTranslationFilesFound: path => `No translation files found in the given path! \n ${path}`,
    summary: 'Summary',
    noMissing: 'No missing keys were found',
    defaultValue: 'Enter default key value',
    addMissing: 'Add missing keys automatically?',
    missingValue: 'Missing value for',
    done: 'Done!'
  },
  ru: {
    src: 'Please specify the root source of your project.',
    output: 'Please specify the output folder for the translation files.',
    langs: 'Для каких языков вы хотите создать файлы',
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
    done: 'Готово!'
  },
  fr: {
    src: 'Please specify the root source of your project.',
    output: 'Please specify the output folder for the translation files.',
    langs: 'Pour quelles languages souhaitez vous créer des fichiers de traduction?',
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
    done: 'Fini!'
  },
  es: {
    src: 'Please specify the root source of your project.',
    output: 'Please specify the output folder for the translation files.',
    langs: '¿Para qué idiomas desea crear archivos?',
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
    done: '¡Completo!'
  },
  ja: {},
  zh: {}
};

module.exports = {
  getMessages(locale) {
    return messages[locale] || messages.en;
  }
};
