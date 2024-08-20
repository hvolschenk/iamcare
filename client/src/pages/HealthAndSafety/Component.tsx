import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import React from 'react';

import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { root } from '~/src/urls';

interface BulletPoint {
  description: string;
  title: string;
}
interface HealthAndSafetySection {
  bulletPoints: BulletPoint[];
  title: string;
}

// In this instance it feels easier to read
// with the title before the bullet points.
/* eslint-disable sort-keys */
const healthAndSafetySections: HealthAndSafetySection[] = [
  {
    title: l10n.healthAndSafetyGeneral,
    bulletPoints: [
      {
        description: l10n.healthAndSafetyGeneralPublicDescription,
        title: l10n.healthAndSafetyGeneralPublicTitle,
      },
      {
        description: l10n.healthAndSafetyGeneralFriendDescription,
        title: l10n.healthAndSafetyGeneralFriendTitle,
      },
      {
        description: l10n.healthAndSafetyGeneralInstinctsDescription,
        title: l10n.healthAndSafetyGeneralInstinctsTitle,
      },
      {
        description: l10n.healthAndSafetyGeneralShareDescription,
        title: l10n.healthAndSafetyGeneralShareTitle,
      },
    ],
  },

  {
    title: l10n.healthAndSafetyItem,
    bulletPoints: [
      {
        description: l10n.healthAndSafetyItemInspectDescription,
        title: l10n.healthAndSafetyItemInspectTitle,
      },
      {
        description: l10n.healthAndSafetyItemSanitizeDescription,
        title: l10n.healthAndSafetyItemSanitizeTitle,
      },
      {
        description: l10n.healthAndSafetyItemHazardousDescription,
        title: l10n.healthAndSafetyItemHazardousTitle,
      },
      {
        description: l10n.healthAndSafetyItemTransparentDescription,
        title: l10n.healthAndSafetyItemTransparentTitle,
      },
    ],
  },

  {
    title: l10n.healthAndSafetyPrivacy,
    bulletPoints: [
      {
        description: l10n.healthAndSafetyPrivacyChatDescription,
        title: l10n.healthAndSafetyPrivacyChatTitle,
      },
      {
        description: l10n.healthAndSafetyPrivacySharingDescription,
        title: l10n.healthAndSafetyPrivacySharingTitle,
      },
      {
        description: l10n.healthAndSafetyPrivacyRespectDescription,
        title: l10n.healthAndSafetyPrivacyRespectTitle,
      },
    ],
  },

  {
    title: l10n.healthAndSafetyHealth,
    bulletPoints: [
      {
        description: l10n.healthAndSafetyHealthGuidelinesDescription,
        title: l10n.healthAndSafetyHealthGuidelinesTitle,
      },
      {
        description: l10n.healthAndSafetyHealthContactlessDescription,
        title: l10n.healthAndSafetyHealthContactlessTitle,
      },
      {
        description: l10n.healthAndSafetyHealthHomeDescription,
        title: l10n.healthAndSafetyHealthHomeTitle,
      },
    ],
  },

  {
    title: l10n.healthAndSafetyReport,
    bulletPoints: [
      {
        description: l10n.healthAndSafetyReportSuspiciousDescription,
        title: l10n.healthAndSafetyReportSuspiciousTitle,
      },
      {
        description: l10n.healthAndSafetyReportInappropriateDescription,
        title: l10n.healthAndSafetyReportInappropriateTitle,
      },
    ],
  },

  {
    title: l10n.healthAndSafetyLegal,
    bulletPoints: [
      {
        description: l10n.healthAndSafetyLegalAsIsDescription,
        title: l10n.healthAndSafetyLegalAsIsTitle,
      },
      {
        description: l10n.healthAndSafetyLegalFinanceDescription,
        title: l10n.healthAndSafetyLegalFinanceTitle,
      },
    ],
  },

  {
    title: l10n.healthAndSafetyFinalizing,
    bulletPoints: [
      {
        description: l10n.healthAndSafetyFinalizingConfirmDescription,
        title: l10n.healthAndSafetyFinalizingConfirmTitle,
      },
      {
        description: l10n.healthAndSafetyFinalizingFeedbackTitle,
        title: l10n.healthAndSafetyFinalizingFeedbackTitle,
      },
    ],
  },
];
/* eslint-enable sort-keys */

const HealthAndSafety: React.FC = () => (
  <React.Fragment>
    <PageTitle
      breadcrumbs={[
        { title: l10n.home, url: root() },
        { title: l10n.healthAndSafetyPageTitle },
      ]}
      title={l10n.healthAndSafetyPageTitle}
    />
    <Card>
      {healthAndSafetySections.map((section, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          <CardHeader title={section.title} />
          <CardContent>
            <ul>
              {section.bulletPoints.map((bulletPoint, bulletIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={bulletIndex}>
                  <strong>{bulletPoint.title}:</strong>
                  &nbsp;{bulletPoint.description}
                </li>
              ))}
            </ul>
          </CardContent>
        </React.Fragment>
      ))}
      <CardContent>
        <Typography>{l10n.healthAndSafetyConclusion}</Typography>
      </CardContent>
    </Card>
  </React.Fragment>
);

export default HealthAndSafety;
