import ReactLocalization from 'react-localization';

import en from './en';
import { L10n } from './types';

const l10n = new ReactLocalization<L10n>({ en });

export default l10n;
