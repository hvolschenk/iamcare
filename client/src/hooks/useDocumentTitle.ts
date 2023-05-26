import l10n from '~/src/l10n';

const useDocumentTitle = (parts: string[]): void => {
  document.title = [...parts, l10n.applicationName].join(' | ');
};

export default useDocumentTitle;
