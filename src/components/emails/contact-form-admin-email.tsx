import {
    REASON_LABELS,
    SUSPECT_BANNER_BODY,
    SUSPECT_BANNER_TITLE,
    buildAdminEnvelope,
} from '@/lib/contact-email-content.mjs';
import {
    BUDGETS,
    DEADLINES,
    PROJECT_TYPES,
    getOptionLabel,
} from '@/lib/contact-options.mjs';
import type { ScreeningResult } from '@/lib/contact-screening.mjs';
import type { ContactFormData } from '@/lib/email-schemas';
import { toSafeFileNameSegments, toSafeSegments } from '@/lib/safe-text.mjs';
import { Fragment } from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from 'react-email';

type ContactFormAdminEmailProps = {
    formData: ContactFormData;
    submittedAt: string;
    screening: ScreeningResult;
    extraAllowedHosts: string[];
};

// Libellé affiché si une valeur de liste fermée est inconnue (même texte que
// la version texte du mail) : la valeur saisie n'est jamais recopiée telle quelle
const UNKNOWN_OPTION_LABEL = 'Valeur non reconnue';

type SafeTextProps = {
    value: string | undefined;
    allowLinks: boolean;
    extraAllowedHosts: string[];
    // Un nom de fichier n'est jamais cliquable et garde le point d'une extension
    // acceptée (`piece.stl`), dans les deux modes
    fileName?: boolean;
};

/**
 * Affiche un texte saisi par le visiteur. Tout passe par `toSafeSegments` : un
 * lien autorisé devient cliquable (seulement si `allowLinks`), tout le reste
 * (lien inconnu, domaine nu, adresse IP, autre schéma) devient du texte désamorcé.
 * Un nom de fichier passe par `toSafeFileNameSegments`, qui s'appuie sur la même
 * règle sans jamais produire de lien.
 */
function SafeText({
    value,
    allowLinks,
    extraAllowedHosts,
    fileName = false,
}: SafeTextProps) {
    const segments = fileName
        ? toSafeFileNameSegments(value ?? '')
        : toSafeSegments(value ?? '', { allowLinks, extraAllowedHosts });
    return (
        <>
            {segments.map(
                (segment, index) =>
                    segment.kind === 'link' ? (
                        <a
                            key={index}
                            href={segment.href}
                            style={linkStyle}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {segment.value}
                        </a>
                    ) : (
                        <Fragment key={index}>{segment.value}</Fragment>
                    )
            )}
        </>
    );
}

export function ContactFormAdminEmail({
    formData,
    submittedAt,
    screening,
    extraAllowedHosts,
}: ContactFormAdminEmailProps) {
    const {
        type,
        firstName,
        lastName,
        email,
        phone,
        company,
        projectType,
        description,
        budget,
        deadline,
        files,
    } = formData;

    // Seul un verdict « clean » rend les liens cliquables : tout autre cas est
    // traité comme suspect, comme dans l'enveloppe et la version texte
    const isClean = screening.verdict === 'clean';
    const envelope = buildAdminEnvelope(screening, email);
    const reasons = (
        Array.isArray(screening.reasons) ? screening.reasons : []
    ).filter((reason) => Object.hasOwn(REASON_LABELS, reason));

    const safe = (value: string | undefined, allowLinks: boolean = isClean) => (
        <SafeText
            value={value}
            allowLinks={allowLinks}
            extraAllowedHosts={extraAllowedHosts}
        />
    );
    const safeFileName = (value: string | undefined) => (
        <SafeText
            value={value}
            allowLinks={false}
            extraAllowedHosts={extraAllowedHosts}
            fileName
        />
    );

    return (
        <Html>
            <Head />
            <Preview>{envelope.subject}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Bandeau d'alerte : demande mise de côté par le tri */}
                    {!isClean && (
                        <Section style={suspectBanner}>
                            <Heading as="h2" style={suspectBannerTitle}>
                                {SUSPECT_BANNER_TITLE}
                            </Heading>
                            <Text style={suspectBannerText}>
                                {SUSPECT_BANNER_BODY}
                            </Text>
                            {reasons.length > 0 && (
                                <>
                                    <Text style={suspectBannerText}>
                                        <strong>Signalé car :</strong>
                                    </Text>
                                    {reasons.map((reason) => (
                                        <Text
                                            key={reason}
                                            style={suspectBannerReason}
                                        >
                                            • {REASON_LABELS[reason]}
                                        </Text>
                                    ))}
                                </>
                            )}
                        </Section>
                    )}

                    {/* Logo Hexo'print */}
                    <Section style={logoSection}>
                        <Img
                            src="https://hexoprint.fr/logos/hexoprint-sans-text-no-bg-250x250.png"
                            alt="Hexo'print - Impression 3D"
                            width="120"
                            height="120"
                            style={logo}
                        />
                    </Section>

                    <Heading style={h1}>Nouvelle demande de devis</Heading>

                    <Text style={text}>
                        Une nouvelle demande de devis a été reçue sur le site
                        Hexo&apos;print.
                    </Text>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Heading as="h2" style={h2}>
                            Informations du contact
                        </Heading>
                        <Text style={text}>
                            <strong>Type :</strong>{' '}
                            {type === 'particulier'
                                ? 'Particulier'
                                : 'Professionnel'}
                        </Text>
                        <Text style={text}>
                            <strong>Nom :</strong> {safe(firstName)}{' '}
                            {safe(lastName)}
                        </Text>
                        {/* Adresse en texte brut : le schéma la valide, et il faut pouvoir la copier */}
                        <Text style={text}>
                            <strong>Email :</strong> {email}
                        </Text>
                        {phone && (
                            <Text style={text}>
                                <strong>Téléphone :</strong> {safe(phone)}
                            </Text>
                        )}
                        {company && (
                            <Text style={text}>
                                <strong>Entreprise :</strong> {safe(company)}
                            </Text>
                        )}
                    </Section>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Heading as="h2" style={h2}>
                            Détails du projet
                        </Heading>
                        <Text style={text}>
                            <strong>Type de projet :</strong>{' '}
                            {getOptionLabel(PROJECT_TYPES, projectType) ??
                                UNKNOWN_OPTION_LABEL}
                        </Text>
                        <Text style={text}>
                            <strong>Description :</strong>
                        </Text>
                        <Section style={descriptionBox}>
                            <Text style={descriptionText}>
                                {safe(description)}
                            </Text>
                        </Section>
                        {budget && (
                            <Text style={text}>
                                <strong>Budget approximatif :</strong>{' '}
                                {getOptionLabel(BUDGETS, budget) ??
                                    UNKNOWN_OPTION_LABEL}
                            </Text>
                        )}
                        {deadline && (
                            <Text style={text}>
                                <strong>Délai souhaité :</strong>{' '}
                                {getOptionLabel(DEADLINES, deadline) ??
                                    UNKNOWN_OPTION_LABEL}
                            </Text>
                        )}
                    </Section>

                    {files && files.length > 0 && (
                        <>
                            <Hr style={hr} />
                            <Section style={section}>
                                <Heading as="h2" style={h2}>
                                    Fichiers joints ({files.length})
                                </Heading>
                                {files.map((file, index) => (
                                    <Text key={index} style={text}>
                                        • <strong>{safeFileName(file.name)}</strong>{' '}
                                        (
                                        {(file.size / 1024 / 1024).toFixed(2)}{' '}
                                        MB)
                                        {isClean && file.url && (
                                            <>
                                                <br />
                                                📥{' '}
                                                <a
                                                    href={file.url}
                                                    style={linkStyle}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Télécharger le fichier
                                                </a>
                                            </>
                                        )}
                                        {!isClean && file.url && (
                                            <>
                                                <br />
                                                {safe(file.url, false)}
                                            </>
                                        )}
                                    </Text>
                                ))}
                            </Section>
                        </>
                    )}

                    <Hr style={hr} />

                    <Text style={footer}>Demande reçue le {submittedAt}</Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '0 5px 10px rgba(20,50,70,.2)',
    marginTop: '20px',
    maxWidth: '600px',
    padding: '20px',
};

const h1 = {
    color: '#24556A',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
};

const h2 = {
    color: '#24556A',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '20px 0 10px 0',
};

const text = {
    color: '#333',
    fontSize: '14px',
    margin: '10px 0',
};

const descriptionBox = {
    margin: '10px 0',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #96CFE7',
    borderRadius: '4px',
};

const descriptionText = {
    color: '#333',
    fontSize: '14px',
    fontStyle: 'italic' as const,
    margin: '0',
};

const section = {
    margin: '20px 0',
};

const hr = {
    borderColor: '#E9E9E9',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    margin: '10px 0',
    textAlign: 'center' as const,
};

const logoSection = {
    textAlign: 'center' as const,
    marginBottom: '30px',
    padding: '20px 0',
};

const logo = {
    width: '120px',
    height: '120px',
    objectFit: 'contain' as const,
    margin: '0 auto',
    display: 'block',
};

const linkStyle = {
    color: '#24556A',
    textDecoration: 'underline',
    fontWeight: 'bold',
};

const suspectBanner = {
    backgroundColor: '#FDECEA',
    border: '2px solid #B71C1C',
    borderRadius: '5px',
    margin: '0 0 20px 0',
    padding: '15px',
};

const suspectBannerTitle = {
    color: '#B71C1C',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
};

const suspectBannerText = {
    color: '#7F1D1D',
    fontSize: '14px',
    margin: '10px 0',
};

const suspectBannerReason = {
    color: '#7F1D1D',
    fontSize: '14px',
    margin: '4px 0 4px 10px',
};
